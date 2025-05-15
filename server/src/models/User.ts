import mongoose, { Schema, CallbackError } from 'mongoose';
import IUser from '../interfaces/UserInterface';

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true, default: '' },
    role: { type: String, required: true, default: 'user' },
    provider: { type: String, required: true, default: 'local' },
    googleId: { type: String, required: false, unique: true, sparse: true },
    profilePhoto: { type: String, default: '' },
    totalPrayersCreated: { type: Number, default: 0 },
    totalPrayersReceived: { type: Number, default: 0 },
    totalHeartsReceived: { type: Number, default: 0 },
    totalPrayersMade: { type: Number, default: 0 },
    totalHeartsGiven: { type: Number, default: 0 },
    isBenefactor: { type: Boolean, default: false },
    password_reset_token: { type: String, default: null },
    password_reset_expires: { type: Date, default: null },
    refreshToken: { type: String, default: null },
}, { timestamps: true });



userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const userId = this._id;

        const PrayerRequest = mongoose.model('PrayerRequest');
        const PrayerInteraction = mongoose.model('PrayerInteraction');

        // Trouver toutes les prières de l'utilisateur
        const userPrayers = await PrayerRequest.find({ authorId: userId }).select('_id');
        const userPrayerIds = userPrayers.map(p => p._id);

        // Supprimer toutes les prières de l'utilisateur
        await PrayerRequest.deleteMany({ authorId: userId });

        // Supprimer toutes les interactions FAITES par l'utilisateur
        await PrayerInteraction.deleteMany({ userId });

        // Supprimer toutes les interactions REÇUES par les prières de l'utilisateur
        if (userPrayerIds.length > 0) {
            await PrayerInteraction.deleteMany({ prayerId: { $in: userPrayerIds } });
        }

        next();
    } catch (err: unknown) {
        next(err as CallbackError);
    }
});



const User = mongoose.model<IUser>('User', userSchema);

export default User;
