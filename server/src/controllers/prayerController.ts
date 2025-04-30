import { validationResult } from "express-validator";
import { Request, Response } from 'express';
import PrayerRequest from "../models/PrayerRequest";
import IUser from "../interfaces/UserInterface";
import User from "../models/User";
import mongoose, { ObjectId, Types } from "mongoose";

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

        const newPrayer = new PrayerRequest({
            authorId,
            text,
            isUrgent: isUrgent || false,
            likedBy: [],
            prayedBy: []
        });

        const savedPrayer = await newPrayer.save();

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
}


export const getAllPrayers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Récupère toutes les prières et peuple les informations de l'utilisateur
        const prayers = await PrayerRequest.find()
            .populate('authorId', 'username profilePhoto')
            .exec();

        if (!prayers || prayers.length === 0) {
            res.status(404).json({
                status: 404,
                message: "No prayers found.",
                data: []
            });
            return;
        }

        res.status(200).json({
            status: 200,
            message: "Prayers retrieved successfully.",
            data: prayers
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


export const getPeopleWhoPrayed = async (req: Request, res: Response): Promise<void> => {
    const prayerId = req.params.id;

    try {
        const prayer = await PrayerRequest.findById(prayerId).populate('prayedBy', 'username profilePhoto');

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
            message: "People who prayed fetched successfully.",
            data: prayer.prayedBy
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

        // Récupération des prières de l'utilisateur depuis la base de données
        const prayers = await PrayerRequest.find({ authorId: user._id })
            .populate('authorId', 'username profilePhoto')
            .exec();

        if (!prayers || prayers.length === 0) {
            res.status(404).json({
                status: 404,
                message: "No prayers found for the user.",
                data: []
            });
            return;
        }

        res.status(200).json({
            status: 200,
            message: "User's prayers retrieved successfully.",
            data: prayers
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
        const deletedPrayer = await PrayerRequest.findByIdAndDelete(prayerId);

        if (!deletedPrayer) {
            res.status(404).json({
                status: 404,
                message: "Prayer not found.",
                data: []
            });
            return;
        }

        res.status(200).json({
            status: 200,
            message: "Prayer deleted successfully.",
            data: deletedPrayer
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


export const prayForPrayer = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as IUser; // Utilisateur connecté à partir de req.user
    const prayerId = req.params.id; // ID de la prière à laquelle l'utilisateur veut prier

    try {
        // Trouver la prière par son ID
        const prayer = await PrayerRequest.findById(prayerId);

        // Vérifier si la prière existe
        if (!prayer) {
            res.status(404).json({
                status: 404,
                message: "Prayer not found.",
                data: []
            });
            return;
        }

        // Vérifier si l'utilisateur a déjà prié pour cette prière
        if (prayer.prayedBy.includes(new mongoose.Types.ObjectId(user._id as string))) {
            res.status(400).json({
                status: 400,
                message: "You have already prayed for this prayer.",
                data: []
            });
            return;
        }

        // Ajouter l'utilisateur à la liste des personnes ayant prié pour cette prière
        prayer.prayedBy.push(new mongoose.Types.ObjectId(user._id as string));

        // Mettre à jour le total de prières reçues pour l'auteur de la prière
        const author = await User.findById(prayer.authorId);
        if (author) {
            author.totalPrayersReceived += 1;
            await author.save();
        }

        // Mettre à jour le total de prières faites pour l'utilisateur qui prie
        user.totalPrayersMade += 1;
        await user.save();

        // Sauvegarder les modifications de la prière
        const updatedPrayer = await prayer.save();

        res.status(200).json({
            status: 200,
            message: "Prayer added successfully.",
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

        if (prayer.likedBy.includes(new mongoose.Types.ObjectId(user._id as string))) {
            res.status(400).json({
                status: 400,
                message: "You have already liked this prayer.",
                data: []
            });
            return;
        }

        prayer.likedBy.push(new mongoose.Types.ObjectId(user._id as string));

        const author = await User.findById(prayer.authorId);
        if (author) {
            author.totalHeartsReceived += 1;
            await author.save();
        }

        user.totalHeartsGiven += 1;
        await user.save();

        const updatedPrayer = await prayer.save();

        res.status(200).json({
            status: 200,
            message: "Prayer liked successfully.",
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
