import { validationResult } from "express-validator";
import { Request, Response } from 'express';
import PrayerRequest from "../models/PrayerRequest";
import IUser from "../interfaces/UserInterface";
import User from "../models/User";
import mongoose from "mongoose";
import PrayerInteraction from "../models/prayerInteraction";
import { emitEventForUser } from "../services/emitEventForUser";
import removeAccents from 'remove-accents';
import { EnrichedPrayer } from "../interfaces/PrayerRequestInterface";
import { checkAndAssignAllBadges } from "../services/checkAndAssignAllBadges";
import { toMs } from "../utils/toMs";
import { PRAYER_EXPIRATION_DURATION, PRAYER_VISIBILITY_DURATION } from "../config/Env";
import { StringValue } from "ms";

export const createPrayer = async (req: Request, res: Response): Promise<void> => {
    const validation = validationResult(req);
    const user = req.user as IUser;

    if (!validation.isEmpty()) {
        res.status(400).json({
            status: 400,
            message: "Bad request",
            error: validation.array()
        });
        return;
    }

    try {
        const { text, isUrgent } = req.body;
        const authorId = user._id;

        if (!authorId) {
            res.status(401).json({
                status: 401,
                message: "Unauthorized",
                error: [{
                    type: "auth",
                    value: "",
                    msg: "Authentication required.",
                    path: "authorization",
                    location: "header"
                }]
            });
            return;
        }

        // ✅ Vérifier qu'il a moins de 2 prières actives
        const activePrayerCount = await PrayerRequest.countDocuments({
            authorId: authorId,
            visibilityUntil: { $gt: new Date() } // Encore actives
        });

        if (activePrayerCount >= 2) {
            res.status(403).json({
                status: 403,
                message: "You have reached the limit of 2 active prayers.",
                error: [{
                    type: "limit",
                    value: "",
                    msg: "You already have 2 active prayers.",
                    path: "prayer",
                    location: "body"
                }]
            });
            return;
        }

        // ✅ Création de la nouvelle prière
        const now = new Date();
        const newPrayer = new PrayerRequest({
            authorId,
            text,
            isUrgent: isUrgent || false,
            visibilityUntil: new Date(now.getTime() + toMs(PRAYER_VISIBILITY_DURATION as StringValue || "1d")),
            expiresAt: new Date(now.getTime() + toMs(PRAYER_EXPIRATION_DURATION as StringValue || "7d")),
        });

        const savedPrayer = await newPrayer.save();

        // ➕ Incrémentation du compteur de prières créées
        await User.findByIdAndUpdate(authorId, { $inc: { totalPrayersCreated: 1 } });

        // 📝 Récupérer à nouveau l'utilisateur avec ses données mises à jour
        const updatedUser = await User.findById(authorId);
        if (updatedUser) {
            await checkAndAssignAllBadges(updatedUser);
        }

        res.status(201).json({
            status: 201,
            message: "Prayer request created successfully.",
            data: savedPrayer
        });

    } catch (error) {
        const defaultError = {
            type: "server",
            value: "",
            msg: error instanceof Error ? error.message : "Unknown error occurred",
            path: "server",
            location: "internal"
        };

        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: [defaultError]
        });
    }
};

