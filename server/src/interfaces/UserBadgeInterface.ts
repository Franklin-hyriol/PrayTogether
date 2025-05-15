import mongoose, { Document } from 'mongoose';

export interface IUserBadge extends Document {
    userId: mongoose.Types.ObjectId;
    badgeId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}