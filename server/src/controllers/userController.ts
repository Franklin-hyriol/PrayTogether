import { Request, Response } from 'express';
import User from '../models/User';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
// import { generateVerificationToken } from '../utils/generateVerificationToken';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
// import { stat } from 'fs';
// import { sendEmail } from '../utils/sendEmail';
import IUser from '../interfaces/UserInterface';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from '../config/Env';
dotenv.config();

// Créer un nouvel utilisateur
export const createUser = async (req: Request, res: Response): Promise<void> => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400).json({
            status: 400,
            message: "Bad request",
            errors: validation.array()
        });
        return;
    }

    const { username, email, password } = req.body;

    try {
        // Vérifie si l'email est déjà utilisé
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            res.status(409).json({
                status: 409,
                message: 'Email already in use',
                error: [{
                    type: "field",
                    value: existingUser.email,
                    msg: "Email already in use",
                    path: "email",
                    location: "body"
                }]
            });
            return;
        }

        // Hacher le mot de passe avant de l'enregistrer
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur avec le modèle MongoDB
        const newUser = new User({
            email,
            username,
            password: hashedPassword
        });

        // Enregistrer l'utilisateur dans la base de données
        await newUser.save();

        const accessToken = jwt
            .sign(
                {
                    id: newUser.id,
                },
                JWT_SECRET as string,
                { expiresIn: "2m" }
            )


        // generate refresh token
        const refreshToken = jwt.sign(
            { id: newUser.id },
            REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        );

        // save refresh token in cookie
        // res.cookie("refresh_token", refreshToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     path: "/refresh-token",
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
        // });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: false, // ❌ TEMPORAIREMENT désactiver HttpOnly pour voir/manipuler le cookie dans Postman
            secure: false, // ✅ false en local (si tu n'utilises pas HTTPS)
            path: "/", // ✅ mettre un chemin plus général pour qu'il soit envoyé sur toutes les routes
            sameSite: "lax", // ✅ plus permissif pour les tests (strict bloque parfois même en local)
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        });

        // Répondre avec l'utilisateur créé
        res.status(201).json({
            status: 201,
            message: 'User created successfully',
            data: {
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role,
                    isAnonymous: newUser.isAnonymous,
                    tempId: newUser.tempId,
                    provider: newUser.provider,
                    profilePhoto: newUser.profilePhoto
                },
                accessToken: "Bearer " + accessToken
            }
        });


        // // Envoi d'un email de confirmation
        // sendEmail(newUser.email, 'Ceci est le corps de votre message.')
        //     .then(() => console.log('Email envoyé avec succès'))
        //     .catch(err => console.error('Erreur :', err));

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: error.message,
                    stack: error.stack
                }
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: 'Unknown error occurred',
                    stack: ''
                }
            });
        }
    }
}

// Connexion d'un utilisateur
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400).json({
            status: 400,
            message: "Bad request",
            errors: validation.array()
        });
        return;
    }

    const { email, password } = req.body;
    try {
        const userExists = await User.findOne({ email: email });
        if (!userExists) {
            res.status(404).json({
                status: 404,
                message: "User not found",
                error: [{
                    type: "field",
                    value: email,
                    msg: "User not found",
                    path: "email",
                    location: "body"
                }]
            });
            return;
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, userExists.password);
        if (!passwordMatch) {
            res.status(401).json({
                status: 401,
                message: "Invalid password",
                error: [{
                    type: "field",
                    value: password,
                    msg: "Invalid password",
                    path: "password",
                    location: "body"
                }]
            });
            return;
        }

        // generate access token
        const accessToken = jwt
            .sign(
                {
                    id: userExists.id,
                },
                JWT_SECRET as string,
                { expiresIn: "2m" }
            )


        // generate refresh token
        const refreshToken = jwt.sign(
            { id: userExists.id },
            REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        );

        // save refresh token in cookie
        // res.cookie("refresh_token", refreshToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     path: "/refresh-token",
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
        // });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: false, // ❌ TEMPORAIREMENT désactiver HttpOnly pour voir/manipuler le cookie dans Postman
            secure: false, // ✅ false en local (si tu n'utilises pas HTTPS)
            path: "/", // ✅ mettre un chemin plus général pour qu'il soit envoyé sur toutes les routes
            sameSite: "lax", // ✅ plus permissif pour les tests (strict bloque parfois même en local)
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        });


        res.status(200).json({
            status: 200,
            message: 'User logged in successfully',
            data: {
                user: {
                    id: userExists._id,
                    username: userExists.username,
                    email: userExists.email,
                    role: userExists.role,
                    isAnonymous: userExists.isAnonymous,
                    tempId: userExists.tempId,
                    provider: userExists.provider,
                    profilePhoto: userExists.profilePhoto
                },
                accessToken: "Bearer " + accessToken
            }
        });


    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: error.message,
                    stack: error.stack
                }
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: 'Unknown error occurred',
                    stack: ''
                }
            });
        }
    }
};


