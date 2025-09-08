require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('../models/Team');
const Item = require('../models/Item');

// --- TEAM DATA ---
const teamsToCreate = [];
for (let i = 1; i <= 65; i++) {
  teamsToCreate.push({
    teamCode: `T${String(i).padStart(2, '0')}`,
    teamName: `Team ${i}`,
    password: `REG${String(i).padStart(3, '0')}`,
    balance: 20000,
    inventory: [] 
  });
}

// --- COMPLETE ITEM DATA ---
// This is the line that was likely missing from your file
const itemsToCreate = [
    // Round 1 Bids
    { itemCode: 'R1-BID-01', name: 'BID 1', description: '6 Technology, 5 Property', itemType: 'BID', round: 1, basePrice: 9500 },
    { itemCode: 'R1-BID-02', name: 'BID 2', description: '7 Technology', itemType: 'BID', round: 1, basePrice: 9000 },
    { itemCode: 'R1-BID-03', name: 'BID 3', description: '3 Property, 6 Technology', itemType: 'BID', round: 1, basePrice: 8000 },
    { itemCode: 'R1-BID-04', name: 'BID 4', description: '5 Property, 4 Technology', itemType: 'BID', round: 1, basePrice: 8000 },
    { itemCode: 'R1-BID-05', name: 'BID 5', description: '5 Property, 5 Technology', itemType: 'BID', round: 1, basePrice: 8000 },
    { itemCode: 'R1-BID-06', name: 'BID 6', description: '5 Property, 4 Technology, 4 Electricity Supply', itemType: 'BID', round: 1, basePrice: 8000 },
    { itemCode: 'R1-BID-07', name: 'BID 7', description: '4 Technology, 5 Property', itemType: 'BID', round: 1, basePrice: 7500 },
    { itemCode: 'R1-BID-08', name: 'BID 8', description: '6 Technology, 3 Skilled Labour', itemType: 'BID', round: 1, basePrice: 7500 },
    { itemCode: 'R1-BID-09', name: 'BID 9', description: '5 Property, 6 Machinery & Tools', itemType: 'BID', round: 1, basePrice: 7500 },
    { itemCode: 'R1-BID-10', name: 'BID 10', description: '5 Property, 5 Machinery & Tools, 4 Electricity Supply', itemType: 'BID', round: 1, basePrice: 7500 },
    { itemCode: 'R1-BID-11', name: 'BID 11', description: '4 Property, 4 Technology, 4 Machinery & Tools', itemType: 'BID', round: 1, basePrice: 7500 },
    { itemCode: 'R1-BID-12', name: 'BID 12', description: '4 Property, 4 Technology', itemType: 'BID', round: 1, basePrice: 7000 },
    { itemCode: 'R1-BID-13', name: 'BID 13', description: '4 Property, 4 Office Space, 4 Technology', itemType: 'BID', round: 1, basePrice: 7000 },
    { itemCode: 'R1-BID-14', name: 'BID 14', description: '5 Property, 4 Construction Material, 3 Technology', itemType: 'BID', round: 1, basePrice: 7000 },
    { itemCode: 'R1-BID-15', name: 'BID 15', description: '4 Office Space, 6 Technology', itemType: 'BID', round: 1, basePrice: 7000 },
    { itemCode: 'R1-BID-16', name: 'BID 16', description: '5 Property, 4 Office Space, 3 Technology', itemType: 'BID', round: 1, basePrice: 7000 },
    { itemCode: 'R1-BID-17', name: 'BID 17', description: '5 Property, 4 Transportation, 3 Technology', itemType: 'BID', round: 1, basePrice: 7000 },
    { itemCode: 'R1-BID-18', name: 'BID 18', description: '3 Property, 5 Technology, 4 Utilities', itemType: 'BID', round: 1, basePrice: 7000 },
    { itemCode: 'R1-BID-19', name: 'BID 19', description: '6 Electricity Supply, 4 Technology', itemType: 'BID', round: 1, basePrice: 7000 },
    { itemCode: 'R1-BID-20', name: 'BID 20', description: '4 Machinery & Tools, 5 Technology, 3 Skilled Labour', itemType: 'BID', round: 1, basePrice: 7000 },
    { itemCode: 'R1-BID-21', name: 'BID 21', description: '6 Technology', itemType: 'BID', round: 1, basePrice: 7000 },
    { itemCode: 'R1-BID-22', name: 'BID 22', description: '5 Property, 4 Skilled Labour, 4 Technology', itemType: 'BID', round: 1, basePrice: 7500 },
    { itemCode: 'R1-BID-23', name: 'BID 23', description: '3 Technology, 5 Property', itemType: 'BID', round: 1, basePrice: 6500 },
    { itemCode: 'R1-BID-24', name: 'BID 24', description: '5 Property, 4 Office Space', itemType: 'BID', round: 1, basePrice: 6500 },
    { itemCode: 'R1-BID-25', name: 'BID 25', description: '3 Property, 4 Office Space, 4 Technology', itemType: 'BID', round: 1, basePrice: 6500 },
    { itemCode: 'R1-BID-26', name: 'BID 26', description: '4 Technology, 4 Office Space', itemType: 'BID', round: 1, basePrice: 6500 },
    { itemCode: 'R1-BID-27', name: 'BID 27', description: '5 Property, 3 Technology, 4 Utilities', itemType: 'BID', round: 1, basePrice: 6500 },
    { itemCode: 'R1-BID-28', name: 'BID 28', description: '6 Electricity Supply, 3 Technology', itemType: 'BID', round: 1, basePrice: 6500 },
    { itemCode: 'R1-BID-29', name: 'BID 29', description: '4 Office Space, 6 Machinery & Tools', itemType: 'BID', round: 1, basePrice: 6500 },
    { itemCode: 'R1-BID-30', name: 'BID 30', description: '3 Property, 4 Technology, 5 Electricity Supply', itemType: 'BID', round: 1, basePrice: 6500 },
    { itemCode: 'R1-BID-31', name: 'BID 31', description: '5 Property, 4 Office Space, 4 Electricity Supply', itemType: 'BID', round: 1, basePrice: 6500 },
    { itemCode: 'R1-BID-32', name: 'BID 32', description: '6 Property, 5 Skilled Labour', itemType: 'BID', round: 1, basePrice: 6500 },
    { itemCode: 'R1-BID-33', name: 'BID 33', description: '4 Property, 4 Technology', itemType: 'BID', round: 1, basePrice: 6000 },
    { itemCode: 'R1-BID-34', name: 'BID 34', description: '4 Property, 5 Office Space', itemType: 'BID', round: 1, basePrice: 6000 },
    { itemCode: 'R1-BID-35', name: 'BID 35', description: '5 Property, 4 Electricity Supply', itemType: 'BID', round: 1, basePrice: 6000 },
    { itemCode: 'R1-BID-36', name: 'BID 36', description: '4 Machinery & Tools, 4 Technology', itemType: 'BID', round: 1, basePrice: 6000 },
    { itemCode: 'R1-BID-37', name: 'BID 37', description: '6 Machinery & Tools, 3 Technology', itemType: 'BID', round: 1, basePrice: 6000 },
    { itemCode: 'R1-BID-38', name: 'BID 38', description: '5 Property, 6 Skilled Labour', itemType: 'BID', round: 1, basePrice: 6000 },
    { itemCode: 'R1-BID-39', name: 'BID 39', description: '4 Technology, 4 Machinery & Tools, 3 Electricity Supply', itemType: 'BID', round: 1, basePrice: 6000 },
    { itemCode: 'R1-BID-40', name: 'BID 40', description: '5 Property, 5 Construction Material, 3 Skilled Labour', itemType: 'BID', round: 1, basePrice: 6000 },
    { itemCode: 'R1-BID-41', name: 'BID 41', description: '6 Property', itemType: 'BID', round: 1, basePrice: 6000 },
    { itemCode: 'R1-BID-42', name: 'BID 42', description: '5 Property, 6 Skilled Labour, 4 Utilities', itemType: 'BID', round: 1, basePrice: 6000 },
    { itemCode: 'R1-BID-43', name: 'BID 43', description: '4 Property, 5 Construction Material, 4 Machinery & Tools', itemType: 'BID', round: 1, basePrice: 6000 },
    { itemCode: 'R1-BID-44', name: 'BID 44', description: '4 Technology, 5 Transportation', itemType: 'BID', round: 1, basePrice: 6000 },
    { itemCode: 'R1-BID-45', name: 'BID 45', description: '5 Technology', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-46', name: 'BID 46', description: '5 Machinery & Tools, 4 Skilled Labour', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-47', name: 'BID 47', description: '4 Technology, 5 Skilled Labour', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-48', name: 'BID 48', description: '5 Property, 3 Transportation', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-49', name: 'BID 49', description: '5 Property, 4 Construction Material', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-50', name: 'BID 50', description: '4 Property, 6 Skilled Labour, 4 Utilities', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-51', name: 'BID 51', description: '4 Property, 4 Machinery & Tools, 4 Electricity Supply', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-52', name: 'BID 52', description: '5 Property, 5 Utilities', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-53', name: 'BID 53', description: '6 Machinery & Tools, 4 Skilled Labour', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-54', name: 'BID 54', description: '4 Property, 6 Electricity Supply', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-55', name: 'BID 55', description: '5 Property, 4 Transportation', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-56', name: 'BID 56', description: '4 Property, 4 Skilled Labour, 4 Machinery & Tools', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-57', name: 'BID 57', description: '4 Property, 4 Transportation, 4 Machinery & Tools', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-58', name: 'BID 58', description: '4 Property, 5 Electricity Supply, 4 Skilled Labour', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-59', name: 'BID 59', description: '4 Property, 4 Office Space, 5 Skilled Labour', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-60', name: 'BID 60', description: '4 Property, 4 Electricity Supply, 4 Machinery & Tools', itemType: 'BID', round: 1, basePrice: 5500 },
    { itemCode: 'R1-BID-61', name: 'BID 61', description: '4 Property, 5 Skilled Labour', itemType: 'BID', round: 1, basePrice: 5000 },
    { itemCode: 'R1-BID-62', name: 'BID 62', description: '4 Property, 4 Construction Material, 3 Skilled Labour', itemType: 'BID', round: 1, basePrice: 5000 },
    { itemCode: 'R1-BID-63', name: 'BID 63', description: '3 Property, 5 Machinery & Tools, 4 Utilities', itemType: 'BID', round: 1, basePrice: 5000 },
    { itemCode: 'R1-BID-64', name: 'BID 64', description: '5 Machinery & Tools, 5 Construction Material', itemType: 'BID', round: 1, basePrice: 5000 },
    { itemCode: 'R1-BID-65', name: 'BID 65', description: '4 Property, 5 Transportation', itemType: 'BID', round: 1, basePrice: 5000 },
    { itemCode: 'R1-BID-66', name: 'BID 66', description: '6 Electricity Supply, 4 Skilled Labour', itemType: 'BID', round: 1, basePrice: 5000 },
    { itemCode: 'R1-BID-67', name: 'BID 67', description: '7 Skilled Labour, 4 Office Space', itemType: 'BID', round: 1, basePrice: 5000 },
    { itemCode: 'R1-BID-68', name: 'BID 68', description: '6 Office Space, 4 Skilled Labour', itemType: 'BID', round: 1, basePrice: 5000 },
    { itemCode: 'R1-BID-69', name: 'BID 69', description: '6 Machinery & Tools, 4 Utilities', itemType: 'BID', round: 1, basePrice: 5000 },
    { itemCode: 'R1-BID-70', name: 'BID 70', description: '3 Property, 4 Skilled Labour, 5 Machinery & Tools', itemType: 'BID', round: 1, basePrice: 5000 },
    { itemCode: 'R1-BID-71', name: 'BID 71', description: '4 Property, 5 Utilities, 4 Skilled Labour', itemType: 'BID', round: 1, basePrice: 5000 },
    { itemCode: 'R1-BID-72', name: 'BID 72', description: '3 Property, 7 Skilled Labour, 5 Utilities', itemType: 'BID', round: 1, basePrice: 5000 },
    { itemCode: 'R1-BID-73', name: 'BID 73', description: '4 Property, 5 Skilled Labour, 5 Utilities', itemType: 'BID', round: 1, basePrice: 5000 },
    { itemCode: 'R1-BID-74', name: 'BID 74', description: '5 Property, 4 Skilled Labour, 4 Technology', itemType: 'BID', round: 1, basePrice: 7500 },
    { itemCode: 'R1-BID-75', name: 'BID 75', description: '4 Technology, 4 Machinery & Tools, 3 Electricity Supply', itemType: 'BID', round: 1, basePrice: 6000 },
    
    // Mystery Boxes
    { itemCode: 'R2-MB-01', name: 'Mystery Box 1', description: 'Gain 2x your bid amount', itemType: 'MYSTERY_BOX', round: 2, basePrice: 3000 },
    { itemCode: 'R2-MB-02', name: 'Mystery Box 2', description: 'Gain 2x your bid amount', itemType: 'MYSTERY_BOX', round: 2, basePrice: 3000 },
    { itemCode: 'R2-MB-03', name: 'Mystery Box 3', description: 'Gain 1.5x your bid amount', itemType: 'MYSTERY_BOX', round: 2, basePrice: 3000 },
    { itemCode: 'R2-MB-04', name: 'Mystery Box 4', description: 'Gain 1.5x your bid amount', itemType: 'MYSTERY_BOX', round: 2, basePrice: 3000 },
    { itemCode: 'R2-MB-05', name: 'Mystery Box 5', description: 'Nothing', itemType: 'MYSTERY_BOX', round: 2, basePrice: 1000 },
    { itemCode: 'R2-MB-06', name: 'Mystery Box 6', description: 'Nothing', itemType: 'MYSTERY_BOX', round: 2, basePrice: 1000 },
    { itemCode: 'R2-MB-07', name: 'Mystery Box 7', description: 'Nothing', itemType: 'MYSTERY_BOX', round: 2, basePrice: 1000 },
    { itemCode: 'R2-MB-08', name: 'Mystery Box 8', description: 'Nothing', itemType: 'MYSTERY_BOX', round: 2, basePrice: 1000 },
    { itemCode: 'R2-MB-09', name: 'Mystery Box 9', description: 'Nothing', itemType: 'MYSTERY_BOX', round: 2, basePrice: 1000 },
    { itemCode: 'R2-MB-10', name: 'Mystery Box 10', description: 'Nothing', itemType: 'MYSTERY_BOX', round: 2, basePrice: 1000 },
    { itemCode: 'R2-MB-11', name: 'Mystery Box 11', description: 'Nothing', itemType: 'MYSTERY_BOX', round: 2, basePrice: 1000 },
    { itemCode: 'R2-MB-12', name: 'Mystery Box 12', description: 'Nothing', itemType: 'MYSTERY_BOX', round: 2, basePrice: 1000 },
    { itemCode: 'R2-MB-13', name: 'Mystery Box 13', description: 'Nothing', itemType: 'MYSTERY_BOX', round: 2, basePrice: 1000 },
    { itemCode: 'R2-MB-14', name: 'Mystery Box 14', description: 'Gain 6 Technology, 2 Utilities', itemType: 'MYSTERY_BOX', round: 2, basePrice: 5000 },
    { itemCode: 'R2-MB-15', name: 'Mystery Box 15', description: 'Gain 6 Transportation, 2 Office Space', itemType: 'MYSTERY_BOX', round: 2, basePrice: 5000 },
    { itemCode: 'R2-MB-16', name: 'Mystery Box 16', description: 'Gain 3 Property, 3 Machinery & Tools, 2 Electricity Supply', itemType: 'MYSTERY_BOX', round: 2, basePrice: 5000 },
    { itemCode: 'R2-MB-17', name: 'Mystery Box 17', description: 'Gain 5 Skilled Labour, 1 Technology, 2 Construction Material', itemType: 'MYSTERY_BOX', round: 2, basePrice: 5000 },
    { itemCode: 'R2-MB-18', name: 'Mystery Box 18', description: 'Gain 3 Technology, 3 Machinery & Tools, 2 Utilities', itemType: 'MYSTERY_BOX', round: 2, basePrice: 5000 },
    { itemCode: 'R2-MB-19', name: 'Mystery Box 19', description: 'Gain 6 Utilities, 2 Property', itemType: 'MYSTERY_BOX', round: 2, basePrice: 5000 },
    { itemCode: 'R2-MB-20', name: 'Mystery Box 20', description: 'Gain 4 Electricity Supply, 3 Technology, 1 Skilled Labour', itemType: 'MYSTERY_BOX', round: 2, basePrice: 5000 },
    { itemCode: 'R2-MB-21', name: 'Mystery Box 21', description: 'Challenge: Say "Big bids boost booming businesses." 5 times to get 2x bid amount', itemType: 'MYSTERY_BOX', round: 2, basePrice: 4000 },
    { itemCode: 'R2-MB-22', name: 'Mystery Box 22', description: 'Challenge: Say "Clever creators craft catchy campaigns." 5 times to get 5 Property, 3 Skilled Labour', itemType: 'MYSTERY_BOX', round: 2, basePrice: 4000 },
    { itemCode: 'R2-MB-23', name: 'Mystery Box 23', description: 'Challenge: Say "Smart startups seek smart supporters." 5 times to get 4 Machinery & Tools, 4 Technology', itemType: 'MYSTERY_BOX', round: 2, basePrice: 4000 },
    { itemCode: 'R2-MB-24', name: 'Mystery Box 24', description: 'Challenge: Say "Great goals grow grand gains." 5 times to get 1.5x bid amount', itemType: 'MYSTERY_BOX', round: 2, basePrice: 4000 },
    { itemCode: 'R2-MB-25', name: 'Mystery Box 25', description: 'Challenge: Say "Winning workers work with wise workflows." 5 times to get 5 Electricity Supply, 3 Machinery & Tools', itemType: 'MYSTERY_BOX', round: 2, basePrice: 4000 },

    // Enterprises
    { itemCode: 'R3-ENT-01', name: 'Eco-Furniture Workshop', description: 'Requires: Property (2), Skilled Labour (2), Construction Material (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 45000 },
    { itemCode: 'R3-ENT-02', name: 'Solar Lighting Solutions Assembly Unit', description: 'Requires: Property (2), Technology (2), Electricity Supply (1), Skilled Labour (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 60000 },
    { itemCode: 'R3-ENT-03', name: 'Nutrient-Rich Food Products Unit', description: 'Requires: Property (2), Machinery & Tools (2), Utilities (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 55000 },
    { itemCode: 'R3-ENT-04', name: 'Community Water Purification & Bottling Center', description: 'Requires: Property (2), Machinery & Tools (2), Electricity Supply (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 50000 },
    { itemCode: 'R3-ENT-05', name: 'Recycled Glass Products Studio', description: 'Requires: Property (2), Construction Material (2), Electricity Supply (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 65000 },
    { itemCode: 'R3-ENT-06', name: 'Women-Led Stitching & Tailoring Unit', description: 'Requires: Property (2), Skilled Labour (2), Machinery & Tools (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 40000 },
    { itemCode: 'R3-ENT-07', name: 'Community Bicycle Repair & Rental Hub', description: 'Requires: Property (2), Machinery & Tools (2), Skilled Labour (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 45000 },
    { itemCode: 'R3-ENT-08', name: 'Rural Handicrafts & Artisan Collective', description: 'Requires: Property (2), Skilled Labour (2), Utilities (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 35000 },
    { itemCode: 'R3-ENT-09', name: 'Urban Recycling Booth', description: 'Requires: Property (2), Machinery & Tools (1), Skilled Labour (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 30000 },
    { itemCode: 'R3-ENT-10', name: 'Youth Career Guidance Center', description: 'Requires: Property (2), Office Space (2), Technology (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 40000 },
    { itemCode: 'R3-ENT-11', name: 'Agro-Tech Support Center', description: 'Requires: Property (2), Technology (2), Utilities (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 60000 },
    { itemCode: 'R3-ENT-12', name: 'Rainwater Reserve Vault', description: 'Requires: Property (2), Construction Material (2), Utilities (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 55000 },
    { itemCode: 'R3-ENT-13', name: 'SunSpot Energy Center', description: 'Requires: Property (2), Technology (2), Electricity Supply (1), Skilled Labour (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 75000 },
    { itemCode: 'R3-ENT-14', name: 'UrbanRoots Garden Center', description: 'Requires: Property (2), Skilled Labour (2), Utilities (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 65000 },
    { itemCode: 'R3-ENT-15', name: 'WeCare Health Studio', description: 'Requires: Property (2), Office Space (2), Skilled Labour (1)', itemType: 'ENTERPRISE', round: 3, basePrice: 50000 },

    // Products
    { itemCode: 'R3-PROD-01', name: 'Sustainable Wooden Chairs', description: 'From: Eco-Furniture Workshop. Requires: Construction Material (1), Skilled Labour (1)', itemType: 'PRODUCT', round: 3, basePrice: 4000 },
    { itemCode: 'R3-PROD-02', name: 'Purified Drinking Water Packs', description: 'From: Community Water Purification & Bottling Center. Requires: Machinery & Tools (1), Electricity Supply (1)', itemType: 'PRODUCT', round: 3, basePrice: 3000 },
    { itemCode: 'R3-PROD-03', name: 'Handmade Cloth Bags', description: 'From: Women-Led Stitching & Tailoring Unit. Requires: Machinery & Tools (1), Skilled Labour (1)', itemType: 'PRODUCT', round: 3, basePrice: 4000 },
    { itemCode: 'R3-PROD-04', name: 'Recycled Paper Stationery', description: 'From: Urban Recycling Booth. Requires: Machinery & Tools (1), Skilled Labour (1)', itemType: 'PRODUCT', round: 3, basePrice: 3500 },
    { itemCode: 'R3-PROD-05', name: 'Affordable Seed Kits', description: 'From: Agro-Tech Support Center. Requires: Technology (1), Utilities (1)', itemType: 'PRODUCT', round: 3, basePrice: 4500 }
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