export const getAllPrayers = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as IUser;
        const filterType = req.query.filter as string;
        const searchQueryRaw = (req.query.search as string)?.trim();
        const searchQuery = searchQueryRaw ? removeAccents(searchQueryRaw.toLowerCase()) : null;

        // Pagination
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const skip = (page - 1) * limit;

        const now = new Date();
        const baseFilter: any = {
            authorId: { $ne: user._id },
            visibilityUntil: { $gt: now } // 👉 seulement les prières encore visibles
        };

        // Récupère toutes les prières visibles
        const prayers = await PrayerRequest.find(baseFilter)
            .populate('authorId', 'username profilePhoto')
            .lean();

        const prayerIds = prayers.map(p => p._id);
        const interactions = await PrayerInteraction.find({
            prayerId: { $in: prayerIds },
            userId: user._id
        }).lean();

        const prayedSet = new Set(interactions.filter(i => i.type === 'prayed').map(i => i.prayerId.toString()));
        const likedSet = new Set(interactions.filter(i => i.type === 'liked').map(i => i.prayerId.toString()));

        // Construction manuelle des objets EnrichedPrayer
        let enrichedPrayers: EnrichedPrayer[] = prayers.map((prayer: any) => {
            const author = prayer.authorId as { username: string; profilePhoto?: string };
            return {
                _id: prayer._id,
                authorId: {
                    username: author.username,
                    profilePhoto: author.profilePhoto,
                },
                text: prayer.text,
                isUrgent: prayer.isUrgent,
                createdAt: prayer.createdAt,
                updatedAt: prayer.updatedAt,
                visibilityUntil: prayer.visibilityUntil,
                expiresAt: prayer.expiresAt,
                isPrayed: prayedSet.has(prayer._id.toString()),
                isLiked: likedSet.has(prayer._id.toString()),
                normalizedText: removeAccents(prayer.text.toLowerCase()),
                normalizedAuthor: removeAccents(author.username.toLowerCase())
            };
        });

        // Filtrage par recherche
        if (searchQuery) {
            const searchWords = searchQuery.split(/\s+/);
            enrichedPrayers = enrichedPrayers.filter(p => {
                const text = p.normalizedText || "";
                const author = p.normalizedAuthor || "";
                return searchWords.every(word =>
                    text.includes(word) || author.includes(word)
                );
            });
        }

        // Filtrage par type
        if (filterType === "prayed") {
            enrichedPrayers = enrichedPrayers.filter(p => p.isPrayed);
        } else if (filterType === "liked") {
            enrichedPrayers = enrichedPrayers.filter(p => p.isLiked);
        } else if (filterType === "unseen") {
            enrichedPrayers = enrichedPrayers.filter(p => !p.isPrayed && !p.isLiked);
        } else if (filterType === "urgent") {
            enrichedPrayers = enrichedPrayers.filter(p => p.isUrgent === true);
        }

        // Suppression des champs temporaires
        enrichedPrayers = enrichedPrayers.map(({ normalizedText, normalizedAuthor, ...rest }) => rest);

        // Calcul pagination
        const totalCount = enrichedPrayers.length;
        const totalPages = Math.ceil(totalCount / limit);
        const paginatedPrayers = enrichedPrayers.slice(skip, skip + limit);

        res.status(200).json({
            status: 200,
            message: "Prayers retrieved successfully.",
            data: paginatedPrayers,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: [{
                type: "server",
                value: "",
                msg: error instanceof Error ? error.message : "Unknown error",
                path: "server",
                location: "internal"
            }]
        });
    }
};

export const getPeopleWhoPrayed = async (req: Request, res: Response): Promise<void> => {
    try {
        const prayerId = req.params.id;
        const now = new Date();
        const page = parseInt(req.query.page as string) || 1;
        const limit = 4;
        const skip = (page - 1) * limit;

        // 🔍 Vérification de l'existence de la prière
        const prayerExists = await PrayerRequest.exists({ _id: prayerId });
        if (!prayerExists) {
            res.status(404).json({
                status: 404,
                message: "Prayer not found.",
                data: []
            });
            return;
        }

        // 📦 Récupération des données avec pagination
        const [totalCount, interactions] = await Promise.all([
            PrayerInteraction.countDocuments({
                prayerId,
                type: "prayed"
            }),
            PrayerInteraction.find({
                prayerId,
                type: "prayed"
            })
                .sort({ createdAt: -1 }) // Les plus récentes en premier
                .skip(skip)
                .limit(limit)
                .populate("userId", "username profilePhoto")
                .lean()
        ]);

        // ✨ Formatage des données de réponse
        const users = interactions.map(inter => ({
            user: inter.userId,
            createdAt: inter.createdAt
        }));

        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            status: 200,
            message: "People who prayed fetched successfully.",
            data: users,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });

    } catch (error) {
        const defaultError = {
            type: "server",
            value: "",
            msg: error instanceof Error ? error.message : "Unknown error occurred",
            path: "server",
            location: "internal"
        };

        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: [defaultError]
        });
    }
};


