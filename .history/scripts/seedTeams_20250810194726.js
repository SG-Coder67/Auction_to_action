require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('../models/Team');

async function seedTeams() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB to seed teams...");

    await Team.deleteMany({});
    console.log("🔥 Cleared existing teams.");

    const teams = [];
    for (let i = 1; i <= 65; i++) {
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      teams.push({
        teamName: `Team ${i}`, // Added a unique name for each team
        teamNumber: i,
        teamCredential: `TEAM${i}-${randomCode}`,
        isActive: false
      });
    }

    await Team.insertMany(teams);
    console.log("✅ 65 teams inserted successfully!");

  } catch (err) {
    console.error("❌ Error inserting teams:", err);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }
}

seedTeams();