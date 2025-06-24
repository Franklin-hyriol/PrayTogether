import { Request, Response } from 'express';
import User from '../models/User';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
// import { generateVerificationToken } from '../utils/generateVerificationToken';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
// import { sendEmail } from '../utils/sendEmail';
import IUser from '../interfaces/UserInterface';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ACCESS_TOKEN_EXPIRATION_TIME, ADMIN_EMAIL, BASE_URL, HTTPONLY, JWT_SECRET, NEXT_PUBLIC_ENDPOINT_BASE_URL, REFRESH_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_SECRET, SECURE } from '../config/Env';
import { toMs } from '../utils/toMs';
import { StringValue } from 'ms';
import { serializeUser } from '../helpers/serializeUser';
import GoogleProfile from '../interfaces/GoogleProfile';
import { upload } from '../services/upload';
import multer from 'multer';
import path from 'path';
import Settings from '../models/Settings';
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
            password: hashedPassword,
            role: email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user'
        });


        const accessToken = jwt.sign(
            {
                id: newUser.id,
                expiresIn: ACCESS_TOKEN_EXPIRATION_TIME as string
            },
            JWT_SECRET as string
        )

        // generate refresh token
        const refreshToken = jwt.sign(
            {
                id: newUser.id
            },
            REFRESH_TOKEN_SECRET as string
        )

        // save refresh token in cookie
        res.cookie("refresh_token", refreshToken, {
            httpOnly: HTTPONLY, 
            secure: SECURE, 
            path: "/",
            sameSite: "none",
        });


        newUser.refreshToken = refreshToken
        // Enregistrer l'utilisateur dans la base de données
        await newUser.save();

        // --- AJOUT ---
        await Settings.create({ userId: newUser._id });
        // --- FIN DE L'AJOUT ---

        // Répondre avec l'utilisateur créé
        res.status(201).json({
            status: 201,
            message: 'User created successfully',
            data: {
                user: serializeUser(newUser),
                accessToken: "Bearer " + accessToken
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


// Connexion d'un utilisateur
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400).json({
            status: 400,
            message: "Server-side validation error. Please check and try again.",
            errors: validation.array()
        });
        return;
    }

    const { email, password, rememberMe } = req.body;

    try {
        const userExists = await User.findOne({ email: email });
        if (!userExists) {
            res.status(404).json({
                status: 404,
                message: `The user ${email} was not found. Please check your email address.`,
                error: [{
                    type: "field",
                    value: email,
                    msg: `The user ${email} was not found. Please check your email address.`,
                    path: "email",
                    location: "body"
                }]
            });
            return;
        }

        // Vérifier le mot de passe
        const passwordMatch = await bcrypt.compare(password, userExists.password);

        if (!passwordMatch) {
            // 👉 Cas spécial : utilisateur Google
            if (userExists.provider === "google") {
                res.status(403).json({
                    status: 403,
                    message: "You signed up with Google. Please log in with Google and update your password from your profile settings.",
                    error: [{
                        type: "field",
                        value: email,
                        msg: "You signed up with Google. Please log in with Google and update your password from your profile settings.",
                        path: "password",
                        location: "body"
                    }]
                });
            } else {
                // Cas normal : mauvais mot de passe classique
                res.status(401).json({
                    status: 401,
                    message: "The passwords do not match. Please check and try again.",
                    error: [{
                        type: "field",
                        value: password,
                        msg: "The passwords do not match. Please check and try again.",
                        path: "password",
                        location: "body"
                    }]
                });
            }
            return;
        }

        // Générer access token
        const accessToken = jwt.sign(
            {
                id: userExists.id,
                expiresIn: ACCESS_TOKEN_EXPIRATION_TIME as string
            },
            JWT_SECRET as string
        );

        const jwtOptions: jwt.SignOptions | undefined = rememberMe
            ? { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME as StringValue }
            : undefined;

        const refreshToken = jwt.sign(
            { id: userExists.id },
            REFRESH_TOKEN_SECRET as string,
            jwtOptions
        );

        res.cookie("refresh_token", refreshToken, {
            httpOnly: HTTPONLY,
            secure: SECURE,
            path: "/",
            sameSite: "none",
            ...(rememberMe
                ? { maxAge: toMs(REFRESH_TOKEN_EXPIRATION_TIME as StringValue) }
                : {}),
        });

        await User.updateOne(
            { _id: userExists.id },
            { $set: { refreshToken } }
        );

        res.status(200).json({
            status: 200,
            message: 'User logged in successfully',
            data: {
                user: serializeUser(userExists),
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



export const GoogleAuth = async (req: Request, res: Response): Promise<void> => {
    const profile = req.user as GoogleProfile;

    if (!profile || !profile.emails || profile.emails.length === 0) {
        res.status(400).json({
            status: 400,
            message: "Bad request",
            errors: [{
                type: "field",
                value: profile,
                msg: "Email not provided by Google",
                path: "email",
                location: "body"
            }]
        });
        return;
    }

    const email = profile.emails[0].value;
    const username = profile.displayName;
    const avatar = profile.photos?.[0]?.value ?? null;

    try {
        let user = await User.findOne({ email: email });

        if (!user) {
            // Création du nouvel utilisateur
            user = new User({
                email: email,
                username: username,
                password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
                role: email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user',
                provider: 'google',
                googleId: profile.id,
                profilePhoto: avatar
            });

            await user.save();
        }

        const refreshToken = jwt.sign(
            {
                id: user.id
            },
            REFRESH_TOKEN_SECRET as string
        );


        await User.updateOne(
            { _id: user.id },
            { $set: { refreshToken } }
        );

        res.cookie("refresh_token", refreshToken, {
            httpOnly: HTTPONLY, 
            secure: SECURE,
            path: "/", 
            sameSite: "none",
        });

        console.log(res);
    
        res.redirect(`${NEXT_PUBLIC_ENDPOINT_BASE_URL}/prayer-room` as string);

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


export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    // L'utilisateur est déjà attaché à la requête via un middleware (par exemple, via JWT)
    const user = req.user as IUser;

    if (!user) {
        res.status(401).json({
            status: 401,
            message: "User not authenticated",
            error: [{
                type: "authentication",
                msg: "User not authenticated",
                location: "user",
            }]
        });
        return;
    }

    try {
        // Trouver l'utilisateur dans la base de données
        const existingUser = await User.findById(user.id);
        if (!existingUser) {
            res.status(404).json({
                status: 404,
                message: "User not found",
                error: [{
                    type: "user",
                    msg: "User not found in the database",
                    location: "user",
                }]
            });
            return;
        }

        // Supprimer le refresh token de l'utilisateur dans la base de données
        existingUser.refreshToken = null;
        await existingUser.save();

        // Supprimer le refresh token du cookie (en utilisant une cookie avec le flag HttpOnly)
        res.clearCookie('refresh_token', {
            httpOnly: HTTPONLY,
            secure: SECURE,
            path: "/",
            sameSite: "none", // ✅ plus permissif pour les tests (strict bloque parfois même en local)
        });

        res.status(200).json({
            status: 200,
            message: "Successfully logged out",
            data: {
                message: "Successfully logged out"
            }
        });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};


//refresh token
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
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
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET as string) as { id: string };

        const user = await User.findById(decoded.id);

        if (!user) {
            // Supprimer le cookie s’il n’y a pas d’utilisateur correspondant
            res.clearCookie('refresh_token', {
                httpOnly: HTTPONLY,
                secure: SECURE,
                path: "/",
                sameSite: "none",
            });

            res.status(401).json({
                status: 401,
                message: "User not found",
                error: [{
                    type: "cookie",
                    value: token,
                    msg: "User not found",
                    path: "refresh_token",
                    location: "cookies"
                }]
            });
            return;
        }

        if (user.refreshToken !== token) {
            // Si le token ne correspond pas à celui en base, on le supprime du navigateu
            res.status(401).json({
                status: 401,
                message: "This session is no longer valid. Please log in again.",
                error: [{
                    type: "cookie",
                    value: token,
                    msg: "Invalid session (token mismatch). Re-authentication required.",
                    path: "refresh_token",
                    location: "cookies"
                }]
            });
            return;
        }

        const newAccessToken = jwt.sign(
            {
                id: decoded.id,
                expiresIn: ACCESS_TOKEN_EXPIRATION_TIME as string
            },
            JWT_SECRET as string
        );

        res.status(200).json({
            status: 200,
            message: "Access token refreshed successfully",
            data: {
                accessToken: "Bearer " + newAccessToken
            }
        });

    } catch (error) {
        // Supprimer le cookie s’il est invalide ou expiré
        res.clearCookie('refresh_token', {
            httpOnly: HTTPONLY,
            secure: SECURE,
            path: "/",
            sameSite: "none",
        });

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
            .lean();


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
            data: serializeUser(foundUser)
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


export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as IUser;

        if (!user) {
            res.status(401).json({
                status: 401,
                message: 'Unauthorized',
                error: [{
                    type: 'authentication',
                    msg: 'User not authenticated',
                    path: 'token',
                    location: 'headers',
                }],
            });
            return;
        }

        // Intégration du middleware upload.single()
        upload.single('image')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                res.status(400).json({
                    status: 400,
                    message: 'Bad request',
                    error: [{
                        type: 'multer',
                        msg: err.message,
                        path: 'image',
                        location: 'body',
                    }],
                });
                return;
            } else if (err) {
                res.status(400).json({
                    status: 400,
                    message: 'Bad request',
                    error: [{
                        type: 'multer',
                        msg: err.message,
                        path: 'image',
                        location: 'body',
                    }],
                });
                return;
            }

            if (!req.file) {
                res.status(400).json({
                    status: 400,
                    message: 'Bad request',
                    error: [{
                        type: 'multer',
                        msg: 'No image sent',
                        path: 'image',
                        location: 'body',
                    }],
                });
                return;
            }

            // Supprimer l’ancienne image si elle existe
            const previousImage = user.profilePhoto;
            if (previousImage) {
                const oldPath = path.join('uploads', path.basename(previousImage));
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            // Construire l’URL relative (adaptée pour front + publique via express.static)
            const newImageUrl = `${BASE_URL}/uploads/${req.file.filename}`;

            // Mettre à jour l’utilisateur
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { profilePhoto: newImageUrl },
                { new: true }
            );

            if (!updatedUser) {
                res.status(404).json({
                    status: 404,
                    message: 'User not found',
                    error: [{
                        type: "field",
                        value: user._id,
                        msg: "User not found",
                        path: "_id",
                        location: "params"
                    }]
                });
                return;
            }

            res.status(200).json({
                status: 200,
                message: 'Profile image updated',
                data: serializeUser(updatedUser),
            });
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: error.message,
                    stack: error.stack,
                },
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                error: {
                    message: 'Unknown error occurred',
                    stack: '',
                },
            });
        }
    }
};