export const getPeopleWhoLiked = async (req: Request, res: Response): Promise<void> => {
    try {
        const prayerId = req.params.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = 4;
        const skip = (page - 1) * limit;

        // 🔍 Vérification de l'existence de la prière
        const prayerExists = await PrayerRequest.exists({ _id: prayerId });
        if (!prayerExists) {
            res.status(404).json({
                status: 404,
                message: "Prayer not found.",
                data: []
            });
            return;
        }

        // 📦 Récupération des interactions de type "liked" avec pagination
        const [totalCount, interactions] = await Promise.all([
            PrayerInteraction.countDocuments({
                prayerId,
                type: "liked"
            }),
            PrayerInteraction.find({
                prayerId,
                type: "liked"
            })
                .sort({ createdAt: -1 }) // Les plus récents en premier
                .skip(skip)
                .limit(limit)
                .populate("userId", "username profilePhoto")
                .lean()
        ]);

        // ✨ Formatage des données de réponse
        const users = interactions.map(inter => ({
            user: inter.userId,
            createdAt: inter.createdAt
        }));

        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            status: 200,
            message: "People who liked fetched successfully.",
            data: users,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });

    } catch (error) {
        const defaultError = {
            type: "server",
            value: "",
            msg: error instanceof Error ? error.message : "Unknown error occurred",
            path: "server",
            location: "internal"
        };

        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: [defaultError]
        });
    }
};


export const getMyPrayers = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as IUser;
        const now = new Date();

        // 🔥 Étape 1 : Supprimer les prières expirées
        await PrayerRequest.deleteMany({
            authorId: user._id,
            expiresAt: { $lt: now },
        });

        // 🔍 Lecture des paramètres
        const onlyActive = req.query.onlyActive === "true";
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const filter: any = { authorId: user._id };
        if (onlyActive) {
            filter.visibilityUntil = { $gt: now };
        }

        // 📦 Récupérer les prières avec pagination
        const [totalCount, prayers] = await Promise.all([
            PrayerRequest.countDocuments(filter),
            PrayerRequest.find(filter)
                .sort({ createdAt: -1 }) // Les plus récentes en premier
                .skip(skip)
                .limit(limit)
                .populate("authorId", "username profilePhoto")
                .lean(),
        ]);

        // ✨ Enrichir les prières avec les compteurs de likes/prayers
        const enrichedPrayers = await Promise.all(
            prayers.map(async (prayer) => {
                const interactions = await PrayerInteraction.find({
                    prayerId: prayer._id,
                });

                const likesCount = interactions.filter((i) => i.type === "liked").length;
                const prayersCount = interactions.filter((i) => i.type === "prayed").length;

                return {
                    ...prayer,
                    likesCount,
                    prayersCount,
                };
            })
        );

        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            status: 200,
            message: "User's prayers retrieved successfully.",
            data: enrichedPrayers,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        const defaultError = {
            type: "server",
            value: "",
            msg: error instanceof Error ? error.message : "Unknown error occurred",
            path: "server",
            location: "internal",
        };

        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: [defaultError],
        });
    }
};


export const getPrayerById = async (req: Request, res: Response): Promise<void> => {
    try {
        const prayerId = req.params.id;
        const prayer = await PrayerRequest.findById(prayerId);

        if (!prayer) {
            res.status(404).json({
                status: 404,
                message: "Prayer not found.",
                data: []
            });
            return;
        }

        res.status(200).json({
            status: 200,
            message: "Prayer retrieved successfully.",
            data: prayer
        });
    } catch (error) {
        const defaultError = {
            type: "server",
            value: "",
            msg: error instanceof Error ? error.message : "Unknown error occurred",
            path: "server",
            location: "internal"
        };

        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: [defaultError]
        });
    }
}


export const updatePrayer = async (req: Request, res: Response): Promise<void> => {
    const validation = validationResult(req);
    const prayerId = req.params.id;

    if (!validation.isEmpty()) {
        res.status(400).json({
            status: 400,
            message: "Bad request",
            error: validation.array()
        });
    }

    try {

        const updatedPrayer = await PrayerRequest.findByIdAndUpdate(
            prayerId,
            req.body,
            { new: true }
        );

        if (!updatedPrayer) {
            res.status(404).json({
                status: 404,
                message: "Prayer not found.",
                data: []
            });
        }

        res.status(200).json({
            status: 200,
            message: "Prayer updated successfully.",
            data: updatedPrayer
        });
    } catch (error) {
        const defaultError = {
            type: "server",
            value: "",
            msg: error instanceof Error ? error.message : "Unknown error occurred",
            path: "server",
            location: "internal"
        };

        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: [defaultError]
        });
    }
};


