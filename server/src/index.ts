import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import passport from './config/passport';
import connectDB from './config/database';
import cookieParser from "cookie-parser";
import { PORT } from './config/Env';

const app = express();

// Connexion à la base de données
connectDB();

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());
app.use(cookieParser());

// Middleware pour configurer Passport
app.use(passport.initialize());

// Configuration CORS pour toutes les requêtes
app.use(cors({
    origin: '*',
    credentials: true
}));

// Utilisation des routes définies dans userRoutes
app.use('/api/v1/users', userRoutes);

// Démarrer le serveur
app.listen(PORT || 5000, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
