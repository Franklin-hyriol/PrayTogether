import mongoose, { Schema } from 'mongoose';
import { ISettings } from '../interfaces/SettingsInterface';

const accessibilitySchema = new Schema({
  textSize: { type: String, required: true, default: 'small' },
  highContrast: { type: Boolean, required: true, default: false },
  notificationSound: { type: Boolean, required: true, default: false },
  dyslexicFont: { type: Boolean, required: true, default: false },
}, { _id: false });

const settingsSchema = new Schema<ISettings & { userId: Schema.Types.ObjectId }>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  theme: { type: String, required: true, default: 'light' },
  accessibility: { type: accessibilitySchema, required: true, default: () => ({}) },
  language: { type: String, required: true, default: 'en' },
}, { timestamps: true });

const Settings = mongoose.model<ISettings & { userId: Schema.Types.ObjectId }>('Settings', settingsSchema);
export default Settings;