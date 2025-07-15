#!/usr/bin/env node

/**
 * Test script to verify backend detection functionality
 * This tests the config.ts backend detection logic
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function testBackendDetection() {
  console.log('🔍 Testing backend detection functionality...\n');
  
  try {
    // Test 1: Check if backend detector can find the backend
    console.log('📋 Test 1: Backend Detection');
    console.log('   Testing if backend detector can find Laravel backend...');
    
    const testScript = `
      const { detectBackend } = require('./lib/config.ts');
      
      detectBackend().then(backend => {
        console.log('Backend Config:', JSON.stringify(backend, null, 2));
        
        if (backend.isConnected) {
          console.log('✅ Backend detection successful');
          console.log('   URL:', backend.apiUrl);
          console.log('   Type:', backend.type);
        } else {
          console.log('❌ Backend detection failed - using mock mode');
          console.log('   URL:', backend.apiUrl);
          console.log('   Type:', backend.type);
        }
      }).catch(error => {
        console.error('❌ Backend detection error:', error.message);
      });
    `;
    
    await execAsync(`node -e "${testScript}"`);
    
    console.log('\n📋 Test 2: API Data Store Integration');
    console.log('   Testing if API data store uses correct backend...');
    
    const apiTestScript = `
      const { apiDataStore } = require('./lib/api-data-store.ts');
      
      console.log('Testing API Data Store backend detection...');
      
      // Test getting topics (should use detected backend)
      apiDataStore.getTopics().then(topics => {
        console.log('✅ Topics fetched:', topics.length, 'items');
        console.log('   Sample topic:', topics[0]?.title || 'None');
      }).catch(error => {
        console.log('❌ Topics fetch failed:', error.message);
      });
    `;
    
    await execAsync(`node -e "${apiTestScript}"`);
    
    console.log('\n📋 Test 3: Configuration Values');
    console.log('   Checking config values...');
    
    const configTestScript = `
      const { config } = require('./lib/config.ts');
      
      console.log('Configuration values:');
      console.log('   API URL:', config.apiUrl);
      console.log('   Frontend URL:', config.frontendUrl);
      console.log('   Development mode:', config.isDevelopment);
      console.log('   Debug enabled:', config.enableDebug);
      console.log('   Demo mode:', config.enableDemo);
    `;
    
    await execAsync(`node -e "${configTestScript}"`);
    
    console.log('\n✅ Backend detection tests completed!');
    
  } catch (error) {
    console.error('❌ Backend detection test failed:', error.message);
  }
}

testBackendDetection();