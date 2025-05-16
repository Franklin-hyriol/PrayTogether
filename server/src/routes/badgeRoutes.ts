import express from 'express';
import authenticateJWT from '../middlewares/authMiddlewares/authenticateJWT';
import checkAdmin from '../middlewares/authorisationMiddleware/checkAdmin';
import { createBadge, deleteBadge, getAllBadges, getBadgeById, updateBadge } from '../controllers/badgeController';
import { checkSchema } from 'express-validator';
import { createBadgeValidationSchema } from '../middlewares/Validation/badgeValidation/createBadgeValidation';


const router = express.Router();

// Créer un badge (admin uniquement)
router.post('/', authenticateJWT, checkAdmin, checkSchema(createBadgeValidationSchema), createBadge);

// Obtenir tous les badges
router.get('/', authenticateJWT, getAllBadges);

// Obtenir un badge par ID
router.get('/:id', authenticateJWT, getBadgeById);

// Mettre à jour un badge (admin uniquement)
router.patch('/:id', authenticateJWT, checkAdmin, updateBadge);

// Supprimer un badge (admin uniquement)
router.delete('/:id', authenticateJWT, checkAdmin, deleteBadge);

export default router;