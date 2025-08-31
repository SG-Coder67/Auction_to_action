require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction'); // Use CommonJS syntax consistently

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in your .env file.');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seed = async () => {
  await connectDB();

  try {
    // Clear existing transactions
    await Transaction.deleteMany();
    console.log('🔥 Cleared existing transactions.');

    // Note: This script is for clearing transaction data only
    // Use createEventTeams.js to create teams and seedItems.js to create items
    console.log('✅ Transaction seeding completed!');
  } catch (err) {
    console.error('❌ Seeding failed', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
    process.exit(0);
  }
};

seed();
