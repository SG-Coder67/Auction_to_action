require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('../models/Team');
const Item = require('../models/Item');

// --- CORRECTED TEAM DATA STRUCTURE ---
const teamsToCreate = [];
for (let i = 1; i <= 65; i++) {
  teamsToCreate.push({
    teamCode: `T${String(i).padStart(2, '0')}`, // e.g., T01, T02...
    teamName: `Team ${i}`,
    password: `REG${String(i).padStart(3, '0')}`,
    balance: 20000,
    inventory: [] 
  });
}
const itemsToCreate = [
    // Round 1 Bids
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
    
    // Mystery Boxes
    { name: 'Mystery Box 1', description: 'Gain 2x your bid amount', type: 'MysteryBox', basePrice: 3000 },
    { name: 'Mystery Box 2', description: 'Gain 2x your bid amount', type: 'MysteryBox', basePrice: 3000 },
    { name: 'Mystery Box 3', description: 'Gain 1.5x your bid amount', type: 'MysteryBox', basePrice: 3000 },
    { name: 'Mystery Box 4', description: 'Gain 1.5x your bid amount', type: 'MysteryBox', basePrice: 3000 },
    { name: 'Mystery Box 5', description: 'Nothing', type: 'MysteryBox', basePrice: 1000 },
    { name: 'Mystery Box 6', description: 'Nothing', type: 'MysteryBox', basePrice: 1000 },
    { name: 'Mystery Box 7', description: 'Nothing', type: 'MysteryBox', basePrice: 1000 },
    { name: 'Mystery Box 8', description: 'Nothing', type: 'MysteryBox', basePrice: 1000 },
    { name: 'Mystery Box 9', description: 'Nothing', type: 'MysteryBox', basePrice: 1000 },
    { name: 'Mystery Box 10', description: 'Nothing', type: 'MysteryBox', basePrice: 1000 },
    { name: 'Mystery Box 11', description: 'Nothing', type: 'MysteryBox', basePrice: 1000 },
    { name: 'Mystery Box 12', description: 'Nothing', type: 'MysteryBox', basePrice: 1000 },
    { name: 'Mystery Box 13', description: 'Nothing', type: 'MysteryBox', basePrice: 1000 },
    { name: 'Mystery Box 14', description: 'Gain 6 Technology, 2 Utilities', type: 'MysteryBox', basePrice: 5000 },
    { name: 'Mystery Box 15', description: 'Gain 6 Transportation, 2 Office Space', type: 'MysteryBox', basePrice: 5000 },
    { name: 'Mystery Box 16', description: 'Gain 3 Property, 3 Machinery & Tools, 2 Electricity Supply', type: 'MysteryBox', basePrice: 5000 },
    { name: 'Mystery Box 17', description: 'Gain 5 Skilled Labour, 1 Technology, 2 Construction Material', type: 'MysteryBox', basePrice: 5000 },
    { name: 'Mystery Box 18', description: 'Gain 3 Technology, 3 Machinery & Tools, 2 Utilities', type: 'MysteryBox', basePrice: 5000 },
    { name: 'Mystery Box 19', description: 'Gain 6 Utilities, 2 Property', type: 'MysteryBox', basePrice: 5000 },
    { name: 'Mystery Box 20', description: 'Gain 4 Electricity Supply, 3 Technology, 1 Skilled Labour', type: 'MysteryBox', basePrice: 5000 },
    { name: 'Mystery Box 21', description: 'Challenge: Say "Big bids boost booming businesses." 5 times to get 2x bid amount', type: 'MysteryBox', basePrice: 4000 },
    { name: 'Mystery Box 22', description: 'Challenge: Say "Clever creators craft catchy campaigns." 5 times to get 5 Property, 3 Skilled Labour', type: 'MysteryBox', basePrice: 4000 },
    { name: 'Mystery Box 23', description: 'Challenge: Say "Smart startups seek smart supporters." 5 times to get 4 Machinery & Tools, 4 Technology', type: 'MysteryBox', basePrice: 4000 },
    { name: 'Mystery Box 24', description: 'Challenge: Say "Great goals grow grand gains." 5 times to get 1.5x bid amount', type: 'MysteryBox', basePrice: 4000 },
    { name: 'Mystery Box 25', description: 'Challenge: Say "Winning workers work with wise workflows." 5 times to get 5 Electricity Supply, 3 Machinery & Tools', type: 'MysteryBox', basePrice: 4000 },

    // Enterprises
    { name: 'Eco-Furniture Workshop', description: 'Requires: Property (2), Skilled Labour (2), Construction Material (1)', type: 'Enterprise', basePrice: 45000 },
    { name: 'Solar Lighting Solutions Assembly Unit', description: 'Requires: Property (2), Technology (2), Electricity Supply (1), Skilled Labour (1)', type: 'Enterprise', basePrice: 60000 },
    { name: 'Nutrient-Rich Food Products Unit', description: 'Requires: Property (2), Machinery & Tools (2), Utilities (1)', type: 'Enterprise', basePrice: 55000 },
    { name: 'Community Water Purification & Bottling Center', description: 'Requires: Property (2), Machinery & Tools (2), Electricity Supply (1)', type: 'Enterprise', basePrice: 50000 },
    { name: 'Recycled Glass Products Studio', description: 'Requires: Property (2), Construction Material (2), Electricity Supply (1)', type: 'Enterprise', basePrice: 65000 },
    { name: 'Women-Led Stitching & Tailoring Unit', description: 'Requires: Property (2), Skilled Labour (2), Machinery & Tools (1)', type: 'Enterprise', basePrice: 40000 },
    { name: 'Community Bicycle Repair & Rental Hub', description: 'Requires: Property (2), Machinery & Tools (2), Skilled Labour (1)', type: 'Enterprise', basePrice: 45000 },
    { name: 'Rural Handicrafts & Artisan Collective', description: 'Requires: Property (2), Skilled Labour (2), Utilities (1)', type: 'Enterprise', basePrice: 35000 },
    { name: 'Urban Recycling Booth', description: 'Requires: Property (2), Machinery & Tools (1), Skilled Labour (1)', type: 'Enterprise', basePrice: 30000 },
    { name: 'Youth Career Guidance Center', description: 'Requires: Property (2), Office Space (2), Technology (1)', type: 'Enterprise', basePrice: 40000 },
    { name: 'Agro-Tech Support Center', description: 'Requires: Property (2), Technology (2), Utilities (1)', type: 'Enterprise', basePrice: 60000 },
    { name: 'Rainwater Reserve Vault', description: 'Requires: Property (2), Construction Material (2), Utilities (1)', type: 'Enterprise', basePrice: 55000 },
    { name: 'SunSpot Energy Center', description: 'Requires: Property (2), Technology (2), Electricity Supply (1), Skilled Labour (1)', type: 'Enterprise', basePrice: 75000 },
    { name: 'UrbanRoots Garden Center', description: 'Requires: Property (2), Skilled Labour (2), Utilities (1)', type: 'Enterprise', basePrice: 65000 },
    { name: 'WeCare Health Studio', description: 'Requires: Property (2), Office Space (2), Skilled Labour (1)', type: 'Enterprise', basePrice: 50000 },

    // Products
    { name: 'Sustainable Wooden Chairs', description: 'From: Eco-Furniture Workshop. Requires: Construction Material (1), Skilled Labour (1)', type: 'Product', basePrice: 4000 },
    { name: 'Purified Drinking Water Packs', description: 'From: Community Water Purification & Bottling Center. Requires: Machinery & Tools (1), Electricity Supply (1)', type: 'Product', basePrice: 3000 },
    { name: 'Handmade Cloth Bags', description: 'From: Women-Led Stitching & Tailoring Unit. Requires: Machinery & Tools (1), Skilled Labour (1)', type: 'Product', basePrice: 4000 },
    { name: 'Recycled Paper Stationery', description: 'From: Urban Recycling Booth. Requires: Machinery & Tools (1), Skilled Labour (1)', type: 'Product', basePrice: 3500 },
    { name: 'Affordable Seed Kits', description: 'From: Agro-Tech Support Center. Requires: Technology (1), Utilities (1)', type: 'Product', basePrice: 4500 }
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
    console.log(`🌱 ${itemsToCreate.length} total items seeded.`);

    console.log('\n✅ Seeding complete!');

  } catch (err) {
    console.error("❌ An error occurred during seeding:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }
}

seedDatabase();