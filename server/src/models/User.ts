import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/UserInterface';

const userSchema = new Schema({
    email: { type: String, unique: true, required: false, sparse: true },
    username: { type: String, required: false }, // Null si anonyme
    password: { type: String, required: false, default: '' },
    role: { type: String, required: true, default: 'user' },
    isAnonymous: { type: Boolean, default: false }, // Connexion anonyme ou non
    tempId: { type: String, unique: true, sparse: true }, // ID temporaire des anonymes
    provider: { type: String, required: true, default: 'local' },
    googleId: { type: String, required: false, unique: true, sparse: true }, // ID Google pour les utilisateurs connectés via Google
    profilePhoto: { type: String, default: '' }, // URL de la photo de profil pour les utilisateurs connectés via Google
    badges: { type: [String], default: [] }, // Liste des badges gagnés
    showBadges: { type: [String], default: [] }, // Liste des badges choisis à afficher par l'utilisateur
    totalPrayersReceived: { type: Number, default: 0 }, // Nombre total de prières reçues
    totalUpvotesReceived: { type: Number, default: 0 }, // Nombre total d'upvotes reçus
    totalPrayersMade: { type: Number, default: 0 }, // Nombre total de prières effectuées
    isBenefactor: { type: Boolean, default: false }, // Indique si l'utilisateur a fait un don
    password_reset_token: { type: String || null, required: false, sparse: true },
    password_reset_expires: { type: Date || null, required: false, sparse: true },
}, { timestamps: true });


userSchema.pre('deleteOne', { document: true }, async function (next) {
    const userId = this._id;
    // await mongoose.model('Post').deleteMany({ userId });
    // await mongoose.model('Comment').deleteMany({ userId }); 
    next();
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
