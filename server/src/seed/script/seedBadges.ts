import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import connectDB from '../../config/database';
import Badge from '../../models/Badge';

// Charge les données des badges depuis le fichier JSON
const loadBadgesData = (filePathProps: string): any[] => {
  const filePath = path.join(__dirname, filePathProps);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

async function seedBadges() {
  try {
    await connectDB();

    const totalPrayersCreated = loadBadgesData("../data/badge/totalPrayersCreated.json");
    const totalHeartsGiven = loadBadgesData("../data/badge/totalHeartsGiven.json");
    const totalHeartsReceived = loadBadgesData("../data/badge/totalHeartsReceived.json");
    const totalPrayersMade = loadBadgesData("../data/badge/totalPrayersMade.json");
    const totalPrayersReceived = loadBadgesData("../data/badge/totalPrayersReceived.json");

    const badges = [...totalPrayersCreated, ...totalHeartsGiven, ...totalHeartsReceived, ...totalPrayersMade, ...totalPrayersReceived];

    await Badge.deleteMany({});

    await Badge.insertMany(badges);

    console.log('Badges seeded successfully!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding badges:', error);
    mongoose.disconnect();
  }
}

seedBadges();