require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('../models/Team');

async function quickTest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const teamCount = await Team.countDocuments();
    console.log(`Teams in database: ${teamCount}`);

    const firstTeam = await Team.findOne();
    if (firstTeam) {
      console.log('Sample team:', {
        teamNumber: firstTeam.teamNumber,
        budget: firstTeam.budget,
      });
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.connection.close();
  }
}

quickTest();
