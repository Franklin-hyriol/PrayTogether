
import mongoose, { Schema } from 'mongoose';
import IPrayerRequest from '../interfaces/PrayerRequestInterface';

const prayerRequestSchema = new Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    isUrgent: { type: Boolean, default: false },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    prayedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });


const PrayerRequest = mongoose.model<IPrayerRequest>('PrayerRequest', prayerRequestSchema);
export default PrayerRequest;
