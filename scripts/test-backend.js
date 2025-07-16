const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learning-management-system-master-zcttuk.laravel.cloud';

async function testEndpoint(endpoint, method = 'GET', body = null) {
    try {
        console.log(`Testing ${method} ${endpoint}`);
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.text();
        
        console.log(`Status: ${response.status}`);
        console.log(`Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
        console.log('---');
        
        return { status: response.status, data };
    } catch (error) {
        console.log(`Error: ${error.message}`);
        console.log('---');
        return { error: error.message };
    }
}

async function main() {
    console.log('Testing backend endpoints...\n');
    
    // Test health endpoint
    await testEndpoint('/api/health');
    
    // Test login with common credentials
    const testCredentials = [
        { email: 'admin@example.com', password: 'password123' },
        { email: 'admin@admin.com', password: 'password' },
        { email: 'test@test.com', password: 'password' },
        { email: 'user@example.com', password: 'password' }
    ];
    
    for (const creds of testCredentials) {
        await testEndpoint('/api/login', 'POST', creds);
    }
    
    // Test user creation (if registration endpoint exists)
    await testEndpoint('/api/register', 'POST', {
        first_name: 'Test',
        last_name: 'Admin',
        email: 'testadmin@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        role: 'admin'
    });
    
    // Test topics endpoint (should require auth)
    await testEndpoint('/api/topics');
}

main().catch(console.error);