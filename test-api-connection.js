// API Connection Test Script
// Run this to test if your Laravel backend is properly connected

async function testApiConnection() {
  console.log('🔌 Testing API connection...\n');
  
  // Test multiple potential backend URLs
  const backendUrls = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];
  
  let connectedBackend = null;
  
  console.log('🔍 Detecting backend...');
  
  // First, try to detect which backend is running
  for (const baseUrl of backendUrls) {
    try {
      console.log(`   Testing ${baseUrl}...`);
      
      // Try health check first
      const healthResponse = await fetch(`${baseUrl}/api/health`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log(`   ✅ Health check successful: ${healthData.message || 'OK'}`);
        connectedBackend = baseUrl;
        break;
      }
      
      // If health check fails, try topics endpoint
      const topicsResponse = await fetch(`${baseUrl}/api/topics`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });
      
      if (topicsResponse.status < 500) {
        console.log(`   ✅ Backend detected at ${baseUrl} (topics endpoint responding)`);
        connectedBackend = baseUrl;
        break;
      }
      
    } catch (error) {
      console.log(`   ❌ ${baseUrl}: ${error.message}`);
    }
  }
  
  if (!connectedBackend) {
    console.log('\n❌ No backend detected! The application will use mock data.');
    console.log('📋 To connect to a Laravel backend:');
    console.log('   1. Start your Laravel server: php artisan serve');
    console.log('   2. Make sure it\'s running on http://localhost:8000');
    console.log('   3. Check that CORS is properly configured');
    console.log('   4. Run this test again');
    return;
  }
  
  console.log(`\n✅ Connected to backend: ${connectedBackend}`);
  console.log('\n🧪 Testing API endpoints...\n');
  
  const endpoints = [
    { name: 'Health Check', url: `${connectedBackend}/api/health` },
    { name: 'Topics', url: `${connectedBackend}/api/topics` },
    { name: 'Users', url: `${connectedBackend}/api/users` },
    { name: 'Lessons', url: `${connectedBackend}/api/lessons` },
    { name: 'Assessments', url: `${connectedBackend}/api/assessments` }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name}: ${Array.isArray(data) ? data.length + ' items' : 'OK'}`);
      } else if (response.status === 401) {
        console.log(`⚠️  ${endpoint.name}: ${response.status} ${response.statusText} (authentication required)`);
      } else if (response.status === 403) {
        console.log(`⚠️  ${endpoint.name}: ${response.status} ${response.statusText} (authorization required)`);
      } else if (response.status === 404) {
        console.log(`❌ ${endpoint.name}: ${response.status} ${response.statusText} (endpoint not found)`);
      } else {
        console.log(`❌ ${endpoint.name}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Connection failed - ${error.message}`);
    }
  }
  
  console.log('\n📋 Test completed!');
  console.log('\n💡 Tips:');
  console.log('   - 200 OK: Endpoint is working properly');
  console.log('   - 401/403: Backend is running but requires authentication');
  console.log('   - 404: Endpoint not found (check your routes)');
  console.log('   - Connection failed: Backend is not running or unreachable');
}

// Run the test
testApiConnection();