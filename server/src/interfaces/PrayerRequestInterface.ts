import { Types } from "mongoose";

export default interface IPrayerRequest {
    authorId: Types.ObjectId;
    text: string;
    isUrgent: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface EnrichedPrayer extends Omit<IPrayerRequest, 'authorId'> {
    _id: Types.ObjectId;
    authorId: {
        username: string;
        profilePhoto?: string;
    };
    isPrayed: boolean;
    isLiked: boolean;
    normalizedText?: string;
    normalizedAuthor?: string;
}