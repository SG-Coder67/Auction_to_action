require('dotenv').config({ path: '../.env' }); // Ensures it finds the .env file from the scripts folder
const mongoose = require('mongoose');
const Team = require('../models/Team'); // Correct path to your Team model

async function createTeams() {
  try {
    // 1. Connect to the database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB to create teams...");

    // 2. Clear out any old teams to prevent duplicates
    await Team.deleteMany({});
    console.log("🔥 Cleared all existing teams.");

    // 3. Prepare the list of 65 new teams
    const teamsToCreate = [];
    for (let i = 1; i <= 65; i++) {
      const credential = `REG${String(i).padStart(3, '0')}`; // Creates REG001, REG002...
      teamsToCreate.push({
        teamNumber: i,
        teamCredential: credential,
        budget: 20000, // Set a default budget
        isActive: false
      });
    }

    // 4. Insert all the new teams into the database
    await Team.insertMany(teamsToCreate);
    console.log("✅ 65 teams have been successfully created!");

  } catch (err) {
    console.error("❌ An error occurred:", err);
  } finally {
    // 5. Always close the connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }
}

// Run the function
createTeams();