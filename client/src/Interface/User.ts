export interface User {
    id: string;
    username: string;
    email: string;
    profilePhoto: string;
    role: string;
    provider: string;
    isBenefactor: boolean;
    totalPrayersReceived: number;
    totalHeartsReceived: number;
    totalPrayersMade: number;
    totalHeartsGiven: number;
    totalPrayersCreated: number;
    createdAt: string;
}