import { Request, Response, NextFunction } from 'express';
import IUser from '../../interfaces/UserInterface';


// Middleware pour vérifier si l'utilisateur est l'utilisateur courant ou un administrateur
function checkUsersByIdOrAdmin(req: Request, res: Response, next: NextFunction) {
    const user = req.user as IUser; // Récupère l'utilisateur connecté
    const userIdToCheck = req.params.id; // L'ID de l'utilisateur à modifier (provenant de l'URL)

    if (user.role === 'admin' || user.id === userIdToCheck) {
        // Si l'utilisateur est un admin ou l'utilisateur courant
        next(); // Passer au middleware suivant ou à la route
    } else {
        // Si l'utilisateur n'a pas les permissions nécessaires
        res.status(403).json(
            {
                status: 403,
                message: 'Access denied: You do not have permission to perform this action.'
            }
        );
    }
}

export default checkUsersByIdOrAdmin;