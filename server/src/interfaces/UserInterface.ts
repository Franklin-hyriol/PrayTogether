import { Document } from "mongoose";

export default interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    role: string;
    provider: string; // "local" ou "google"
    googleId?: string;
    profilePhoto?: string;
    totalPrayersCreated: number;
    totalPrayersReceived: number;
    totalHeartsReceived: number;
    totalPrayersMade: number;
    totalHeartsGiven: number;
    isBenefactor: boolean;
    password_reset_token: string | null;
    password_reset_expires: Date | null;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
}
