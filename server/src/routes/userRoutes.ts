import express from 'express';
import { createUser, getAllUsers, getConnectedUser, loginUser, getUserById, getResetPasswordToken, deleteUser, refreshAccessToken, logoutUser, resetUserPassword, GoogleAuth, updateProfile, updateUser } from '../controllers/userController';
import { checkSchema } from 'express-validator';
import { CreateUserValidationSchema } from '../middlewares/Validation/userValidation/CreateUserValidationSchema';
import { LoginUserValidationSchema } from '../middlewares/Validation/userValidation/LoginUserValidationSchema';
import authenticateJWT from '../middlewares/authMiddlewares/authenticateJWT';
import checkAdmin from '../middlewares/authorisationMiddleware/checkAdmin';
// import { UpdateUserValidationSchema } from '../middlewares/Validation/userValidation/UpdateUserValidationSchema';
// import checkUpdatePermissions from '../middlewares/authorisationMiddleware/checkUpdatePermissions';
// import { updateUserPasswordValidationSchema } from '../middlewares/Validation/userValidation/updateUserPasswordValidationSchema';
import { getResetPasswordTokenValidationSchema } from '../middlewares/Validation/userValidation/getResetPasswordTokenValidationSchema';
import checkUsersByIdOrAdmin from '../middlewares/authorisationMiddleware/checkUsersByIdOrAdmin';
import { resetUserPasswordValidationSchema } from '../middlewares/Validation/userValidation/resetUserPasswordValidationSchema';
import passport from '../config/passport';
import { NEXT_PUBLIC_ENDPOINT_BASE_URL } from '../config/Env';
import { UpdateUserValidationSchema } from '../middlewares/Validation/userValidation/UpdateUserValidationSchema';
// import { resetUserPasswordValidationSchema } from '../middlewares/Validation/userValidation/resetUserPasswordValidationSchema';
// import checkUsersByIdOrAdmin from '../middlewares/authorisationMiddleware/checkUsersByIdOrAdmin';

// Crée une instance du routeur Express
const router = express.Router();

// Route pour créer un utilisateur
router.post('/register', checkSchema(CreateUserValidationSchema), createUser);

// Route pour se connecter avec des identifiants locaux
router.post('/login', checkSchema(LoginUserValidationSchema), loginUser);

// Route pour deconnexion
router.post('/logout', authenticateJWT, logoutUser);


//Route pour refresh le token
router.get('/refresh-token', refreshAccessToken);

// Route pour obtenir le profil de l'utilisateur connecté
router.get('/me', authenticateJWT, getConnectedUser);


router.post('/update-profile', authenticateJWT, updateProfile);

// // Route pour obtenir tous les utilisateurs
router.get('/getallusers', authenticateJWT, checkAdmin, getAllUsers);


// Route pour obtenir un token de reset de mot de passe
router.post('/reset-password-token', checkSchema(getResetPasswordTokenValidationSchema), getResetPasswordToken);


// // Route pour reinitialiser le mot de passe
router.post('/reset-password', checkSchema(resetUserPasswordValidationSchema), resetUserPassword);

// // Route pour vérifier l'email d'un utilisateur
// router.post('/verify-email/:token', verifyUserEmail);

// Route pour se connecter avec Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


// Route pour obtenir un utilisateur avec son ID
router.get('/:id', authenticateJWT, getUserById);

//Route pour mettre a jour un utilisateur
router.patch('/:id', authenticateJWT, checkSchema(UpdateUserValidationSchema), checkUsersByIdOrAdmin, updateUser);

// Route pour supprimer un utilisateur
router.delete('/:id', authenticateJWT, checkUsersByIdOrAdmin, deleteUser);

// // Route pour modifier le mot de passe d'un utilisateur
// router.patch('/:id/password', authenticateJWT, checkSchema(updateUserPasswordValidationSchema), checkUsersByIdOrAdmin, updateUserPassword);


// // Route de callback pour Google
router.get('/google/callback', passport.authenticate('google', { session: false, }), GoogleAuth);

// // Route pour se connecter avec Facebook (ajoute la stratégie Facebook de manière similaire à Google)
// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// // Route de callback pour Facebook
// router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
//     const token = jwt.sign({ id: req.user.id }, 'your_jwt_secret'); // Remplace par ta clé secrète
//     res.json({ token });
// });

// // Route protégée
// router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
//     res.json({ message: 'Protected route accessed!', user: req.user });
// });

// Exporte le routeur configuré
export default router;