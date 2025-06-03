import mongoose, { CallbackError } from 'mongoose';
import IPrayerRequest from '../interfaces/PrayerRequestInterface';

const prayerRequestSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    isUrgent: { type: Boolean, default: false },
    visibilityUntil: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
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


prayerRequestSchema.pre('deleteMany', { document: false, query: true }, async function (next) {
    try {
        const filter = this.getFilter();
        const prayersToDelete = await mongoose.model('PrayerRequest').find(filter).select('_id').lean();

        const prayerIds = prayersToDelete.map(p => p._id);
        if (prayerIds.length > 0) {
            const PrayerInteraction = mongoose.model('PrayerInteraction');
            await PrayerInteraction.deleteMany({ prayerId: { $in: prayerIds } });
        }
        next();
    } catch (err) {
        next(err as CallbackError);
    }
});

const PrayerRequest = mongoose.model<IPrayerRequest>('PrayerRequest', prayerRequestSchema);
export default PrayerRequest;