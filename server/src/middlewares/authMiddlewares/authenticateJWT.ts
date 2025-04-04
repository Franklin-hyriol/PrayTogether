import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import passport from '../../config/passport';

// Fonction middleware pour authentifier avec JWT
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: Error | null, user: JwtPayload | false, info: any) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            // Vérifier si l'erreur est liée à l'absence de token
            if (info && info.message === 'No auth token') {
                return res.status(401).json({
                    error: [
                        {
                            type: "unauthorized",
                            msg: "No authentication token provided.",
                            location: "headers"
                        }
                    ]
                });
            }

            // Si l'utilisateur n'est pas authentifié, renvoyer un message d'erreur personnalisé
            return res.status(401).json({
                error: [
                    {
                        type: "unauthorized",
                        msg: "You need to provide valid credentials to access this resource",
                        location: "headers"
                    }
                ]
            });
        }

        req.user = user; // Assigner l'utilisateur à la requête pour les prochaines étapes
        next();
    })(req, res, next);
};


export default authenticateJWT;