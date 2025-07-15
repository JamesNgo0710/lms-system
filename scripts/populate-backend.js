#!/usr/bin/env node

/**
 * Backend Data Population Script
 * 
 * This script populates any backend with sample LMS data.
 * Works with Laravel, Express, or any REST API backend.
 * 
 * Usage:
 *   node scripts/populate-backend.js
 *   node scripts/populate-backend.js --url=http://localhost:8000
 *   node scripts/populate-backend.js --force-mock
 */

const fs = require('fs')
const path = require('path')

// Configuration
const config = {
  defaultApiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000, // 10 seconds
  retries: 3,
}

// Parse command line arguments
const args = process.argv.slice(2)
const apiUrl = args.find(arg => arg.startsWith('--url='))?.split('=')[1] || config.defaultApiUrl
const forceMock = args.includes('--force-mock')
const verbose = args.includes('--verbose') || args.includes('-v')

// Sample data
const sampleData = {
  topics: [
    {
      title: "General Info on Blockchain Tech",
      category: "Basics",
      status: "Published",
      lessons_count: 3,
      has_assessment: true,
      difficulty: "Beginner",
      description: "Learn the fundamentals of blockchain technology, including how it works, its key features like decentralization and immutability, and explore various real-world applications across different industries.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop&crop=center"
    },
    {
      title: "Getting Started With Crypto",
      category: "Basics",
      status: "Published",
      lessons_count: 2,
      has_assessment: true,
      difficulty: "Beginner",
      description: "Introduction to cryptocurrency basics, understanding digital currencies, and learning how to create and secure your first cryptocurrency wallet with best practices.",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=225&fit=crop&crop=center"
    },
    {
      title: "Using MetaMask",
      category: "Wallets",
      status: "Published",
      lessons_count: 2,
      has_assessment: true,
      difficulty: "Beginner",
      description: "Complete guide to installing, setting up, and using MetaMask browser extension. Learn about network switching, token management, and advanced security features.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center"
    },
    {
      title: "Decentralised Finance (DeFi)",
      category: "DeFi",
      status: "Published",
      lessons_count: 2,
      has_assessment: true,
      difficulty: "Intermediate",
      description: "Explore decentralized finance protocols, yield farming strategies, liquidity pools, and learn advanced techniques for maximizing DeFi yields while managing risks.",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=225&fit=crop&crop=center"
    },
    {
      title: "Non-Fungible Tokens (NFTs)",
      category: "NFTs",
      status: "Published",
      lessons_count: 1,
      has_assessment: false,
      difficulty: "Beginner",
      description: "Understanding non-fungible tokens (NFTs), their technology, use cases, marketplaces, and applications in digital art, gaming, and various other industries.",
      image: "https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=400&h=225&fit=crop&crop=center"
    },
    {
      title: "Smart Contracts",
      category: "Advanced",
      status: "Published",
      lessons_count: 2,
      has_assessment: true,
      difficulty: "Advanced",
      description: "Deep dive into smart contracts, their development, deployment, and real-world applications in various blockchain ecosystems.",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=225&fit=crop&crop=center"
    }
  ],

  users: [
    {
      name: "Admin User",
      email: "admin@lms.com",
      password: "password",
      role: "admin",
      first_name: "Admin",
      last_name: "User",
      joined_date: "2023-01-01"
    },
    {
      name: "John Doe",
      email: "john@example.com",
      password: "password",
      role: "student",
      first_name: "John",
      last_name: "Doe",
      joined_date: "2023-02-15"
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: "password",
      role: "student",
      first_name: "Jane",
      last_name: "Smith",
      joined_date: "2023-03-01"
    },
    {
      name: "Bob Wilson",
      email: "bob@example.com",
      password: "password",
      role: "student",
      first_name: "Bob",
      last_name: "Wilson",
      joined_date: "2023-03-10"
    },
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: "password",
      role: "student",
      first_name: "Alice",
      last_name: "Johnson",
      joined_date: "2023-03-15"
    }
  ]
}

// Utility functions
function log(message, force = false) {
  if (verbose || force) {
    console.log(message)
  }
}

function error(message) {
  console.error(`❌ ${message}`)
}

function success(message) {
  console.log(`✅ ${message}`)
}

function warn(message) {
  console.log(`⚠️ ${message}`)
}

async function makeRequest(url, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), config.timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    })
    
    clearTimeout(timeoutId)
    return response
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }
}

async function testBackendConnection(url) {
  try {
    log(`Testing connection to ${url}...`)
    
    // Try health check first
    let response = await makeRequest(`${url}/api/health`)
    if (response.status < 500) {
      return true
    }

    // Try topics endpoint
    response = await makeRequest(`${url}/api/topics`)
    if (response.status < 500) {
      return true
    }

    return false
  } catch (error) {
    log(`Connection test failed: ${error.message}`)
    return false
  }
}

