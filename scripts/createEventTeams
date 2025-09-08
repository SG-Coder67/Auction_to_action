require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('../models/Team');

async function createTeams() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB...");
    await Team.deleteMany({});
    console.log("🔥 Cleared existing teams.");

    const teamsToCreate = [];
    for (let i = 1; i <= 65; i++) {
      teamsToCreate.push({
        teamNumber: i,
        teamCredential: `REG${String(i).padStart(3, '0')}`,
        credit: 20000 // --- FIXED: Use 'credit' not 'budget' ---
      });
    }

    await Team.insertMany(teamsToCreate);
    console.log(`✅ ${teamsToCreate.length} teams have been created!`);
  } catch (err) {
    console.error("❌ An error occurred:", err);
  } finally {
    await mongoose.connection.close();
  }
}
createTeams();