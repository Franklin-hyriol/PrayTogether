import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import passport from './config/passport';
import connectDB from './config/database';
import cookieParser from "cookie-parser";
import { PORT } from './config/Env';
import http from 'http';  // Importer http pour créer le serveur
import { Server } from 'socket.io';  // Importer socket.io
import prayerRoutes from './routes/prayerRoutes';
// import jwt from 'jsonwebtoken';  // Pour vérifier le token d'accès

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
    origin: 'http://localhost:3000', // URL de ton frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
    credentials: true, // Autoriser l'envoi de cookies
}));

// Utilisation des routes définies dans userRoutes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/prayer', prayerRoutes);

// Créer le serveur HTTP pour utiliser avec socket.io
const server = http.createServer(app);

// Initialiser Socket.io avec le serveur
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Assurer que le frontend peut se connecter
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

// Middleware pour vérifier le token d'accès avant de permettre la connexion
io.use((socket, next) => {
    const token = socket.handshake.headers.authorization?.split(" ")[1];  // Extraire le token depuis l'en-tête Authorization

    console.log(token);

});

// Écoute des connexions WebSocket
io.on("connection", (socket) => {
    console.log("Un utilisateur est connecté : " + socket.id);

    // On peut maintenant accéder à l'utilisateur connecté via socket.user (si besoin)
    // Par exemple, on peut afficher son ID ou son nom d'utilisateur
    // console.log(`Utilisateur connecté : ${socket.user?.id}`);

    // Gestion de la déconnexion
    socket.on("disconnect", () => {
        console.log("Utilisateur déconnecté : " + socket.id);
    });
});

// Démarrer le serveur
server.listen(PORT || 5000, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
