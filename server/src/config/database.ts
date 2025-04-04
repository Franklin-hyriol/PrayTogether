import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connexion à MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        process.exit(1);
    }
};

export default connectDB;
