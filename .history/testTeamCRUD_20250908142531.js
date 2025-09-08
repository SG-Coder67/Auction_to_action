// testTeamCRUD.js
const axios = require('axios');
const serverUrl = 'http://localhost:3001';

// --- IMPORTANT: You must get a valid token first by logging in as an admin ---
// 1. Run node server.js
// 2. Use Postman to POST to /api/admin/login with your admin credentials
// 3. Paste the token you receive here:
const ADMIN_TOKEN = 'PASTE_YOUR_ADMIN_TOKEN_HERE';

const api = axios.create({
  baseURL: serverUrl,
  headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
});

async function runTeamTests() {
  try {
    console.log('--- 🧪 Starting Team CRUD Test ---');

    // 1. CREATE a new team
    console.log('\n1. Creating Team 99...');
    const createRes = await api.post('/api/admin/teams', {
      teamNumber: 99,
      teamCredential: 'TEST99',
      credit: 5000
    });
    const newTeamId = createRes.data.team._id;
    console.log('✅ Team 99 created successfully with ID:', newTeamId);

    // 2. READ all teams
    console.log('\n2. Reading all teams...');
    const getRes = await api.get('/api/admin/teams');
    console.log(`✅ Found ${getRes.data.length} teams.`);

    // 3. UPDATE Team 99
    console.log('\n3. Updating Team 99 credit to 7500...');
    await api.put(`/api/admin/teams/${newTeamId}`, {
      credit: 7500
    });
    console.log('✅ Team 99 updated.');

    // 4. DELETE Team 99
    console.log('\n4. Deleting Team 99...');
    await api.delete(`/api/admin/teams/${newTeamId}`);
    console.log('✅ Team 99 deleted.');

    console.log('\n--- ✅ All Team CRUD tests passed! ---');

  } catch (error) {
    console.error('--- ❌ TEST FAILED ---');
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

if (ADMIN_TOKEN === 'PASTE_YOUR_ADMIN_TOKEN_HERE') {
  console.error('⚠️ Please paste a valid admin token into the script before running.');
} else {
  runTeamTests();
}