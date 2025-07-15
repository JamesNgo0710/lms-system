const axios = require('axios');

const API_URL = 'https://learning-management-system-master-zcttuk.laravel.cloud';

async function testTopicSeeder() {
  console.log('🔍 Testing topic seeder and backend data...\n');

  try {
    // Step 1: Login to get authentication token
    console.log('Step 1: Logging in...');
    const loginResponse = await axios.post(`${API_URL}/api/login`, {
      email: 'admin@lms.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    // Step 2: Get topics from backend
    console.log('\nStep 2: Fetching topics from backend...');
    const topicsResponse = await axios.get(`${API_URL}/api/topics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    console.log('✅ Topics fetched successfully');
    console.log(`📋 Found ${topicsResponse.data.length} topics in backend:`);
    
    topicsResponse.data.forEach((topic, index) => {
      console.log(`  ${index + 1}. ${topic.title} (ID: ${topic.id})`);
      console.log(`     Category: ${topic.category} | Status: ${topic.status} | Difficulty: ${topic.difficulty}`);
    });

    if (topicsResponse.data.length === 0) {
      console.log('\n⚠️  No topics found in backend! The seeder may not have run yet.');
      console.log('💡 Laravel Cloud should run the seeder automatically on deployment.');
    } else {
      console.log('\n🎉 Backend has topic data! The persistence issue should be resolved.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testTopicSeeder();