export interface Iauthor {
    _id: string;
    username: string;
    profilePhoto: string;
}

export interface IPrayer {
    _id: string;
    authorId: Iauthor;
    text: string;
    isUrgent: boolean;
    createdAt: string;   // ou Date si tu convertis côté client
    updatedAt: string;   // ou Date
    __v: number;
    isPrayed?: boolean;
    isLiked?: boolean;
    likesCount?: number;
    prayersCount?: number;
}


