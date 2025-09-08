require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('../models/Team');
const Item = require('../models/Item');

// --- PASTE YOUR DATA HERE ---
const teamsToCreate = [];
for (let i = 1; i <= 65; i++) {
  teamsToCreate.push({
    teamNumber: i,
    teamCredential: `REG${String(i).padStart(3, '0')}`,
    credit: 20000
  });
}
const itemsToCreate = [
    { name: 'BID 1', description: '2x Property, 3x Skilled Labour', type: 'ResourceBundle', basePrice: 5000 },
    // ... (paste all 75 items here) ...
    { name: 'BID 75', description: '3x Property, 4x Skilled Labour, 2x Utilities', type: 'ResourceBundle', basePrice: 6000 }
];


// --- MASTER SEED FUNCTION ---
async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected.');

    console.log('\nClearing old data...');
    await Team.deleteMany({});
    await Item.deleteMany({});
    console.log('🔥 Old data cleared.');

    console.log('\nSeeding new data...');
    await Team.insertMany(teamsToCreate);
    console.log(`🌱 ${teamsToCreate.length} teams seeded.`);
    await Item.insertMany(itemsToCreate);
    console.log(`🌱 ${itemsToCreate.length} items seeded.`);

    console.log('\n✅ Seeding complete!');

  } catch (err) {
    console.error("❌ An error occurred during seeding:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }
}

seedDatabase();