//refresh token
export const refreshAccessToken = (req: Request, res: Response): void => {
    const token = req.cookies.refresh_token;

    if (!token) {
        res.status(401).json({
            status: 401,
            message: "Refresh token not found",
            error: [{
                type: "cookie",
                value: null,
                msg: "Refresh token not found",
                path: "refresh_token",
                location: "cookies"
            }]
        });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            REFRESH_TOKEN_SECRET as string
        ) as { id: string };

        const newAccessToken = jwt.sign(
            { id: decoded.id },
            JWT_SECRET as string,
            { expiresIn: "2m" }
        );

        res.status(200).json({
            status: 200,
            message: "Access token refreshed successfully",
            data: {
                accessToken: "Bearer " + newAccessToken
            }
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(403).json({
                status: 403,
                message: "Invalid or expired refresh token",
                error: [{
                    type: "cookie",
                    value: token,
                    msg: "Invalid or expired refresh token",
                    path: "refresh_token",
                    location: "cookies"
                }]
            });
        } else {
            res.status(500).json({
                status: 500,
                message: "Internal server error",
                error: {
                    message: "Unknown error occurred",
                    stack: ""
                }
            });
        }
    }
};



// Méthode pour Obtenir le profil de l'utilisateur connecté
export const getConnectedUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as IUser;

        if (!user) {
            res.status(401).json({
                status: 401,
                message: "Unauthorized",
                error: [{
                    type: "authentication",
                    msg: "User not authenticated",
                    path: "token",
                    location: "headers"
                }]
            });
            return;
        }

        const foundUser = await User.findById(user._id)
            .select('_id email username role isAnonymous tempId profilePhoto badges showBadges totalPrayersReceived totalUpvotesReceived totalPrayersMade isBenefactor')
            .lean(); // Convertit en objet JS pour permettre des modifications


        if (!foundUser) {
            res.status(404).json({
                status: 404,
                message: "User not found",
                error: [{
                    type: "field",
                    value: user._id,
                    msg: "User not found",
                    path: "id",
                    location: "auth"
                }]
            });
            return;
        }

        res.status(200).json({
            status: 200,
            message: "User retrieved successfully",
            data: foundUser
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: error.message,
                    stack: error.stack
                }
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: 'Unknown error occurred',
                    stack: ''
                }
            });
        }
    }
};


// Obtenir tous les utilisateurs
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Récupération des utilisateurs sans exposer le mot de passe
        const users = await User.find()
            .select('_id email username role isAnonymous tempId profilePhoto badges showBadges totalPrayersReceived totalUpvotesReceived totalPrayersMade isBenefactor')
            .lean();

        if (!users || users.length === 0) {
            res.status(404).json({
                status: 404,
                message: 'No users found.',
                error: [
                    {
                        type: "not_found",
                        value: "No users found",
                        msg: "There are no users available in the system.",
                        location: "body"
                    }
                ]
            });
        }

        // Réponse avec les utilisateurs
        res.status(200).json({
            status: 200,
            message: 'Users retrieved successfully.',
            data: {
                users: users,
                total: users.length
            }
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: error.message,
                    stack: error.stack
                }
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: 'Unknown error occurred',
                    stack: ''
                }
            });
        }
    }
};


