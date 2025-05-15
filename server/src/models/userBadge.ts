import mongoose, { Schema } from 'mongoose';
import { IUserBadge } from '../interfaces/UserBadgeInterface';

const userBadgeSchema = new Schema<IUserBadge>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    badgeId: { type: Schema.Types.ObjectId, ref: 'Badge', required: true },
}, { timestamps: true });

const UserBadge = mongoose.model<IUserBadge>('UserBadge', userBadgeSchema);
export default UserBadge;