export const deletePrayer = async (req: Request, res: Response): Promise<void> => {
    try {
        const prayerId = req.params.id;
        const user = req.user as IUser;  // Récupérer l'utilisateur connecté

        const prayer = await PrayerRequest.findById(prayerId);
        if (!prayer) {
            res.status(404).json({
                status: 404,
                message: "Prayer not found.",
                data: []
            });
            return;
        }

        // Déclenche le hook pre('deleteOne') sur PrayerRequest
        await prayer.deleteOne();

        // Décrémente le compteur totalPrayersCreated de l'utilisateur
        await User.findByIdAndUpdate(user._id, {
            $inc: { totalPrayersCreated: -1 }  // Décrémentation de la valeur
        });

        res.status(200).json({
            status: 200,
            message: "Prayer deleted successfully.",
            data: {
                _id: prayerId
            }
        });
    } catch (error) {
        const defaultError = {
            type: "server",
            value: "",
            msg: error instanceof Error ? error.message : "Unknown error occurred",
            path: "server",
            location: "internal"
        };

        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: [defaultError]
        });
    }
};


export const prayForPrayer = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as IUser;
    const prayerId = req.params.id;

    try {
        // Vérifie que la prière existe
        const prayer = await PrayerRequest.findById(prayerId);
        if (!prayer) {
            res.status(404).json({
                status: 404,
                message: "Prayer not found.",
                data: []
            });
            return;
        }

        // Vérifie si l'utilisateur a déjà prié pour cette prière
        const existingInteraction = await PrayerInteraction.findOne({
            prayerId: new mongoose.Types.ObjectId(prayerId),
            userId: new mongoose.Types.ObjectId(user._id as string),
            type: "prayed"
        });

        if (existingInteraction) {
            res.status(400).json({
                status: 400,
                message: "You have already prayed for this prayer.",
                data: []
            });
            return;
        }

        // Crée une nouvelle interaction "prayed"
        await PrayerInteraction.create({
            prayerId: new mongoose.Types.ObjectId(prayerId),
            userId: new mongoose.Types.ObjectId(user._id as string),
            type: "prayed"
        });

        // Met à jour les compteurs
        const author = await User.findById(prayer.authorId);
        if (author) {
            author.totalPrayersReceived += 1;
            await author.save();

            await checkAndAssignAllBadges(author);
        }

        user.totalPrayersMade += 1;
        await user.save();

        await checkAndAssignAllBadges(user);

        await emitEventForUser(prayerId, "prayedForNotification");

        res.status(200).json({
            status: 200,
            message: "Prayer interaction recorded successfully.",
            data: null
        });

    } catch (error) {
        const defaultError = {
            type: "server",
            value: "",
            msg: error instanceof Error ? error.message : "Unknown error occurred",
            path: "server",
            location: "internal"
        };

        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: [defaultError]
        });
    }
};


export const likeThisPrayer = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as IUser;
    const prayerId = req.params.id;

    try {
        const prayer = await PrayerRequest.findById(prayerId);
        if (!prayer) {
            res.status(404).json({
                status: 404,
                message: "Prayer not found.",
                data: []
            });
            return;
        }

        const userId = new mongoose.Types.ObjectId(user._id as string);

        const existingInteraction = await PrayerInteraction.findOne({
            prayerId: new mongoose.Types.ObjectId(prayerId),
            userId: userId,
            type: "liked"
        });

        const author = await User.findById(prayer.authorId);

        if (existingInteraction) {
            // Déjà liké, on retire le like
            await existingInteraction.deleteOne();

            if (author) {
                author.totalHeartsReceived = Math.max(0, author.totalHeartsReceived - 1);
                await author.save();
            }

            user.totalHeartsGiven = Math.max(0, user.totalHeartsGiven - 1);
            await user.save();
            await emitEventForUser(prayerId, "likeRemovedNotification");

            res.status(200).json({
                status: 200,
                message: "Like removed successfully.",
                data: null
            });
        } else {
            // Pas encore liké, on ajoute
            await PrayerInteraction.create({
                prayerId: new mongoose.Types.ObjectId(prayerId),
                userId: userId,
                type: "liked"
            });

            if (author) {
                author.totalHeartsReceived += 1;
                await author.save();

                await checkAndAssignAllBadges(author);
            }

            user.totalHeartsGiven += 1;
            await user.save();
            await emitEventForUser(prayerId, "likeNotification");

            await checkAndAssignAllBadges(user);

            res.status(200).json({
                status: 200,
                message: "Prayer liked successfully.",
                data: null
            });
        }

    } catch (error) {
        const defaultError = {
            type: "server",
            value: "",
            msg: error instanceof Error ? error.message : "Unknown error occurred",
            path: "server",
            location: "internal"
        };

        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: [defaultError]
        });
    }
};

