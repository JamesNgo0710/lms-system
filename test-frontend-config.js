/**
 * Test frontend configuration and backend connection
 */

const axios = require('axios');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

console.log('🔍 Testing Frontend Configuration...\n');

console.log('📋 Configuration:');
console.log(`- API URL: ${API_URL}`);
console.log(`- NextAuth URL: ${NEXTAUTH_URL}`);
console.log(`- App Name: ${process.env.NEXT_PUBLIC_APP_NAME}`);
console.log('');

async function testFrontendConfig() {
  try {
    // Test 1: Backend connectivity
    console.log('Step 1: Testing backend connectivity...');
    const healthResponse = await axios.get(`${API_URL}/api/health`, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
      }
    });
    console.log('✅ Backend health check passed');
    
    // Test 2: Login endpoint
    console.log('\nStep 2: Testing login endpoint...');
    const loginResponse = await axios.post(`${API_URL}/api/login`, {
      email: 'admin@lms.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    console.log('✅ Login endpoint working');
    console.log(`- User: ${loginResponse.data.user.first_name} ${loginResponse.data.user.last_name}`);
    console.log(`- Role: ${loginResponse.data.user.role}`);
    
    // Test 3: Authenticated API call
    console.log('\nStep 3: Testing authenticated API call...');
    const token = loginResponse.data.token;
    const topicsResponse = await axios.get(`${API_URL}/api/topics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    
    console.log('✅ Authenticated API call working');
    console.log(`- Topics found: ${topicsResponse.data.length}`);
    
    console.log('\n🎉 All frontend configuration tests passed!');
    console.log('\n📋 Summary:');
    console.log('- Backend connection: ✅ Working');
    console.log('- Authentication: ✅ Working');
    console.log('- API endpoints: ✅ Working');
    console.log('- Configuration: ✅ Correct');
    console.log('\n✨ Your frontend is ready to use with persistent data!');
    
  } catch (error) {
    console.error('❌ Frontend configuration test failed!');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Backend connection failed - check if Laravel Cloud is running');
    } else if (error.response?.status === 401) {
      console.error('🔐 Authentication failed - check credentials');
    } else if (error.response?.status === 404) {
      console.error('🔍 Endpoint not found - check API URL');
    } else {
      console.error('Error:', error.message);
      console.error('URL:', error.config?.url);
    }
  }
}

testFrontendConfig();