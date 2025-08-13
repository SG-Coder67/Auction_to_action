require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('../models/Team'); // Correct path to the model

async function seedTeams() {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB to seed teams...");

    // Drop the old collection to ensure a fresh start
    try {
        await mongoose.connection.db.dropCollection('teamData');
        console.log("🔥 Dropped existing 'teamData' collection.");
    } catch (err) {
        if (err.codeName === 'NamespaceNotFound') {
            console.log(" No existing 'teamData' collection to drop. Starting fresh.");
        } else {
            throw err;
        }
    }

    const teams = [];
    for (let i = 1; i <= 65; i++) {
      // Create predictable credentials like REG001, REG002...
      const credential = `REG${String(i).padStart(3, '0')}`;
      teams.push({
        teamNumber: i,
        teamCredential: credential,
        isActive: false
      });
    }

    // Insert all the new teams into the database
    await Team.insertMany(teams);
    console.log("✅ 65 teams inserted successfully!");

  } catch (err) {
    console.error("❌ Error inserting teams:", err);
  } finally {
    // Always close the connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }
}

seedTeams();

