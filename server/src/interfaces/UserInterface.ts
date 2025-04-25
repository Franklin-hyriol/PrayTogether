import { Document } from "mongoose";

export default interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    role: string;
    provider: string; // "local" ou "google"
    googleId?: string;
    profilePhoto?: string;
    badges: string[];
    showBadges: string[];
    totalPrayersReceived: number;
    totalHeartsReceived: number; // 💖 Nombre total de "j'aime"
    totalPrayersMade: number;
    isBenefactor: boolean;
    password_reset_token: string | null;
    password_reset_expires: Date | null;
    refreshToken: string | null;
}
