import { Request, Response, NextFunction } from 'express';
import IUser from '../../interfaces/UserInterface';

// Assure-toi que req.user correspond à ton type après l'authentification JWT
const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    const allowedRoles = ['admin'];

    if (!req.user) {
        return res.status(403).json({
            status: 403,
            message: 'User is not authenticated.',
            error: [
                {
                    type: "authentication",
                    value: "unauthenticated",
                    msg: "User is not authenticated.",
                    location: "body"
                }
            ]
        });
    }

    // Cast explicite pour que TypeScript comprenne que req.user est de type User
    const user = req.user as IUser;

    // Vérifie si l'utilisateur a l'un des rôles autorisés
    if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
            status: 403,
            message: 'Access denied. This resource is only accessible for admins.',
            error: [
                {
                    type: "unauthorized",
                    value: "Unauthorized",
                    msg: "Access denied. This resource is only accessible for admins.",
                    location: "body"
                }
            ]
        });
    }

    next();
};

export default checkAdmin;

