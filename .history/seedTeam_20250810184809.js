require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('./team.model');

async function seedTeams() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const teams = [];
    for (let i = 1; i <= 65; i++) {
      teams.push({
        teamNumber: i,
        teamCredential:TEAM${i}-${Math.random().toString(36).substring(2, 8), // random unique code
        isActive: false
      });
    }

    await Team.insertMany(teams);
    console.log("✅ 65 teams inserted successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error inserting teams:", err);
  }
}

seedTeams();