async function populateTopics(apiUrl) {
  success('Populating topics...')
  
  for (const topic of sampleData.topics) {
    try {
      const response = await makeRequest(`${apiUrl}/api/topics`, {
        method: 'POST',
        body: JSON.stringify(topic),
      })

      if (response.ok) {
        const result = await response.json()
        log(`  ✅ Created topic: ${topic.title}`)
      } else {
        log(`  ❌ Failed to create topic: ${topic.title} (${response.status})`)
      }
    } catch (error) {
      log(`  ❌ Error creating topic ${topic.title}: ${error.message}`)
    }
  }
}

async function populateUsers(apiUrl) {
  success('Populating users...')
  
  for (const user of sampleData.users) {
    try {
      const response = await makeRequest(`${apiUrl}/api/users`, {
        method: 'POST',
        body: JSON.stringify(user),
      })

      if (response.ok) {
        const result = await response.json()
        log(`  ✅ Created user: ${user.name}`)
      } else {
        log(`  ❌ Failed to create user: ${user.name} (${response.status})`)
      }
    } catch (error) {
      log(`  ❌ Error creating user ${user.name}: ${error.message}`)
    }
  }
}

async function generateSqlFiles() {
  success('Generating SQL files for manual import...')
  
  const sqlDir = path.join(process.cwd(), 'sql-export')
  if (!fs.existsSync(sqlDir)) {
    fs.mkdirSync(sqlDir)
  }

  // Generate topics SQL
  let topicsSql = "-- Topics Data\\nINSERT INTO topics (title, category, status, lessons_count, has_assessment, difficulty, description, image, created_at, updated_at) VALUES\\n"
  
  const topicValues = sampleData.topics.map(topic => 
    `('${topic.title.replace(/'/g, "''")}', '${topic.category}', '${topic.status}', ${topic.lessons_count}, ${topic.has_assessment}, '${topic.difficulty}', '${topic.description.replace(/'/g, "''")}', '${topic.image}', NOW(), NOW())`
  ).join(',\\n')
  
  topicsSql += topicValues + ';'
  
  fs.writeFileSync(path.join(sqlDir, 'topics.sql'), topicsSql)
  log(`  📁 Created: sql-export/topics.sql`)

  // Generate users SQL  
  let usersSql = "-- Users Data\\nINSERT INTO users (name, email, password, role, first_name, last_name, joined_date, created_at, updated_at) VALUES\\n"
  
  const userValues = sampleData.users.map(user =>
    `('${user.name}', '${user.email}', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '${user.role}', '${user.first_name}', '${user.last_name}', '${user.joined_date}', NOW(), NOW())`
  ).join(',\\n')
  
  usersSql += userValues + ';'
  
  fs.writeFileSync(path.join(sqlDir, 'users.sql'), usersSql)
  log(`  📁 Created: sql-export/users.sql`)

  success(`SQL files generated in: ${sqlDir}`)
}

async function main() {
  console.log('🚀 LMS Backend Data Population Script')
  console.log('=====================================')
  console.log('')

  if (forceMock) {
    warn('Force mock mode enabled - generating SQL files only')
    await generateSqlFiles()
    return
  }

  // Test backend connection
  const isConnected = await testBackendConnection(apiUrl)
  
  if (!isConnected) {
    error(`Cannot connect to backend at ${apiUrl}`)
    console.log('')
    console.log('💡 Possible solutions:')
    console.log('  1. Make sure your Laravel backend is running')
    console.log('  2. Check the API URL in your .env file')
    console.log('  3. Use --force-mock to generate SQL files instead')
    console.log('  4. Run with --url=http://your-backend-url')
    console.log('')
    
    warn('Generating SQL files as fallback...')
    await generateSqlFiles()
    return
  }

  success(`Connected to backend at ${apiUrl}`)
  console.log('')

  // Populate data
  try {
    await populateTopics(apiUrl)
    await populateUsers(apiUrl)
    
    console.log('')
    success('✨ Backend population completed!')
    console.log('')
    console.log('🎯 Next steps:')
    console.log('  1. Start your frontend: npm run dev')
    console.log('  2. Login with: admin@lms.com / password')
    console.log('  3. Check that topics and users are visible')
    
  } catch (error) {
    error(`Population failed: ${error.message}`)
    console.log('')
    warn('Generating SQL files as fallback...')
    await generateSqlFiles()
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { sampleData, populateTopics, populateUsers, testBackendConnection }