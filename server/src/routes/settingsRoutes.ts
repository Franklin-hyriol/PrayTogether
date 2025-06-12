import express from 'express';
import authenticateJWT from '../middlewares/authMiddlewares/authenticateJWT';
import { checkSchema } from 'express-validator';
import { getUserSettings, patchUserSettings } from '../controllers/settingsController';
import { updateSettingsValidationSchema } from '../middlewares/Validation/settingsValidation/updateSettingsValidation';

const router = express.Router();

// Récupérer les settings du user connecté
router.get('/', authenticateJWT, getUserSettings);

// Modifier partiellement les settings du user connecté
router.patch('/', authenticateJWT, checkSchema(updateSettingsValidationSchema), patchUserSettings);

export default router;
