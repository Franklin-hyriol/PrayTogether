import { Request, Response, NextFunction } from 'express';
import IUser from '../../interfaces/UserInterface';
import PrayerRequest from '../../models/PrayerRequest';

// Middleware pour vérifier si l'utilisateur est l'utilisateur courant ou un administrateur pour une prière spécifique
async function checkOwnerOrAdmin(req: Request, res: Response, next: NextFunction) {
    const user = req.user as IUser;
    const prayerId = req.params.id;

    try {
        // Récupère la prière par son ID
        const prayer = await PrayerRequest.findById(prayerId);

        // Vérifie si la prière existe
        if (!prayer) {
            return res.status(404).json({
                status: 404,
                message: 'Prayer not found.',
                error: [{
                    type: 'not_found',
                    msg: `No prayer found with the ID ${prayerId}`,
                    path: 'params.id',
                    location: 'body'
                }]
            });
        }

        // Vérifie si l'utilisateur connecté est l'auteur de la prière ou un administrateur
        if (user.role === 'admin' || (user._id as string).toString() === prayer.authorId.toString()) {
            return next();
        }

        return res.status(403).json({
            status: 403,
            message: 'Forbidden: Access denied.',
            error: [{
                type: 'forbidden',
                msg: 'You do not have permission to view, modify or delete this element.',
                path: 'params.id',
                location: 'body'
            }]
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Internal server error.',
            error: [{
                type: 'server',
                msg: error instanceof Error ? error.message : 'Unknown error occurred',
                path: 'server',
                location: 'internal'
            }]
        });
    }
}

export default checkOwnerOrAdmin;