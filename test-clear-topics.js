/**
 * Test script to remove all topics from the database
 */

const axios = require('axios');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const API_URL = process.env.NEXT_PUBLIC_API_URL;

console.log('🗑️ Clearing all topics from database...\n');

async function clearAllTopics() {
  try {
    // Step 1: Login as admin
    console.log('Step 1: Logging in as admin...');
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
    console.log('✅ Logged in successfully');
    
    // Step 2: Get all topics
    console.log('\nStep 2: Fetching all topics...');
    const topicsResponse = await axios.get(`${API_URL}/api/topics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    
    const topics = topicsResponse.data;
    console.log(`📚 Found ${topics.length} topics to delete`);
    
    if (topics.length === 0) {
      console.log('✨ No topics found - database is already empty!');
      return;
    }
    
    // Step 3: Delete all topics
    console.log('\nStep 3: Deleting all topics...');
    for (const topic of topics) {
      try {
        await axios.delete(`${API_URL}/api/topics/${topic.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        console.log(`✅ Deleted topic: "${topic.title}" (ID: ${topic.id})`);
      } catch (error) {
        console.log(`❌ Failed to delete topic: "${topic.title}" (ID: ${topic.id}) - ${error.response?.status}: ${error.response?.data?.message || error.message}`);
      }
    }
    
    // Step 4: Verify all topics are deleted
    console.log('\nStep 4: Verifying deletion...');
    const finalCheckResponse = await axios.get(`${API_URL}/api/topics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    
    const remainingTopics = finalCheckResponse.data;
    console.log(`📊 Topics remaining: ${remainingTopics.length}`);
    
    if (remainingTopics.length === 0) {
      console.log('\n🎉 ALL TOPICS SUCCESSFULLY DELETED!');
      console.log('\n📋 Summary:');
      console.log('- Database is now empty');
      console.log('- Frontend will show empty state');
      console.log('- You can now test how the system behaves with no data');
      console.log('\n💡 Next steps:');
      console.log('1. Open https://lms-system-xkit.vercel.app');
      console.log('2. Login and check Topics page');
      console.log('3. See how empty state is handled');
    } else {
      console.log('\n⚠️ Some topics could not be deleted:');
      remainingTopics.forEach(topic => {
        console.log(`- ${topic.title} (ID: ${topic.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to clear topics!');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Backend connection failed - check if Laravel Cloud is running');
    } else if (error.response?.status === 401) {
      console.error('🔐 Authentication failed - check credentials');
    } else if (error.response?.status === 404) {
      console.error('🔍 Endpoint not found - check API URL');
    } else {
      console.error('Error:', error.message);
      if (error.response?.data) {
        console.error('Response:', error.response.data);
      }
    }
  }
}

clearAllTopics();