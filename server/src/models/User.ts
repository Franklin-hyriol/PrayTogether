import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/UserInterface';

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, required: true }, // Obligatoire maintenant
    password: { type: String, required: true, default: '' },
    role: { type: String, required: true, default: 'user' },
    provider: { type: String, required: true, default: 'local' },
    googleId: { type: String, required: false, unique: true, sparse: true },
    profilePhoto: { type: String, default: '' },
    badges: { type: [String], default: [] },
    showBadges: { type: [String], default: [] },
    totalPrayersReceived: { type: Number, default: 0 },
    totalHeartsReceived: { type: Number, default: 0 }, // 💖 Nombre total de "j’aime"
    totalPrayersMade: { type: Number, default: 0 },
    isBenefactor: { type: Boolean, default: false },
    password_reset_token: { type: String, default: null },
    password_reset_expires: { type: Date, default: null },
    refreshToken: { type: String, default: null },
}, { timestamps: true });



userSchema.pre('deleteOne', { document: true }, async function (next) {
    const userId = this._id;
    // await mongoose.model('Post').deleteMany({ userId });
    // await mongoose.model('Comment').deleteMany({ userId }); 
    next();
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