// Obtenir tous les utilisateurs
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Récupération des utilisateurs sans exposer le mot de passe
        const users = await User.find()
            .select('_id email username role profilePhoto totalPrayersReceived totalHeartsReceived totalPrayersMade isBenefactor password_reset_token password_reset_expires, refreshToken, createdAt')
            .lean();


        if (!users || users.length === 0) {
            res.status(200).json({
                status: 200,
                message: 'No users found.',
                data: {
                    users: [],
                    total: 0
                }
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
        res.status(400).json({
            status: 400,
            message: "Server-side validation error. Please check and try again.",
            errors: validation.array()
        });
        return;
    }

    const { email } = req.body;

    try {
        // Recherche l'utilisateur par e-mail
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({
                status: 404,
                message: `The user ${email} was not found. Please check your email address.`,
                error: [{
                    type: "field",
                    value: email,
                    msg: `The user ${email} was not found. Please check your email address.`,
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
        const resetLink = `${NEXT_PUBLIC_ENDPOINT_BASE_URL}/reset-password/?token=${resetToken}`;

        console.log(resetLink);

        // Retourne le lien pour la réinitialisation
        res.status(200).json({
            status: 200,
            message: 'Password reset link generated successfully.',
            data: {
                message: 'Password reset link generated successfully.',
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
        const user = await User.findById(userId).lean();

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
            data: serializeUser(user)
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
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400).json({
            status: 400,
            message: "Bad request",
            errors: validation.array()
        });
        return;
    }

    const userId = req.params.id;
    const {
        username,
        password,
        newPassword,
        isBenefactor
    } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                status: 404,
                message: 'User not found',
                error: [{
                    type: "field",
                    value: userId,
                    msg: "User not found",
                    path: "id",
                    location: "params"
                }]
            });
            return;
        }

        // ✅ Mise à jour du nom d'utilisateur (sans vérification de doublon ici)
        if (username !== undefined) user.username = username;

        // 🔐 Gestion du changement de mot de passe
        if (newPassword) {
            // 🛑 Si utilisateur est inscrit via Google, il ne peut pas changer son mot de passe ici
            if (user.provider === 'google') {
                res.status(400).json({
                    status: 400,
                    message: 'Password change not allowed for Google accounts. Use "Forgot password" instead.',
                    error: [{
                        type: "provider",
                        value: "google",
                        msg: "You cannot change your password for a Google account. Please use the 'Forgot password' option instead.",
                        path: "newPassword",
                        location: "body"
                    }]
                });
                return;
            }

            if (!password) {
                res.status(400).json({
                    status: 400,
                    message: 'Current password is required to change password',
                    error: [{
                        type: "field",
                        value: '',
                        msg: "Current password is required",
                        path: "password",
                        location: "body"
                    }]
                });
                return;
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                res.status(401).json({
                    status: 401,
                    message: 'Current password is incorrect',
                    error: [{
                        type: "field",
                        value: password,
                        msg: "Current password is incorrect",
                        path: "password",
                        location: "body"
                    }]
                });
                return;
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
        }

        if (isBenefactor !== undefined) user.isBenefactor = isBenefactor;

        await user.save();

        res.status(200).json({
            status: 200,
            message: 'User updated successfully',
            data: serializeUser(user)
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: [{
                type: "server",
                value: null,
                msg: error instanceof Error ? error.message : "Unknown error occurred",
                path: "",
                location: "server"
            }]
        });
    }
};

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

        // Supprime l'utilisateur et déclenche le hook `pre('deleteOne')`
        await user.deleteOne();

        res.clearCookie('refresh_token', {
            httpOnly: HTTPONLY,
            secure: SECURE,
            path: "/",
            sameSite: "none",
        });

        res.status(200).json({
            status: 200,
            message: 'User and related data deleted successfully'
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

// // Méthode pour reinitialiser le mot de passe
export const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400).json({
            status: 400,
            message: "Server-side validation error. Please check and try again.",
            errors: validation.array()
        });
        return;
    }

    const { token, password, confirm_password } = req.body;

    try {
        // Recherche l'utilisateur par le token de réinitialisation
        const user = await User.findOne({ where: { password_reset_token: token } });

        if (!user) {
            res.status(404).json({
                status: 404,
                message: "Invalid or expired password reset token. Please request a new one.",
                error: [{
                    type: "field",
                    value: token,
                    msg: "Invalid or expired password reset token. Please request a new one.",
                    path: "token",
                    location: "body"
                }]
            });
            return;
        }

        // Vérifie que les mots de passe correspondent
        if (password !== confirm_password) {
            res.status(400).json({
                status: 400,
                message: "The passwords do not match. Please check and try again.",
                error: [{
                    type: "field",
                    value: password,
                    msg: "The passwords do not match. Please check and try again.",
                    path: "password",
                    location: "body"
                }]
            });
            return;
        }

        // Hash le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Met à jour le mot de passe de l'utilisateur
        user.password = hashedPassword;

        // Supprime le token de réinitialisation
        user.password_reset_token = null;
        user.password_reset_expires = null;

        // Sauvegarde l'utilisateur
        await user.save();

        res.status(200).json({
            status: 200,
            message: 'Password updated successfully.',
            data: {
                message: "Password updated successfully."
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

