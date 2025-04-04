import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import passport from './config/passport';
import connectDB from './config/database';

const app = express();

// Connexion à la base de données
connectDB();

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Middleware pour configurer Passport
app.use(passport.initialize());

// Configuration CORS pour toutes les requêtes
app.use(cors());

// Utilisation des routes définies dans userRoutes
app.use('/api/v1/users', userRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
