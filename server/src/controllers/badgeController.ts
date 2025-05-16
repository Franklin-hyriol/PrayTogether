
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Badge from '../models/Badge';
import mongoose from 'mongoose';
import UserBadge from '../models/userBadge';
import IUser from '../interfaces/UserInterface';


export const createBadge = async (req: Request, res: Response): Promise<void> => {
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
        res.status(400).json({
            status: 400,
            message: "Bad request",
            error: validation.array()
        });
        return;
    }

    try {
        const {
            code,
            name,
            description,
            icon,
            isSecret = false,
            condition
        } = req.body;

        // Vérifier unicité du code
        const existingBadge = await Badge.findOne({ code });
        if (existingBadge) {
            res.status(409).json({
                status: 409,
                message: "Conflict",
                error: [{
                    type: "validation",
                    value: code,
                    msg: "A badge with this code already exists.",
                    path: "code",
                    location: "body"
                }]
            });
            return;
        }

        const newBadge = new Badge({
            code,
            name,
            description,
            icon,
            isSecret,
            condition
        });

        const savedBadge = await newBadge.save();

        res.status(201).json({
            status: 201,
            message: "Badge created successfully.",
            data: savedBadge
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


export const getAllBadges = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as IUser;

    try {
        const filter = (req.query.filter as string) || 'all';
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const skip = (page - 1) * limit;

        let query = {};

        if (filter === 'earned') {
            const earnedBadges = await UserBadge.find({ userId: user._id }).select('badgeId');
            const earnedIds = earnedBadges.map(b => b.badgeId.toString());
            query = { _id: { $in: earnedIds } };
        } else if (filter === 'unearned') {
            const earnedBadges = await UserBadge.find({ userId: user._id }).select('badgeId');
            const earnedIds = earnedBadges.map(b => b.badgeId.toString());
            query = { _id: { $nin: earnedIds } };
        }

        const [badges, totalCount] = await Promise.all([
            Badge.find(query).skip(skip).limit(limit),
            Badge.countDocuments(query)
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            status: 200,
            message: "Badges fetched successfully.",
            data: badges,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
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


export const getBadgeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
            status: 400,
            message: "Bad request",
            error: [{
                type: "validation",
                value: id,
                msg: "Invalid badge ID format.",
                path: "id",
                location: "params"
            }]
        });
        return;
    }

    try {
        const badge = await Badge.findById(id);

        if (!badge) {
            res.status(404).json({
                status: 404,
                message: "Badge not found",
                error: [{
                    type: "not_found",
                    value: id,
                    msg: "No badge found with the provided ID.",
                    path: "id",
                    location: "params"
                }]
            });
            return;
        }

        res.status(200).json({
            status: 200,
            message: "Badge retrieved successfully.",
            data: badge
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


export const updateBadge = async (req: Request, res: Response): Promise<void> => {
    const validation = validationResult(req);
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
            status: 400,
            message: "Bad request",
            error: [{
                type: "validation",
                value: id,
                msg: "Invalid badge ID format.",
                path: "id",
                location: "params"
            }]
        });
        return;
    }

    if (!validation.isEmpty()) {
        res.status(400).json({
            status: 400,
            message: "Bad request",
            error: validation.array()
        });
        return;
    }

    try {
        const {
            code,
            name,
            description,
            icon,
            isSecret = false,
            condition
        } = req.body;

        const existingBadge = await Badge.findById(id);
        if (!existingBadge) {
            res.status(404).json({
                status: 404,
                message: "Badge not found",
                error: [{
                    type: "not_found",
                    value: id,
                    msg: "No badge found with the provided ID.",
                    path: "id",
                    location: "params"
                }]
            });
            return;
        }

        // Si le code est changé, s'assurer qu'il reste unique
        if (code && code !== existingBadge.code) {
            const badgeWithSameCode = await Badge.findOne({ code });
            if (badgeWithSameCode) {
                res.status(409).json({
                    status: 409,
                    message: "Conflict",
                    error: [{
                        type: "validation",
                        value: code,
                        msg: "Another badge with this code already exists.",
                        path: "code",
                        location: "body"
                    }]
                });
                return;
            }
        }

        existingBadge.code = code ?? existingBadge.code;
        existingBadge.name = name ?? existingBadge.name;
        existingBadge.description = description ?? existingBadge.description;
        existingBadge.icon = icon ?? existingBadge.icon;
        existingBadge.isSecret = isSecret;
        existingBadge.condition = condition ?? existingBadge.condition;

        const updatedBadge = await existingBadge.save();

        res.status(200).json({
            status: 200,
            message: "Badge updated successfully.",
            data: updatedBadge
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


export const deleteBadge = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
            status: 400,
            message: "Bad request",
            error: [{
                type: "validation",
                value: id,
                msg: "Invalid badge ID format.",
                path: "id",
                location: "params"
            }]
        });
        return;
    }

    try {
        const badge = await Badge.findById(id);
        if (!badge) {
            res.status(404).json({
                status: 404,
                message: "Badge not found",
                error: [{
                    type: "not_found",
                    value: id,
                    msg: "No badge found with the provided ID.",
                    path: "id",
                    location: "params"
                }]
            });
            return;
        }

        // Supprimer tous les UserBadge associés
        await UserBadge.deleteMany({ badgeId: id });

        // Supprimer le badge
        await Badge.findByIdAndDelete(id);

        res.status(200).json({
            status: 200,
            message: "Badge and associated user links deleted successfully."
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