import IUser from "../interfaces/UserInterface";

export function serializeUser(user: IUser) {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role,
        provider: user.provider,
        isBenefactor: user.isBenefactor,
        totalPrayersReceived: user.totalPrayersReceived,
        totalHeartsReceived: user.totalHeartsReceived,
        totalPrayersMade: user.totalPrayersMade,
        totalHeartsGiven: user.totalHeartsGiven,
        totalPrayersCreated: user.totalPrayersCreated,
        createdAt: user.createdAt,
    };
}