// Méthode pour obtenir un token de réinitialisation de mot de passe
export const getResetPasswordToken = async (req: Request, res: Response): Promise<void> => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400).json({ errors: validation.array() });
        return;
    }

    const { email } = req.body;

    try {
        // Recherche l'utilisateur par e-mail
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({
                status: 404,
                message: "User not found",
                error: [{
                    type: "field",
                    value: email,
                    msg: "User not found",
                    path: "email",
                    location: "body"
                }]
            });
            return;
        }

        // Supprimer l'ancien token s'il existe
        user.password_reset_token = null;
        user.password_reset_expires = null;

        // Génère un nouveau token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Définit la date d'expiration du token (1 heure à partir de maintenant)
        const resetExpires = new Date(Date.now() + 3600000); // 1 heure

        // Met à jour l'utilisateur avec le nouveau token et la date d'expiration
        user.password_reset_token = resetToken;
        user.password_reset_expires = resetExpires;

        // Sauvegarde les modifications dans la base de données
        await user.save();

        // Génère le lien de réinitialisation
        const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

        // Retourne le lien pour la réinitialisation
        res.status(200).json({
            status: 200,
            message: 'Password reset link generated successfully.',
            data: {
                resetLink: resetLink
            }
        });

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: error.message,
                    stack: error.stack
                }
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: 'Unknown error occurred',
                    stack: ''
                }
            });
        }
    }
}

// Obtenir un utilisateur par son ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    // Vérification si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404).json({
            status: 404,
            message: 'Invalid user ID.',
            error: [
                {
                    type: "invalid id",
                    value: "Invalid user ID",
                    msg: "The provided user ID is invalid.",
                    location: "headers"
                }
            ]
        });
        return;
    }

    try {
        // Recherche de l'utilisateur par son _id
        const user = await User.findById(userId, {
            _id: 1, email: 1, username: 1, role: 1, isAnonymous: 1, tempId: 1, profilePhoto: 1, badges: 1, showBadges: 1, totalPrayersReceived: 1, totalUpvotesReceived: 1, totalPrayersMade: 1, isBenefactor: 1
        });

        // Si l'utilisateur n'est pas trouvé
        if (!user) {
            res.status(404).json({
                status: 404,
                message: 'No users found.',
                error: [
                    {
                        type: "not_found",
                        value: "No users found",
                        msg: "There are no users available in the system.",
                        location: "headers"
                    }
                ]
            });
            return;
        }

        // Réponse avec les données de l'utilisateur
        res.status(200).json({
            status: 200,
            message: 'User retrieved successfully.',
            data: user
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: error.message,
                    stack: error.stack
                }
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: 'Unknown error occurred',
                    stack: ''
                }
            });
        }
    }
};

// //Metter a jour un utilisateur
// export const updateUser = async (req: Request, res: Response): Promise<void> => {
//     const validation = validationResult(req);
//     if (!validation.isEmpty()) {
//         res.status(400).json({ errors: validation.array() });
//         return;
//     }


//     const userId = req.params.id;
//     try {
//         const user = await User.findByPk(userId);
//         if (!user) {
//             res.status(404).json({ message: 'User not found' });
//             return;
//         }

//         // Extrait les champs du corps de la requête
//         const { username, email, role, profile_picture, bio, points, badge_id, moderator_threshold, email_verified } = req.body;

//         // Met à jour l'utilisateur avec les champs spécifiés
//         await user.update({
//             username,
//             email,
//             role,
//             profile_picture,
//             bio,
//             points,
//             badge_id,
//             moderator_threshold,
//             email_verified
//         });

//         // Récupère l'utilisateur mis à jour avec les attributs souhaités
//         const updatedUser = await User.findByPk(userId, {
//             attributes: [
//                 'id',
//                 'username',
//                 'email',
//                 'role',
//                 'profile_picture',
//                 'bio',
//                 'points',
//                 'badge_id',
//                 'moderator_threshold'
//             ]
//         });

//         // Retourne l'utilisateur mis à jour
//         res.status(200).json(updatedUser);
//     } catch (error) {
//         res.status(500).json({
//             message: 'Internal server error',
//             error: error
//         });
//     }
// };

