import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MONGO_URI } from './Env';

dotenv.config();

// Connexion à MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI as string);
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        process.exit(1);
    }
};

export default connectDB;
