export interface User {
    _id: string;
    email: string;
    username: string;
    role: string;
    isAnonymous: boolean;
    profilePhoto: string;
    badges: string[];
    showBadges: string[];
    totalPrayersReceived: number;
    totalUpvotesReceived: number;
    totalPrayersMade: number;
    isBenefactor: boolean;
}
