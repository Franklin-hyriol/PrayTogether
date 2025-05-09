import mongoose from 'mongoose';
import IPrayerInteraction from '../interfaces/prayerInteractionInterface';

const prayerInteractionSchema = new mongoose.Schema({
    prayerId: { type: mongoose.Schema.Types.ObjectId, ref: "PrayerRequest", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: ['liked', 'prayed'],
        required: true,
    }
}, { timestamps: true });


const PrayerInteraction = mongoose.model<IPrayerInteraction>('PrayerInteraction', prayerInteractionSchema);
export default PrayerInteraction;