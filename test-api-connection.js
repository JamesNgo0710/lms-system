// API Connection Test Script
// Run this to test if your Laravel backend is properly connected

async function testApiConnection() {
  console.log('🔌 Testing API connection...\n');
  
  const endpoints = [
    { name: 'Topics', url: 'http://localhost:3000/api/topics' },
    { name: 'Users', url: 'http://localhost:3000/api/users' },
    { name: 'Lessons', url: 'http://localhost:3000/api/lessons' },
    { name: 'Assessments', url: 'http://localhost:3000/api/assessments' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        headers: {
          'Accept': 'application/json',
          // Add authorization header if needed
          // 'Authorization': 'Bearer your-token'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name}: ${Array.isArray(data) ? data.length : 'OK'} items`);
      } else {
        console.log(`❌ ${endpoint.name}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Connection failed - ${error.message}`);
    }
  }
  
  console.log('\n📋 Test completed!');
}

// Run the test
testApiConnection();