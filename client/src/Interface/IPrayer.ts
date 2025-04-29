export interface IPrayer {
    _id: string;
    authorId: {
        _id: string;
        username: string;
        profilePhoto: string;
    };
    text: string;
    isUrgent: boolean;
    likedBy: string[];   // ou ObjectId[] si tu utilises mongoose.Types.ObjectId
    prayedBy: string[];  // idem
    createdAt: string;   // ou Date si tu convertis côté client
    updatedAt: string;   // ou Date
    __v: number;
}
