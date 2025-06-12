
import { Request, Response } from 'express';
import Settings from '../models/Settings';
import IUser from '../interfaces/UserInterface';
import { validationResult } from 'express-validator';

export const getUserSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as IUser;
        const userId = user.id;

        let settings = await Settings.findOne({ userId });

        if (!settings) {
            settings = await Settings.create({ userId });
        }

        res.status(200).json({
            status: 200,
            message: "Settings retrieved successfully.",
            data: settings
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

export const patchUserSettings = async (req: Request, res: Response): Promise<void> => {
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
        const userId = user.id;

        // Cherche les settings existants
        let settings = await Settings.findOne({ userId });

        if (!settings) {
            // Crée si non trouvés
            settings = await Settings.create({ userId });
        }

        const updates = req.body;

        settings.theme = updates.theme ?? settings.theme;
        settings.language = updates.language ?? settings.language;

        if (updates.accessibility) {
            settings.accessibility.textSize = updates.accessibility.textSize ?? settings.accessibility.textSize;
            settings.accessibility.highContrast = updates.accessibility.highContrast ?? settings.accessibility.highContrast;
            settings.accessibility.notificationSound = updates.accessibility.notificationSound ?? settings.accessibility.notificationSound;
            settings.accessibility.dyslexicFont = updates.accessibility.dyslexicFont ?? settings.accessibility.dyslexicFont;
        }

        await settings.save();

        res.status(200).json({
            status: 200,
            message: "Settings updated successfully.",
            data: settings
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
