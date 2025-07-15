// Backend Data Setup Script
// This script populates the Laravel backend with realistic LMS data
// Run this with: node setup-backend-data.js

const topics = [
  {
    id: 1,
    title: "General Info on Blockchain Tech",
    category: "Basics",
    status: "Published",
    lessons: 3,
    hasAssessment: true,
    difficulty: "Beginner",
    description: "Learn the fundamentals of blockchain technology, including how it works, its key features like decentralization and immutability, and explore various real-world applications across different industries.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop&crop=center"
  },
  {
    id: 2,
    title: "Getting Started With Crypto",
    category: "Basics", 
    status: "Published",
    lessons: 2,
    hasAssessment: true,
    difficulty: "Beginner",
    description: "Introduction to cryptocurrency basics, understanding digital currencies, and learning how to create and secure your first cryptocurrency wallet with best practices.",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=225&fit=crop&crop=center"
  },
  {
    id: 3,
    title: "Using MetaMask",
    category: "Wallets",
    status: "Published", 
    lessons: 2,
    hasAssessment: true,
    difficulty: "Beginner",
    description: "Complete guide to installing, setting up, and using MetaMask browser extension. Learn about network switching, token management, and advanced security features.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center"
  },
  {
    id: 4,
    title: "Decentralised Finance (DeFi)",
    category: "DeFi",
    status: "Published",
    lessons: 2, 
    hasAssessment: true,
    difficulty: "Intermediate",
    description: "Explore decentralized finance protocols, yield farming strategies, liquidity pools, and learn advanced techniques for maximizing DeFi yields while managing risks.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=225&fit=crop&crop=center"
  },
  {
    id: 5,
    title: "Non-Fungible Tokens (NFTs)",
    category: "NFTs",
    status: "Published",
    lessons: 1,
    hasAssessment: false,
    difficulty: "Beginner", 
    description: "Understanding non-fungible tokens (NFTs), their technology, use cases, marketplaces, and applications in digital art, gaming, and various other industries.",
    image: "https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=400&h=225&fit=crop&crop=center"
  },
  {
    id: 6,
    title: "Smart Contracts",
    category: "Advanced",
    status: "Published",
    lessons: 2,
    hasAssessment: true,
    difficulty: "Advanced",
    description: "Deep dive into smart contracts, their development, deployment, and real-world applications in various blockchain ecosystems.",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=225&fit=crop&crop=center"
  }
];

const users = [
  { id: "1", name: "Admin User", email: "admin@lms.com", role: "admin", firstName: "Admin", lastName: "User" },
  { id: "2", name: "John Doe", email: "john@example.com", role: "student", firstName: "John", lastName: "Doe" },
  { id: "3", name: "Jane Smith", email: "jane@example.com", role: "student", firstName: "Jane", lastName: "Smith" },
  { id: "4", name: "Bob Wilson", email: "bob@example.com", role: "student", firstName: "Bob", lastName: "Wilson" },
  { id: "5", name: "Alice Johnson", email: "alice@example.com", role: "student", firstName: "Alice", lastName: "Johnson" }
];

async function setupBackendData() {
  console.log('🚀 Setting up LMS backend data...');
  
  try {
    // Create topics
    console.log('📚 Creating topics...');
    for (const topic of topics) {
      const response = await fetch('http://localhost:3000/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-auth-token' // You'll need to get this from your auth
        },
        body: JSON.stringify({
          ...topic,
          createdAt: new Date().toISOString().split('T')[0],
          students: 0
        })
      });
      
      if (response.ok) {
        console.log(`✅ Created topic: ${topic.title}`);
      } else {
        console.log(`❌ Failed to create topic: ${topic.title}`);
      }
    }
    
    console.log('✨ Backend data setup completed!');
    console.log('📝 Next steps:');
    console.log('1. Run the SQL seeders in your Laravel database');
    console.log('2. Make sure your Laravel API is running'); 
    console.log('3. Test the frontend to ensure data is loading from backend');
    
  } catch (error) {
    console.error('❌ Error setting up backend data:', error);
  }
}

// Uncomment to run the setup
// setupBackendData();

console.log('📋 LMS Backend Data Setup Script');
console.log('================================');
console.log('');
console.log('This script contains sample data for your LMS system.');
console.log('To populate your Laravel backend:');
console.log('');
console.log('1. Run the SQL files in your Laravel database:');
console.log('   - database-seeder.sql');
console.log('   - database-questions-seeder.sql');
console.log('');
console.log('2. Or create a Laravel seeder using laravel-seeder-command.php');
console.log('');
console.log('3. Make sure your Laravel API routes are set up to handle:');
console.log('   - Topics CRUD operations');
console.log('   - Lessons CRUD operations'); 
console.log('   - Assessments CRUD operations');
console.log('   - User progress tracking');
console.log('');
console.log('4. Update your Laravel models to match the data structure');
console.log('');
console.log('Sample data includes:');
console.log(`- ${topics.length} topics with comprehensive content`);
console.log(`- ${users.length} users (1 admin, 4 students)`);
console.log('- 12 lessons across all topics');
console.log('- 5 assessments with questions');
console.log('- Sample progress data and assessment attempts');