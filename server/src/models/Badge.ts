import mongoose, { Schema } from 'mongoose';
import { IBadge } from '../interfaces/BadgeInterface';

const badgeSchema = new Schema<IBadge>({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    isSecret: { type: Boolean, default: false },
    condition: {
        type: {
            type: String,
            enum: ['totalPrayersCreated', 'totalPrayersMade', 'totalPrayersReceived', 'totalHeartsGiven', 'totalHeartsReceived', 'isBenefactor'],
            required: true
        },
        value: { type: Schema.Types.Mixed, required: true }
    }
}, { timestamps: true });



const Badge = mongoose.model<IBadge>('Badge', badgeSchema);
export default Badge;