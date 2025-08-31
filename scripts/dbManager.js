require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('../models/Team');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const AdminUser = require('../models/AdminUser');

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in your .env file.');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB...');
  } catch (err) {
    console.error('❌ Connection failed:', err);
    process.exit(1);
  }
}

async function viewAllTeams() {
  console.log('\n=== ALL TEAMS ===');
  const teams = await Team.find({}).select(
    'teamNumber teamCredential budget isActive'
  );
  console.table(
    teams.map((t) => ({
      TeamNumber: t.teamNumber,
      Credential: t.teamCredential,
      Budget: t.budget,
      Active: t.isActive,
    }))
  );
}

async function viewAllItems() {
  console.log('\n=== ALL ITEMS ===');
  const items = await Item.find({}).select('name type basePrice');
  console.table(
    items.slice(0, 10).map((i) => ({
      Name: i.name,
      Type: i.type,
      Price: i.basePrice,
    }))
  );
  console.log(`... and ${items.length - 10} more items`);
}

async function viewTransactions() {
  console.log('\n=== RECENT TRANSACTIONS ===');
  const transactions = await Transaction.find({})
    .populate('teamId', 'teamNumber')
    .populate('itemId', 'name')
    .sort({ timestamp: -1 })
    .limit(10);

  console.table(
    transactions.map((t) => ({
      Team: t.teamId?.teamNumber || 'N/A',
      Item: t.itemId?.name || 'N/A',
      Amount: t.amount,
      Type: t.type,
      Date: t.timestamp.toLocaleDateString(),
    }))
  );
}

async function updateTeamBudget(teamNumber, newBudget) {
  const team = await Team.findOneAndUpdate(
    { teamNumber: teamNumber },
    { budget: newBudget },
    { new: true }
  );

  if (team) {
    console.log(`✅ Updated Team ${teamNumber} budget to ${newBudget}`);
  } else {
    console.log(`❌ Team ${teamNumber} not found`);
  }
}

async function resetDatabase() {
  console.log('🔥 Resetting database...');
  await Team.deleteMany({});
  await Item.deleteMany({});
  await Transaction.deleteMany({});
  await AdminUser.deleteMany({});
  console.log('✅ Database reset complete!');
}

async function main() {
  await connectDB();

  const action = process.argv[2];

  switch (action) {
    case 'view-teams':
      await viewAllTeams();
      break;
    case 'view-items':
      await viewAllItems();
      break;
    case 'view-transactions':
      await viewTransactions();
      break;
    case 'update-budget':
      const teamNum = parseInt(process.argv[3]);
      const budget = parseInt(process.argv[4]);
      await updateTeamBudget(teamNum, budget);
      break;
    case 'reset':
      await resetDatabase();
      break;
    default:
      console.log(`
Available commands:
  node scripts/dbManager.js view-teams
  node scripts/dbManager.js view-items  
  node scripts/dbManager.js view-transactions
  node scripts/dbManager.js update-budget <teamNumber> <newBudget>
  node scripts/dbManager.js reset
      `);
  }

  await mongoose.connection.close();
  console.log('🔌 Database connection closed.');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
