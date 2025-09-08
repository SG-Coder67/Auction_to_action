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
    { name: 'BID 1', description: '6 Technology, 5 Property', type: 'ResourceBundle', basePrice: 9500 },
    { name: 'BID 2', description: '7 Technology', type: 'ResourceBundle', basePrice: 9000 },
    { name: 'BID 3', description: '3 Property, 6 Technology', type: 'ResourceBundle', basePrice: 8000 },
    { name: 'BID 4', description: '5 Property, 4 Technology', type: 'ResourceBundle', basePrice: 8000 },
    { name: 'BID 5', description: '5 Property, 5 Technology', type: 'ResourceBundle', basePrice: 8000 },
    { name: 'BID 6', description: '5 Property, 4 Technology, 4 Electricity Supply', type: 'ResourceBundle', basePrice: 8000 },
    { name: 'BID 7', description: '4 Technology, 5 Property', type: 'ResourceBundle', basePrice: 7500 },
    { name: 'BID 8', description: '6 Technology, 3 Skilled Labour', type: 'ResourceBundle', basePrice: 7500 },
    { name: 'BID 9', description: '5 Property, 6 Machinery & Tools', type: 'ResourceBundle', basePrice: 7500 },
    { name: 'BID 10', description: '5 Property, 5 Machinery & Tools, 4 Electricity Supply', type: 'ResourceBundle', basePrice: 7500 },
    { name: 'BID 11', description: '4 Property, 4 Technology, 4 Machinery & Tools', type: 'ResourceBundle', basePrice: 7500 },
    { name: 'BID 12', description: '4 Property, 4 Technology', type: 'ResourceBundle', basePrice: 7000 },
    { name: 'BID 13', description: '4 Property, 4 Office Space, 4 Technology', type: 'ResourceBundle', basePrice: 7000 },
    { name: 'BID 14', description: '5 Property, 4 Construction Material, 3 Technology', type: 'ResourceBundle', basePrice: 7000 },
    { name: 'BID 15', description: '4 Office Space, 6 Technology', type: 'ResourceBundle', basePrice: 7000 },
    { name: 'BID 16', description: '5 Property, 4 Office Space, 3 Technology', type: 'ResourceBundle', basePrice: 7000 },
    { name: 'BID 17', description: '5 Property, 4 Transportation, 3 Technology', type: 'ResourceBundle', basePrice: 7000 },
    { name: 'BID 18', description: '3 Property, 5 Technology, 4 Utilities', type: 'ResourceBundle', basePrice: 7000 },
    { name: 'BID 19', description: '6 Electricity Supply, 4 Technology', type: 'ResourceBundle', basePrice: 7000 },
    { name: 'BID 20', description: '4 Machinery & Tools, 5 Technology, 3 Skilled Labour', type: 'ResourceBundle', basePrice: 7000 },
    { name: 'BID 21', description: '6 Technology', type: 'ResourceBundle', basePrice: 7000 },
    { name: 'BID 22', description: '5 Property, 4 Skilled Labour, 4 Technology', type: 'ResourceBundle', basePrice: 7500 },
    { name: 'BID 23', description: '3 Technology, 5 Property', type: 'ResourceBundle', basePrice: 6500 },
    { name: 'BID 24', description: '5 Property, 4 Office Space', type: 'ResourceBundle', basePrice: 6500 },
    { name: 'BID 25', description: '3 Property, 4 Office Space, 4 Technology', type: 'ResourceBundle', basePrice: 6500 },
    { name: 'BID 26', description: '4 Technology, 4 Office Space', type: 'ResourceBundle', basePrice: 6500 },
    { name: 'BID 27', description: '5 Property, 3 Technology, 4 Utilities', type: 'ResourceBundle', basePrice: 6500 },
    { name: 'BID 28', description: '6 Electricity Supply, 3 Technology', type: 'ResourceBundle', basePrice: 6500 },
    { name: 'BID 29', description: '4 Office Space, 6 Machinery & Tools', type: 'ResourceBundle', basePrice: 6500 },
    { name: 'BID 30', description: '3 Property, 4 Technology, 5 Electricity Supply', type: 'ResourceBundle', basePrice: 6500 },
    { name: 'BID 31', description: '5 Property, 4 Office Space, 4 Electricity Supply', type: 'ResourceBundle', basePrice: 6500 },
    { name: 'BID 32', description: '6 Property, 5 Skilled Labour', type: 'ResourceBundle', basePrice: 6500 },
    { name: 'BID 33', description: '4 Property, 4 Technology', type: 'ResourceBundle', basePrice: 6000 },
    { name: 'BID 34', description: '4 Property, 5 Office Space', type: 'ResourceBundle', basePrice: 6000 },
    { name: 'BID 35', description: '5 Property, 4 Electricity Supply', type: 'ResourceBundle', basePrice: 6000 },
    { name: 'BID 36', description: '4 Machinery & Tools, 4 Technology', type: 'ResourceBundle', basePrice: 6000 },
    { name: 'BID 37', description: '6 Machinery & Tools, 3 Technology', type: 'ResourceBundle', basePrice: 6000 },
    { name: 'BID 38', description: '5 Property, 6 Skilled Labour', type: 'ResourceBundle', basePrice: 6000 },
    { name: 'BID 39', description: '4 Technology, 4 Machinery & Tools, 3 Electricity Supply', type: 'ResourceBundle', basePrice: 6000 },
    { name: 'BID 40', description: '5 Property, 5 Construction Material, 3 Skilled Labour', type: 'ResourceBundle', basePrice: 6000 },
    { name: 'BID 41', description: '6 Property', type: 'ResourceBundle', basePrice: 6000 },
    { name: 'BID 42', description: '5 Property, 6 Skilled Labour, 4 Utilities', type: 'ResourceBundle', basePrice: 6000 },
    { name: 'BID 43', description: '4 Property, 5 Construction Material, 4 Machinery & Tools', type: 'ResourceBundle', basePrice: 6000 },
    { name: 'BID 44', description: '4 Technology, 5 Transportation', type: 'ResourceBundle', basePrice: 6000 },
    { name: 'BID 45', description: '5 Technology', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 46', description: '5 Machinery & Tools, 4 Skilled Labour', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 47', description: '4 Technology, 5 Skilled Labour', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 48', description: '5 Property, 3 Transportation', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 49', description: '5 Property, 4 Construction Material', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 50', description: '4 Property, 6 Skilled Labour, 4 Utilities', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 51', description: '4 Property, 4 Machinery & Tools, 4 Electricity Supply', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 52', description: '5 Property, 5 Utilities', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 53', description: '6 Machinery & Tools, 4 Skilled Labour', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 54', description: '4 Property, 6 Electricity Supply', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 55', description: '5 Property, 4 Transportation', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 56', description: '4 Property, 4 Skilled Labour, 4 Machinery & Tools', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 57', description: '4 Property, 4 Transportation, 4 Machinery & Tools', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 58', description: '4 Property, 5 Electricity Supply, 4 Skilled Labour', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 59', description: '4 Property, 4 Office Space, 5 Skilled Labour', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 60', description: '4 Property, 4 Electricity Supply, 4 Machinery & Tools', type: 'ResourceBundle', basePrice: 5500 },
    { name: 'BID 61', description: '4 Property, 5 Skilled Labour', type: 'ResourceBundle', basePrice: 5000 },
    { name: 'BID 62', description: '4 Property, 4 Construction Material, 3 Skilled Labour', type: 'ResourceBundle', basePrice: 5000 },
    { name: 'BID 63', description: '3 Property, 5 Machinery & Tools, 4 Utilities', type: 'ResourceBundle', basePrice: 5000 },
    { name: 'BID 64', description: '5 Machinery & Tools, 5 Construction Material', type: 'ResourceBundle', basePrice: 5000 },
    { name: 'BID 65', description: '4 Property, 5 Transportation', type: 'ResourceBundle', basePrice: 5000 },
    { name: 'BID 66', description: '6 Electricity Supply, 4 Skilled Labour', type: 'ResourceBundle', basePrice: 5000 },
    { name: 'BID 67', description: '7 Skilled Labour, 4 Office Space', type: 'ResourceBundle', basePrice: 5000 },
    { name: 'BID 68', description: '6 Office Space, 4 Skilled Labour', type: 'ResourceBundle', basePrice: 5000 },
    { name: 'BID 69', description: '6 Machinery & Tools, 4 Utilities', type: 'ResourceBundle', basePrice: 5000 },
    { name: 'BID 70', description: '3 Property, 4 Skilled Labour, 5 Machinery & Tools', type: 'ResourceBundle', basePrice: 5000 },
    { name: 'BID 71', description: '4 Property, 5 Utilities, 4 Skilled Labour', type: 'ResourceBundle', basePrice: 5000 },
    { name: 'BID 72', description: '3 Property, 7 Skilled Labour, 5 Utilities', type: 'ResourceBundle', basePrice: 5000 },
    { name: 'BID 73', description: '4 Property, 5 Skilled Labour, 5 Utilities', type: 'ResourceBundle', basePrice: 5000 },
    { name: 'BID 74', description: '5 Property, 4 Skilled Labour, 4 Technology', type: 'ResourceBundle', basePrice: 7500 },
    { name: 'BID 75', description: '4 Technology, 4 Machinery & Tools, 3 Electricity Supply', type: 'ResourceBundle', basePrice: 6000 },
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