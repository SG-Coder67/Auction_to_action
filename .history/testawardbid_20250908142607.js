// testAwardBid.js
const axios = require('axios');
const serverUrl = 'http://localhost:3001';

// --- IMPORTANT: You must get a valid token first by logging in as an admin ---
const ADMIN_TOKEN = 'PASTE_YOUR_ADMIN_TOKEN_HERE';

// --- You also need a valid teamNumber and itemId from your database ---
const TEST_TEAM_NUMBER = 1; // A team that exists from your seeding script
const TEST_ITEM_ID = 'PASTE_A_REAL_ITEM_ID_FROM_YOUR_DATABASE'; // e.g. 64f5b...

const api = axios.create({
  baseURL: serverUrl,
  headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
});

async function runAwardBidTest() {
  try {
    console.log('--- 🧪 Starting Award Bid Test ---');

    console.log(`\nAwarding item ${TEST_ITEM_ID} to Team ${TEST_TEAM_NUMBER}...`);
    const response = await api.post('/api/admin/award-bid', {
      teamNumber: TEST_TEAM_NUMBER,
      itemId: TEST_ITEM_ID,
      price: 100,
      round: 1
    });

    console.log('✅ Bid awarded successfully!');
    console.log('Server response:', response.data);

    console.log('\n--- ✅ Award Bid test passed! ---');
  } catch (error) {
    console.error('--- ❌ TEST FAILED ---');
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

if (ADMIN_TOKEN === 'PASTE_YOUR_ADMIN_TOKEN_HERE' || TEST_ITEM_ID === 'PASTE_A_REAL_ITEM_ID_FROM_YOUR_DATABASE') {
  console.error('⚠️ Please paste a valid admin token and item ID into the script before running.');
} else {
  runAwardBidTest();
}