import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import passport from '../../config/passport';

// Fonction middleware pour authentifier avec JWT
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: Error | null, user: JwtPayload | false, info: any) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: err.message,
                    stack: err.stack
                }
            });
        }

        if (!user) {
            if (info?.message === 'No auth token') {
                return res.status(401).json({
                    status: 401,
                    message: 'No authentication token provided',
                    error: {
                        type: 'unauthorized',
                        location: 'headers'
                    }
                });
            }

            if (info?.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: 401,
                    message: 'Your access token has expired. Please refresh your token.',
                    error: {
                        type: 'unauthorized',
                        location: 'headers'
                    }
                });
            }

            return res.status(401).json({
                status: 401,
                message: 'You need to provide valid credentials to access this resource',
                error: {
                    type: 'unauthorized',
                    location: 'headers'
                }
            });
        }

        req.user = user;
        next();
    })(req, res, next);
};



export default authenticateJWT;