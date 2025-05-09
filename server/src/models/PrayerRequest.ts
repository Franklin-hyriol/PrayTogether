import mongoose, { CallbackError } from 'mongoose';
import IPrayerRequest from '../interfaces/PrayerRequestInterface';

const prayerRequestSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    isUrgent: { type: Boolean, default: false },
}, { timestamps: true });

// Supprimer toutes les interactions liées à cette prière
prayerRequestSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const prayerId = this._id;

        const PrayerInteraction = mongoose.model('PrayerInteraction');

        await PrayerInteraction.deleteMany({ prayerId });

        next();
    } catch (err: unknown) {
        next(err as CallbackError);
    }
});

const PrayerRequest = mongoose.model<IPrayerRequest>('PrayerRequest', prayerRequestSchema);
export default PrayerRequest;