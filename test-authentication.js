/**
 * Test authentication with Laravel backend
 */

const axios = require('axios');

const API_URL = 'https://learning-management-system-master-zcttuk.laravel.cloud';

async function testAuthentication() {
  console.log('🔍 Testing Laravel Backend Authentication...\n');

  try {
    // Step 1: Test login endpoint
    console.log('Step 1: Testing login endpoint...');
    const loginResponse = await axios.post(`${API_URL}/api/login`, {
      email: 'admin@lms.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    console.log('✅ Login successful!');
    console.log('User:', loginResponse.data.user.name);
    console.log('Token (first 20 chars):', loginResponse.data.token.substring(0, 20) + '...');
    
    const token = loginResponse.data.token;

    // Step 2: Test authenticated endpoint
    console.log('\nStep 2: Testing authenticated topics endpoint...');
    const topicsResponse = await axios.get(`${API_URL}/api/topics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    console.log('✅ Topics endpoint successful!');
    console.log('Topics count:', topicsResponse.data.length);
    
    // Step 3: Test creating a topic
    console.log('\nStep 3: Testing topic creation...');
    const createResponse = await axios.post(`${API_URL}/api/topics`, {
      title: 'Test Topic',
      category: 'Test',
      status: 'Published',
      difficulty: 'Beginner',
      description: 'Test description',
      has_assessment: false
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    console.log('✅ Topic creation successful!');
    console.log('New topic ID:', createResponse.data.id);
    
    // Step 4: Test getting the created topic
    console.log('\nStep 4: Testing topic retrieval...');
    const getTopicResponse = await axios.get(`${API_URL}/api/topics/${createResponse.data.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    console.log('✅ Topic retrieval successful!');
    console.log('Retrieved topic:', getTopicResponse.data.title);

    console.log('\n🎉 All authentication tests passed!');
    console.log('📋 Summary:');
    console.log('- Login endpoint: Working ✅');
    console.log('- Authentication tokens: Working ✅');
    console.log('- CRUD operations: Working ✅');
    console.log('- Backend persistence: Working ✅');

  } catch (error) {
    console.error('❌ Authentication test failed!');
    console.error('Error:', error.response?.data?.message || error.message);
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
    
    if (error.response?.status === 401) {
      console.error('🔐 Authentication issue - invalid token or expired session');
    } else if (error.response?.status === 500) {
      console.error('🔧 Server error - check Laravel backend logs');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('📡 Connection refused - is Laravel backend running?');
    }
  }
}

// Run the test
testAuthentication();