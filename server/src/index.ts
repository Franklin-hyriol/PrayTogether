import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import http from 'http';
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import rateLimit from "express-rate-limit";

import { initSocket } from './socket';

import userRoutes from './routes/userRoutes';
import prayerRoutes from './routes/prayerRoutes';
import connectDB from './config/database';
import { ensureUploadsFolder } from './utils/ensureUploadsFolder';
import badgeRoutes from './routes/badgeRoutes';
import settingsRoutes from './routes/settingsRoutes';
import { BASE_URL, NEXT_PUBLIC_ENDPOINT_BASE_URL, NODE_ENV } from './config/Env';

const app = express();
if (NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}
const server = http.createServer(app);

// Création du dossier de stockage des images
ensureUploadsFolder();

// Connexion à la base de données
connectDB();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // max 100 requêtes par IP
    message: "Too many requests from this IP, please try again after 15 minutes",
});

// Middlewares
app.disable("x-powered-by"); // évite de révéler que tu utilises Express
app.use(limiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: [NEXT_PUBLIC_ENDPOINT_BASE_URL as string],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
}));


// Dossier de stockage des images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/prayer', prayerRoutes);
app.use('/api/v1/badges', badgeRoutes);
app.use('/api/v1/settings', settingsRoutes);


app.get('/', (_, res) => {
    res.send('Server is running');
});

// Initialiser le WebSocket
initSocket(server);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.info(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
