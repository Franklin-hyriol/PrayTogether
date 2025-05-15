import express from 'express';
import authenticateJWT from '../middlewares/authMiddlewares/authenticateJWT';
import checkAdmin from '../middlewares/authorisationMiddleware/checkAdmin';
import { checkSchema } from 'express-validator';
import { createPrayerValidationSchema } from '../middlewares/Validation/prayerRequest/createPrayerValidation';
import { createPrayer, deletePrayer, getAllPrayers, getMyPrayers, getPeopleWhoPrayed, getPrayerById, likeThisPrayer, prayForPrayer, updatePrayer } from '../controllers/prayerController';
import checkOwnerOrAdmin from '../middlewares/authorisationMiddleware/checkOwnerOrAdmin';

const router = express.Router();

// 🛐 Création d'une prière
router.post('/', authenticateJWT, checkSchema(createPrayerValidationSchema), createPrayer);

// 📖 Récupérer toutes les prières (public ou limité selon ton besoin)
router.get('/', authenticateJWT, getAllPrayers);

// 📖 Récupérer les prières de l'utilisateur connecté
router.get('/my', authenticateJWT, getMyPrayers);

// 🙋‍♂️ Récupérer les personnes qui ont prié pour une prière
router.get('/:id/prayed-by', authenticateJWT, checkOwnerOrAdmin, getPeopleWhoPrayed);

// 📖 Récupérer une prière spécifique par ID
router.get('/:id', authenticateJWT, getPrayerById);

// 📝 Modifier une prière (seulement par son auteur ou admin)
router.patch('/:id', authenticateJWT, checkOwnerOrAdmin, checkSchema(createPrayerValidationSchema), updatePrayer);

// 🗑️ Supprimer une prière (seulement par son auteur ou admin)
router.delete('/:id', authenticateJWT, checkOwnerOrAdmin, deletePrayer);

// 🙏 Ajouter une réaction "Je prie pour toi" à une prière
router.post('/:id/pray', authenticateJWT, prayForPrayer);

//Ajouter une reaction like a une prière
router.post('/:id/like', authenticateJWT, likeThisPrayer);

// 🚫 (Optionnel) Admin : modérer/supprimer une prière problématique
router.delete('/admin/:id', authenticateJWT, checkAdmin, /* adminDeletePrayer */);

export default router;
