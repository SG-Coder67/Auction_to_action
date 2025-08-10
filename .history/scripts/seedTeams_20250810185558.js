require('dotenv').config({ path: '../.env' }); // Important: specify path to .env
const mongoose = require('mongoose');
const Team = require('../models/Team');

async function seedTeams() {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB to seed teams...");

    // Optional: Delete all existing teams to start fresh
    await Team.deleteMany({});
    console.log("🔥 Cleared existing teams.");

    const teams = [];
    for (let i = 1; i <= 65; i++) {
      // Create a unique, random credential for each team
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      teams.push({
        teamNumber: i,
        teamCredential: `TEAM${i}-${randomCode}`, // Corrected syntax
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
    mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }
}

seedTeams();
