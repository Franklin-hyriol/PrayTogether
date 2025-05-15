import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import http from 'http';


import { initSocket } from './socket';

import userRoutes from './routes/userRoutes';
import prayerRoutes from './routes/prayerRoutes';
import connectDB from './config/database';
import { ensureUploadsFolder } from './utils/ensureUploadsFolder';

const app = express();
const server = http.createServer(app);

// Création du dossier de stockage des images
ensureUploadsFolder();

// Connexion à la base de données
connectDB();

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Dossier de stockage des images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/prayer', prayerRoutes);

// Initialiser le WebSocket
initSocket(server);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
