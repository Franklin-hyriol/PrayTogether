import { Document } from "mongoose";

export default interface IUser extends Document {
    email: string;
    username?: string; // Null si anonyme
    password: string;
    role: string;
    isAnonymous: boolean; // Connexion anonyme ou non
    tempId?: string; // ID temporaire des anonymes (unique mais optionnel)
    provider: string; // "local" ou "google"
    googleId?: string; // ID Google pour les utilisateurs connectés via Google (unique)
    profilePhoto?: string; // URL de la photo de profil pour les utilisateurs connectés via Google
    badges: string[]; // Liste des badges gagnés
    showBadges: string[]; // Liste des badges que l'utilisateur choisit d'afficher sur son profil
    totalPrayersReceived: number; // Nombre total de prières reçues
    totalUpvotesReceived: number; // Nombre total d'upvotes reçus
    totalPrayersMade: number; // Nombre total de prières effectuées
    isBenefactor: boolean; // Indique si l'utilisateur a fait un don
    password_reset_token: string | null; // Token de réinitialisation de mot de passe  
    password_reset_expires: Date | null; // Date d'expiration du token
}
