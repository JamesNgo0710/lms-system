#!/usr/bin/env node

/**
 * Simple test script to verify backend connection
 * Tests the backend detection logic by making direct API calls
 */

// Using built-in fetch (Node.js 18+) or global fetch if available
const fetch = globalThis.fetch || require('node-fetch');

async function testBackendConnection() {
  console.log('🔍 Testing backend connection and detection...\n');
  
  const potentialUrls = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
  ];
  
  let detectedBackend = null;
  
  console.log('📋 Backend Detection Test');
  console.log('   Testing URLs in priority order...');
  
  for (const url of potentialUrls) {
    try {
      console.log(`   Testing ${url}...`);
      
      // Test health endpoint first
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const healthResponse = await fetch(`${url}/api/health`, {
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          console.log(`   ✅ Health check successful: ${healthData.message || 'OK'}`);
          detectedBackend = url;
          break;
        }
      } catch (healthError) {
        // Health check failed, try topics endpoint
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const topicsResponse = await fetch(`${url}/api/topics`, {
            headers: { 'Accept': 'application/json' },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (topicsResponse.status < 500) {
            console.log(`   ✅ Backend detected (topics endpoint responding with ${topicsResponse.status})`);
            detectedBackend = url;
            break;
          }
        } catch (topicsError) {
          // Both endpoints failed
          console.log(`   ❌ Both health and topics endpoints failed`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ ${url}: ${error.message}`);
    }
  }
  
  if (!detectedBackend) {
    console.log('\n❌ Backend Detection Result: No backend detected');
    console.log('   The application will use mock data mode');
    console.log('   This matches the config.ts logic for fallback behavior');
    return;
  }
  
  console.log(`\n✅ Backend Detection Result: ${detectedBackend}`);
  console.log('   This URL will be used by the frontend config');
  
  // Test API endpoint responses
  console.log('\n📋 API Endpoint Testing');
  
  const endpoints = [
    { name: 'Health', path: '/api/health' },
    { name: 'Topics', path: '/api/topics' },
    { name: 'Users', path: '/api/users' },
    { name: 'Lessons', path: '/api/lessons' },
    { name: 'Assessments', path: '/api/assessments' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${detectedBackend}${endpoint.path}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      
      const statusInfo = response.status < 300 ? '✅' : 
                         response.status < 400 ? '⚠️' : 
                         response.status < 500 ? '❌' : '💥';
      
      console.log(`   ${statusInfo} ${endpoint.name}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        try {
          const data = await response.json();
          console.log(`      Data: ${Array.isArray(data) ? data.length + ' items' : typeof data}`);
        } catch (jsonError) {
          console.log(`      Response: ${response.statusText}`);
        }
      }
      
    } catch (error) {
      console.log(`   💥 ${endpoint.name}: ${error.message}`);
    }
  }
  
  console.log('\n📋 Frontend Integration Test');
  console.log('   Testing how frontend will handle this backend...');
  
  // Simulate frontend behavior
  const backendConfig = {
    apiUrl: detectedBackend,
    isConnected: true,
    type: 'laravel'
  };
  
  console.log('   Frontend will use:');
  console.log(`   - API URL: ${backendConfig.apiUrl}`);
  console.log(`   - Connected: ${backendConfig.isConnected}`);
  console.log(`   - Type: ${backendConfig.type}`);
  
  // Test a sample API call that the frontend would make
  try {
    const testResponse = await fetch(`${detectedBackend}/api/topics`, {
      headers: { 'Accept': 'application/json' },
      timeout: 5000
    });
    
    if (testResponse.ok) {
      console.log('   ✅ Frontend will successfully connect to backend');
    } else if (testResponse.status === 401) {
      console.log('   ⚠️  Frontend will need authentication for API calls');
    } else {
      console.log(`   ❌ Frontend will encounter ${testResponse.status} errors`);
    }
    
  } catch (error) {
    console.log(`   💥 Frontend will fail to connect: ${error.message}`);
  }
  
  console.log('\n🎉 Backend connection test completed!');
  console.log('\nNext steps:');
  console.log('1. Start the Next.js development server: npm run dev');
  console.log('2. Check the browser console for backend detection logs');
  console.log('3. Verify the application uses the detected backend URL');
  console.log('4. Test actual API calls through the frontend interface');
}

testBackendConnection();