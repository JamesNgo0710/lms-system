#!/usr/bin/env node

/**
 * Test script to verify mock data is working properly
 */

// Import the mock data service
const { mockDataService } = require('./lib/mock-data-service.ts')

async function testMockData() {
  console.log('🧪 Testing Mock Data Service...')
  console.log('')

  try {
    // Test topics
    console.log('📚 Testing topics...')
    const topics = await mockDataService.getTopics()
    console.log(`✅ Topics: ${topics.length} items`)
    console.log(`   Sample: ${topics[0]?.title}`)
    
    // Test users
    console.log('')
    console.log('👥 Testing users...')
    const users = await mockDataService.getUsers()
    console.log(`✅ Users: ${users.length} items`)
    console.log(`   Sample: ${users[0]?.name}`)
    
    // Test lessons
    console.log('')
    console.log('📖 Testing lessons...')
    const lessons = await mockDataService.getLessons()
    console.log(`✅ Lessons: ${lessons.length} items`)
    console.log(`   Sample: ${lessons[0]?.title}`)
    
    // Test lesson completions
    console.log('')
    console.log('✅ Testing user progress...')
    const completions = await mockDataService.getUserLessonCompletions('2')
    console.log(`✅ Lesson Completions: ${completions.length} items`)
    
    // Test topic progress
    const progress = await mockDataService.getTopicProgress('2', 1)
    console.log(`✅ Topic Progress: ${progress.completed}/${progress.total} (${progress.percentage}%)`)
    
    console.log('')
    console.log('🎉 All mock data tests passed!')
    
  } catch (error) {
    console.error('❌ Mock data test failed:', error)
  }
}

testMockData()