// Méthode pour supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                status: 404,
                message: 'No users found.',
                error: [
                    {
                        type: "not_found",
                        value: "No users found",
                        msg: "There are no users available in the system.",
                        location: "headers"
                    }
                ]
            });
            return;
        }

        // // Suppression manuelle des documents liés
        // await Post.deleteMany({ userId });
        // await Comment.deleteMany({ userId });

        // Suppression de l'utilisateur
        await User.deleteOne({ _id: userId });

        res.status(200).json(
            {
                status: 200,
                message: 'User and related data deleted successfully'
            }
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: error.message,
                    stack: error.stack
                }
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: 'Unknown error occurred',
                    stack: ''
                }
            });
        }
    }
};

// // Méthode pour modifier le mot de passe d'un utilisateur
// export const updateUserPassword = async (req: Request, res: Response): Promise<void> => {
//     const validation = validationResult(req);
//     if (!validation.isEmpty()) {
//         res.status(400).json({ errors: validation.array() });
//         return;
//     }

//     const userId = req.params.id; // Récupère l'ID de l'utilisateur à mettre à jour
//     const { oldPassword, password_hash, password_hash_valid } = req.body; // Récupère les mots de passe du corps de la requête

//     // Vérifie si les nouveaux mots de passe correspondent
//     if (password_hash !== password_hash_valid) {
//         res.status(400).json({ message: 'New passwords do not match.' });
//         return;
//     }

//     try {
//         const user = await User.findByPk(userId); // Trouve l'utilisateur par ID
//         if (!user) {
//             res.status(404).json({ message: 'User not found.' });
//             return;
//         }

//         // Vérifie que l'ancien mot de passe est correct
//         const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
//         if (!isOldPasswordValid) {
//             res.status(400).json({ message: 'Old password is incorrect.' });
//             return;
//         }

//         // Hachage du nouveau mot de passe avant de le sauvegarder
//         user.password_hash = await bcrypt.hash(password_hash, 10);

//         await user.save();
//         res.status(200).json({
//             message: 'Password updated successfully.',
//             user: {
//                 id: user.id,
//                 username: user.username,
//                 email: user.email
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: 'Internal server error.',
//             error: error
//         });
//     }
// }

// // Méthode pour reinitialiser le mot de passe
// export const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
//     const validation = validationResult(req);
//     if (!validation.isEmpty()) {
//         res.status(400).json({ errors: validation.array() });
//         return;
//     }

//     const { token_reset, password_hash, password_hash_valid } = req.body;

//     try {
//         // Recherche l'utilisateur par le token de réinitialisation
//         const user = await User.findOne({ where: { password_reset_token: token_reset } });

//         if (!user) {
//             res.status(400).json({ error: 'Invalid or expired token.' });
//             return;
//         }

//         // Vérifie que les mots de passe correspondent
//         if (password_hash !== password_hash_valid) {
//             res.status(400).json({ error: 'Passwords do not match.' });
//             return;
//         }

//         // Hash le nouveau mot de passe
//         const hashedPassword = await bcrypt.hash(password_hash, 10);

//         // Met à jour le mot de passe de l'utilisateur
//         user.password_hash = hashedPassword;

//         // Supprime le token de réinitialisation
//         user.password_reset_token = null;
//         user.password_reset_expires = null;

//         // Sauvegarde l'utilisateur
//         await user.save();

//         res.status(200).json({ message: 'Password updated successfully.' });
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while updating the password.' });
//     }
// };




// // Methode pour verifier l'email d'un utilisateur
// export const verifyUserEmail = async (req: Request, res: Response): Promise<void> => {
//     const token = req.params.token; // Récupération du token depuis l'URL

//     try {
//         // Rechercher l'utilisateur correspondant au token
//         const user = await User.findOne({ where: { verification_token: token } });

//         if (!user) {
//             res.status(400).json({ message: 'Invalid or expired token' });
//             return;
//         }

//         // Marquer l'utilisateur comme vérifié
//         user.email_verified = true;
//         user.verification_token = null; // Supprimer le token après vérification
//         await user.save();

//         res.status(200).json({ message: 'Email verified successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error', error: error });
//     }
// }

