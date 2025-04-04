import { Request, Response, NextFunction } from 'express';

// Interface pour l'utilisateur
interface User {
    id: number;
    role: 'admin' | 'moderator' | 'user';
}

// Middleware pour vérifier les permissions de mise à jour
function checkUpdatePermissions(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User; // Récupère l'utilisateur connecté

    // Si l'utilisateur est admin, il peut tout mettre à jour
    if (user.role === 'admin') {
        return next();
    }

    // Si l'utilisateur est modérateur, il ne peut mettre à jour que email_verified
    if (user.role === 'moderator') {
        if (req.body.email_verified !== undefined) {
            return next();
        }
        return res.status(403).json({
            message: 'Only email_verified can be updated by moderators.',
            allowedFields: ['email_verified']
        });
    }

    // Si c'est un utilisateur normal, il peut mettre à jour username, profile_picture et bio
    if (user.role === 'user') {
        const allowedFields = ['username', 'profile_picture', 'bio'];
        const fieldsToUpdate = Object.keys(req.body);

        // Vérifie si tous les champs à mettre à jour sont autorisés
        const isValidUpdate = fieldsToUpdate.every(field => allowedFields.includes(field));

        if (isValidUpdate) {
            return next();
        }
        return res.status(403).json({
            message: 'You are not allowed to update these fields.',
            allowedFields: allowedFields
        });
    }

    // Si le rôle n'est pas reconnu
    return res.status(403).json({ message: 'Access denied' });
}

export default checkUpdatePermissions;