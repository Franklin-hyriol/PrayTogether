interface StrictUser {
    _id: string;
    username: string;
    profilePhoto: string; // Ou string | null si le champ peut être absent
}

export interface IPrayingForYou {
    user: StrictUser;
    createdAt: Date; // Si vous transformez toujours la string en Date
}