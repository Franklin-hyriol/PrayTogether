import { Request, Response, NextFunction } from 'express';
import User from '../../models/User';

// Middleware pour vérifier si l'utilisateur est l'utilisateur courant ou un administrateur
function checkConnectedUsersOrAdmin(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User; // Récupère l'utilisateur connecté
    const userId = req.params.id; // Récupère l'ID de l'utilisateur à partir des paramètres de la requête

    // Vérifie si l'utilisateur connecté est un administrateur ou s'il est lui-même l'utilisateur ciblé
    if (user.role === 'admin' || user.id === userId) {
        return next(); // Autoriser l'accès
    }

    // Si l'utilisateur n'est ni admin, ni lui-même l'utilisateur ciblé, refuser l'accès
    return res.status(403).json({ message: 'Forbidden: Access denied' });
}

export default checkConnectedUsersOrAdmin;
