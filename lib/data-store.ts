"use client"

interface Topic {
  id: number
  title: string
  category: string
  status: "Published" | "Draft"
  students: number
  lessons: number
  createdAt: string
  hasAssessment: boolean
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  description?: string
  image?: string
}

interface Lesson {
  id: number
  topicId: number
  title: string
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  videoUrl?: string
  prerequisites: string[]
  content: string
  socialLinks: {
    twitter?: string
    discord?: string
    youtube?: string
    instagram?: string
  }
  downloads: {
    id: number
    name: string
    size: string
    url: string
  }[]
  order: number
  status: "Published" | "Draft"
  createdAt: string
  image?: string
}

interface LessonCompletion {
  id: string
  userId: string
  lessonId: number
  topicId: number
  completedAt: string
  timeSpent?: number // in minutes
}

interface LessonView {
  id: string
  userId: string
  lessonId: number
  topicId: number
  viewedAt: string
  duration?: number // in minutes watched
}

interface Assessment {
  id: number
  topicId: number
  totalQuestions: number
  timeLimit: string
  retakePeriod: string
  cooldownPeriod: number // in hours (1-168 hours = 1 hour to 7 days)
  questions: Question[]
  createdAt: string
}

interface AssessmentAttempt {
  id: string
  userId: string
  assessmentId: number
  topicId: number
  score: number
  correctAnswers: number
  totalQuestions: number
  timeSpent: number // in seconds
  completedAt: string
  answers: (string | number)[]
}

interface Question {
  id: number
  type: "true-false" | "multiple-choice"
  question: string
  options?: string[]
  correctAnswer: string | number
  image?: string
}

interface User {
  id: string
  username: string
  email: string
  role: "admin" | "student"
  firstName: string
  lastName: string
  joinedDate: string
  currentTopic?: string
  completedTopics: number
  totalTopics: number
  weeklyHours: number
  thisWeekHours: number
}

interface CommunityPost {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  isAnswered: boolean
  isPinned: boolean
  status: "active" | "closed" | "archived"
  replyCount: number
}

interface CommunityReply {
  id: string
  postId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
  updatedAt: string
  likes: number
  isAcceptedAnswer: boolean
  parentReplyId?: string
}

interface CommunityStats {
  totalPosts: number
  totalReplies: number
  totalUsers: number
  answeredRate: number
  topCategories: { name: string; count: number }[]
  topContributors: { id: string; name: string; posts: number; replies: number; reputation: number }[]
}

// Template questions for each topic
const templateQuestions: Record<string, Question[]> = {
  "General Info on Blockchain Tech": [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is blockchain technology primarily used for?",
      options: ["Gaming only", "Decentralized transactions", "Social media", "Video streaming"],
      correctAnswer: 1,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      type: "true-false",
      question: "Blockchain is a centralized database system.",
      correctAnswer: "false",
    },
    {
      id: 3,
      type: "multiple-choice",
      question: "Which of the following is a key feature of blockchain?",
      options: ["Centralization", "Immutability", "Single point of failure", "Manual verification"],
      correctAnswer: 1,
    },
    {
      id: 4,
      type: "true-false",
      question: "Bitcoin was the first cryptocurrency ever created.",
      correctAnswer: "true",
    },
    {
      id: 5,
      type: "multiple-choice",
      question: "What does 'mining' refer to in blockchain?",
      options: ["Extracting gold", "Validating transactions", "Creating websites", "Storing data"],
      correctAnswer: 1,
    },
    {
      id: 6,
      type: "multiple-choice",
      question: "What is a hash function in blockchain?",
      options: [
        "A type of cryptocurrency",
        "A mathematical function that converts input to fixed output",
        "A mining tool",
        "A wallet address",
      ],
      correctAnswer: 1,
    },
    {
      id: 7,
      type: "true-false",
      question: "Blockchain transactions are reversible.",
      correctAnswer: "false",
    },
    {
      id: 8,
      type: "multiple-choice",
      question: "What is consensus in blockchain?",
      options: ["Agreement between users", "A type of cryptocurrency", "A wallet feature", "A mining reward"],
      correctAnswer: 0,
    },
    {
      id: 9,
      type: "true-false",
      question: "All blockchain networks are public.",
      correctAnswer: "false",
    },
    {
      id: 10,
      type: "multiple-choice",
      question: "What is a smart contract?",
      options: [
        "A legal document",
        "Self-executing contract with code",
        "A type of cryptocurrency",
        "A mining algorithm",
      ],
      correctAnswer: 1,
    },
  ],
  "Getting Started With Crypto": [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is cryptocurrency?",
      options: ["Physical money", "Digital currency", "Credit card", "Bank account"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "true-false",
      question: "Cryptocurrencies are controlled by central banks.",
      correctAnswer: "false",
    },
    {
      id: 3,
      type: "multiple-choice",
      question: "Which was the first cryptocurrency?",
      options: ["Ethereum", "Litecoin", "Bitcoin", "Ripple"],
      correctAnswer: 2,
    },
    {
      id: 4,
      type: "true-false",
      question: "You need a wallet to store cryptocurrencies.",
      correctAnswer: "true",
    },
    {
      id: 5,
      type: "multiple-choice",
      question: "What is a private key?",
      options: ["Public address", "Secret code for wallet access", "Exchange name", "Coin type"],
      correctAnswer: 1,
    },
    {
      id: 6,
      type: "true-false",
      question: "Cryptocurrency transactions are anonymous.",
      correctAnswer: "false",
    },
    {
      id: 7,
      type: "multiple-choice",
      question: "What is market capitalization in crypto?",
      options: ["Total value of all coins", "Price per coin", "Number of transactions", "Mining difficulty"],
      correctAnswer: 0,
    },
    {
      id: 8,
      type: "true-false",
      question: "All cryptocurrencies use the same technology.",
      correctAnswer: "false",
    },
  ],
  "Using MetaMask": [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is MetaMask?",
      options: ["A cryptocurrency", "A blockchain wallet", "An exchange", "A mining tool"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "true-false",
      question: "MetaMask can be used as a browser extension.",
      correctAnswer: "true",
    },
    {
      id: 3,
      type: "multiple-choice",
      question: "What should you never share from your MetaMask wallet?",
      options: ["Public address", "Seed phrase", "Transaction history", "Network settings"],
      correctAnswer: 1,
    },
    {
      id: 4,
      type: "true-false",
      question: "MetaMask only works with Bitcoin.",
      correctAnswer: "false",
    },
    {
      id: 5,
      type: "multiple-choice",
      question: "How many words are typically in a MetaMask seed phrase?",
      options: ["8", "12", "16", "24"],
      correctAnswer: 1,
    },
  ],
  "Decentralised Finance (DeFi)": [
    {
      id: 1,
      type: "multiple-choice",
      question: "What does DeFi stand for?",
      options: ["Digital Finance", "Decentralized Finance", "Direct Finance", "Distributed Finance"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "true-false",
      question: "DeFi applications require traditional banks.",
      correctAnswer: "false",
    },
    {
      id: 3,
      type: "multiple-choice",
      question: "What is yield farming in DeFi?",
      options: ["Growing crops", "Earning rewards by providing liquidity", "Mining coins", "Trading stocks"],
      correctAnswer: 1,
    },
    {
      id: 4,
      type: "true-false",
      question: "Smart contracts are essential for DeFi protocols.",
      correctAnswer: "true",
    },
    {
      id: 5,
      type: "multiple-choice",
      question: "What is a liquidity pool?",
      options: ["A swimming pool", "Collection of funds for trading", "Mining equipment", "Wallet type"],
      correctAnswer: 1,
    },
  ],
  "Smart Contracts": [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is a smart contract?",
      options: ["Legal document", "Self-executing contract with code", "Insurance policy", "Bank agreement"],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "true-false",
      question: "Smart contracts can execute automatically without human intervention.",
      correctAnswer: "true",
    },
    {
      id: 3,
      type: "multiple-choice",
      question: "Which programming language is commonly used for Ethereum smart contracts?",
      options: ["JavaScript", "Python", "Solidity", "Java"],
      correctAnswer: 2,
    },
    {
      id: 4,
      type: "true-false",
      question: "Smart contracts are immutable once deployed.",
      correctAnswer: "true",
    },
    {
      id: 5,
      type: "multiple-choice",
      question: "What triggers a smart contract execution?",
      options: ["Time", "Conditions being met", "External calls", "All of the above"],
      correctAnswer: 3,
    },
  ],
}

// Template lessons for each topic
const templateLessons: Record<string, Omit<Lesson, "id" | "topicId" | "createdAt">[]> = {
  "General Info on Blockchain Tech": [
    {
      title: "Introduction to Blockchain",
      description: "Learn the fundamentals of blockchain technology and how it works.",
      duration: "15 min",
      difficulty: "Beginner",
      videoUrl: "https://www.youtube.com/watch?v=bBC-nXj3Ng4",
      prerequisites: [],
      content:
        "This lesson covers the basic concepts of blockchain technology, including decentralization, immutability, and consensus mechanisms.",
      socialLinks: {
        youtube: "https://www.youtube.com/watch?v=bBC-nXj3Ng4",
        discord: "https://discord.gg/blockchain",
      },
      downloads: [
        { id: 1, name: "Blockchain Basics Guide.pdf", size: "2.5 MB", url: "/downloads/blockchain-basics.pdf" },
      ],
      order: 1,
      status: "Published",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop&crop=center",
    },
    {
      title: "How Blockchain Works",
      description: "Deep dive into the technical aspects of blockchain operations.",
      duration: "20 min",
      difficulty: "Intermediate",
      videoUrl: "https://www.youtube.com/watch?v=example2",
      prerequisites: ["Introduction to Blockchain"],
      content: "Understanding blocks, hashing, mining, and the consensus process in detail.",
      socialLinks: {
        youtube: "https://www.youtube.com/watch?v=example2",
      },
      downloads: [{ id: 2, name: "Technical Guide.pdf", size: "3.2 MB", url: "/downloads/technical-guide.pdf" }],
      order: 2,
      status: "Published",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop&crop=center",
    },
    {
      title: "Blockchain Applications",
      description: "Explore real-world applications of blockchain technology.",
      duration: "18 min",
      difficulty: "Intermediate",
      prerequisites: ["How Blockchain Works"],
      content: "Learn about various use cases including supply chain, healthcare, and finance.",
      socialLinks: {},
      downloads: [],
      order: 3,
      status: "Published",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop&crop=center",
    },
  ],
  "Getting Started With Crypto": [
    {
      title: "What is Cryptocurrency?",
      description: "Introduction to digital currencies and their purpose.",
      duration: "12 min",
      difficulty: "Beginner",
      videoUrl: "https://www.youtube.com/watch?v=crypto1",
      prerequisites: [],
      content: "Understanding digital currencies, their benefits, and how they differ from traditional money.",
      socialLinks: {
        youtube: "https://www.youtube.com/watch?v=crypto1",
      },
      downloads: [{ id: 3, name: "Crypto Basics.pdf", size: "1.8 MB", url: "/downloads/crypto-basics.pdf" }],
      order: 1,
      status: "Published",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=225&fit=crop&crop=center",
    },
    {
      title: "Setting Up Your First Wallet",
      description: "Learn how to create and secure your cryptocurrency wallet.",
      duration: "16 min",
      difficulty: "Beginner",
      prerequisites: ["What is Cryptocurrency?"],
      content: "Step-by-step guide to wallet creation, security best practices, and backup procedures.",
      socialLinks: {},
      downloads: [{ id: 4, name: "Wallet Security Guide.pdf", size: "2.1 MB", url: "/downloads/wallet-security.pdf" }],
      order: 2,
      status: "Published",
      image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=225&fit=crop&crop=center",
    },
  ],
  "Using MetaMask": [
    {
      title: "Installing MetaMask",
      description: "How to install and set up MetaMask browser extension.",
      duration: "10 min",
      difficulty: "Beginner",
      videoUrl: "https://www.youtube.com/watch?v=metamask1",
      prerequisites: [],
      content: "Complete installation guide for MetaMask on different browsers.",
      socialLinks: {
        youtube: "https://www.youtube.com/watch?v=metamask1",
      },
      downloads: [{ id: 5, name: "MetaMask Setup Guide.pdf", size: "1.5 MB", url: "/downloads/metamask-setup.pdf" }],
      order: 1,
      status: "Published",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center",
    },
    {
      title: "Using MetaMask Features",
      description: "Explore advanced MetaMask features and settings.",
      duration: "14 min",
      difficulty: "Intermediate",
      prerequisites: ["Installing MetaMask"],
      content: "Learn about network switching, token management, and security features.",
      socialLinks: {},
      downloads: [],
      order: 2,
      status: "Published",
      image: "https://images.unsplash.com/photo-1640352248685-4573f8ced297?w=400&h=225&fit=crop&crop=center",
    },
  ],
  "Decentralised Finance (DeFi)": [
    {
      title: "Introduction to DeFi",
      description: "Understanding decentralized finance and its benefits.",
      duration: "18 min",
      difficulty: "Intermediate",
      prerequisites: [],
      content: "Learn about DeFi protocols, yield farming, and liquidity pools.",
      socialLinks: {},
      downloads: [{ id: 6, name: "DeFi Overview.pdf", size: "3.5 MB", url: "/downloads/defi-overview.pdf" }],
      order: 1,
      status: "Published",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=225&fit=crop&crop=center",
    },
    {
      title: "Yield Farming Strategies",
      description: "Advanced strategies for maximizing DeFi yields.",
      duration: "25 min",
      difficulty: "Advanced",
      prerequisites: ["Introduction to DeFi"],
      content: "Complex yield farming techniques and risk management.",
      socialLinks: {},
      downloads: [],
      order: 2,
      status: "Published",
      image: "https://images.unsplash.com/photo-1627118392839-b46a15ad71bb?w=400&h=225&fit=crop&crop=center",
    },
  ],
  "Non-Fungible Tokens (NFTs)": [
    {
      title: "What are NFTs?",
      description: "Introduction to non-fungible tokens and their use cases.",
      duration: "14 min",
      difficulty: "Beginner",
      prerequisites: [],
      content: "Understanding NFT technology, marketplaces, and applications.",
      socialLinks: {},
      downloads: [{ id: 7, name: "NFT Guide.pdf", size: "2.8 MB", url: "/downloads/nft-guide.pdf" }],
      order: 1,
      status: "Published",
      image: "https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=400&h=225&fit=crop&crop=center",
    },
  ],
}

// Initial data
const initialTopics: Topic[] = [
  {
    id: 1,
    title: "General Info on Blockchain Tech",
    category: "Basics",
    status: "Published",
    students: 0, // Will be calculated dynamically
    lessons: 3,
    createdAt: "2023-01-15",
    hasAssessment: true,
    difficulty: "Beginner",
    description: "Learn the fundamentals of blockchain technology, including how it works, its key features like decentralization and immutability, and explore various real-world applications across different industries.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop&crop=center",
  },
  {
    id: 2,
    title: "Getting Started With Crypto",
    category: "Basics",
    status: "Published",
    students: 0, // Will be calculated dynamically
    lessons: 2,
    createdAt: "2023-02-20",
    hasAssessment: true,
    difficulty: "Beginner",
    description: "Introduction to cryptocurrency basics, understanding digital currencies, and learning how to create and secure your first cryptocurrency wallet with best practices.",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=225&fit=crop&crop=center",
  },
  {
    id: 3,
    title: "Using MetaMask",
    category: "Wallets",
    status: "Published",
    students: 0, // Will be calculated dynamically
    lessons: 2,
    createdAt: "2023-03-10",
    hasAssessment: true,
    difficulty: "Beginner",
    description: "Complete guide to installing, setting up, and using MetaMask browser extension. Learn about network switching, token management, and advanced security features.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center",
  },
  {
    id: 4,
    title: "Decentralised Finance (DeFi)",
    category: "DeFi",
    status: "Published",
    students: 0, // Will be calculated dynamically
    lessons: 2,
    createdAt: "2023-01-25",
    hasAssessment: true,
    difficulty: "Intermediate",
    description: "Explore decentralized finance protocols, yield farming strategies, liquidity pools, and learn advanced techniques for maximizing DeFi yields while managing risks.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=225&fit=crop&crop=center",
  },
  {
    id: 5,
    title: "Non-Fungible Tokens (NFTs)",
    category: "NFTs",
    status: "Published",
    students: 0, // Will be calculated dynamically
    lessons: 1,
    createdAt: "2023-02-15",
    hasAssessment: false,
    difficulty: "Beginner",
    description: "Understanding non-fungible tokens (NFTs), their technology, use cases, marketplaces, and applications in digital art, gaming, and various other industries.",
    image: "https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=400&h=225&fit=crop&crop=center",
  },
]

// Generate initial assessments with proper questions
const generateInitialAssessments = (): Assessment[] => {
  return [
    {
      id: 1,
      topicId: 1,
      totalQuestions: 10,
      timeLimit: "01:00",
      retakePeriod: "3",
      cooldownPeriod: 6, // 6 hours default
      questions: templateQuestions["General Info on Blockchain Tech"] || [],
      createdAt: "2023-01-16",
    },
    {
      id: 2,
      topicId: 2,
      totalQuestions: 8,
      timeLimit: "00:45",
      retakePeriod: "3",
      cooldownPeriod: 6, // 6 hours default
      questions: templateQuestions["Getting Started With Crypto"] || [],
      createdAt: "2023-02-21",
    },
    {
      id: 3,
      topicId: 3,
      totalQuestions: 5,
      timeLimit: "00:30",
      retakePeriod: "3",
      cooldownPeriod: 6, // 6 hours default
      questions: templateQuestions["Using MetaMask"] || [],
      createdAt: "2023-03-11",
    },
    {
      id: 4,
      topicId: 4,
      totalQuestions: 5,
      timeLimit: "00:45",
      retakePeriod: "3",
      cooldownPeriod: 6, // 6 hours default
      questions: templateQuestions["Decentralised Finance (DeFi)"] || [],
      createdAt: "2023-01-26",
    },
  ]
}

const initialUsers: User[] = [
  {
    id: "1",
    username: "john.smith",
    email: "john.smith@gmail.com",
    role: "admin",
    firstName: "John",
    lastName: "Smith",
    joinedDate: "01/01/22",
    completedTopics: 0,
    totalTopics: 0,
    weeklyHours: 0,
    thisWeekHours: 0,
  },
  {
    id: "2",
    username: "jessica.jones",
    email: "jessica.jones@gmail.com",
    role: "admin",
    firstName: "Jessica",
    lastName: "Jones",
    joinedDate: "02/15/22",
    completedTopics: 0,
    totalTopics: 0,
    weeklyHours: 0,
    thisWeekHours: 0,
  },
  {
    id: "3",
    username: "ron.burgandi",
    email: "ron.burgandi@gmail.com",
    role: "admin",
    firstName: "Ron",
    lastName: "Burgandi",
    joinedDate: "03/10/22",
    completedTopics: 0,
    totalTopics: 0,
    weeklyHours: 0,
    thisWeekHours: 0,
  },
  {
    id: "4",
    username: "john.john",
    email: "johnjohn@gmail.com",
    role: "admin",
    firstName: "John",
    lastName: "John",
    joinedDate: "04/05/22",
    completedTopics: 0,
    totalTopics: 0,
    weeklyHours: 0,
    thisWeekHours: 0,
  },
  {
    id: "5",
    username: "mary.magdaleine",
    email: "mary.m@yahoo.com",
    role: "admin",
    firstName: "Mary",
    lastName: "Magdaleine",
    joinedDate: "05/20/22",
    completedTopics: 0,
    totalTopics: 0,
    weeklyHours: 0,
    thisWeekHours: 0,
  },
  {
    id: "6",
    username: "sergent.pepper",
    email: "sergentpg@gmail.com",
    role: "student",
    firstName: "Sergent",
    lastName: "Pepper",
    joinedDate: "06/12/22",
    completedTopics: 5,
    totalTopics: 12,
    weeklyHours: 25,
    thisWeekHours: 15,
  },
  // Additional 15 student accounts
  {
    id: "7",
    username: "alice.chen",
    email: "alice.chen@gmail.com",
    role: "student",
    firstName: "Alice",
    lastName: "Chen",
    joinedDate: "09/15/23",
    completedTopics: 3,
    totalTopics: 5,
    weeklyHours: 20,
    thisWeekHours: 12,
  },
  {
    id: "8",
    username: "david.rodriguez",
    email: "david.rodriguez@yahoo.com",
    role: "student",
    firstName: "David",
    lastName: "Rodriguez",
    joinedDate: "11/20/23",
    completedTopics: 2,
    totalTopics: 5,
    weeklyHours: 15,
    thisWeekHours: 8,
  },
  {
    id: "9",
    username: "sarah.williams",
    email: "sarah.williams@outlook.com",
    role: "student",
    firstName: "Sarah",
    lastName: "Williams",
    joinedDate: "08/10/23",
    completedTopics: 4,
    totalTopics: 5,
    weeklyHours: 18,
    thisWeekHours: 14,
  },
  {
    id: "10",
    username: "michael.thompson",
    email: "m.thompson@gmail.com",
    role: "student",
    firstName: "Michael",
    lastName: "Thompson",
    joinedDate: "12/05/23",
    completedTopics: 1,
    totalTopics: 5,
    weeklyHours: 12,
    thisWeekHours: 6,
  },
  {
    id: "11",
    username: "emma.davis",
    email: "emma.davis@gmail.com",
    role: "student",
    firstName: "Emma",
    lastName: "Davis",
    joinedDate: "10/18/23",
    completedTopics: 5,
    totalTopics: 5,
    weeklyHours: 22,
    thisWeekHours: 18,
  },
  {
    id: "12",
    username: "james.wilson",
    email: "james.wilson@hotmail.com",
    role: "student",
    firstName: "James",
    lastName: "Wilson",
    joinedDate: "07/22/23",
    completedTopics: 0,
    totalTopics: 5,
    weeklyHours: 8,
    thisWeekHours: 0,
  },
  {
    id: "13",
    username: "olivia.taylor",
    email: "olivia.taylor@gmail.com",
    role: "student",
    firstName: "Olivia",
    lastName: "Taylor",
    joinedDate: "01/14/24",
    completedTopics: 2,
    totalTopics: 5,
    weeklyHours: 16,
    thisWeekHours: 10,
  },
  {
    id: "14",
    username: "lucas.anderson",
    email: "lucas.anderson@yahoo.com",
    role: "student",
    firstName: "Lucas",
    lastName: "Anderson",
    joinedDate: "03/08/23",
    completedTopics: 3,
    totalTopics: 5,
    weeklyHours: 14,
    thisWeekHours: 9,
  },
  {
    id: "15",
    username: "sophia.martinez",
    email: "sophia.martinez@gmail.com",
    role: "student",
    firstName: "Sophia",
    lastName: "Martinez",
    joinedDate: "06/30/23",
    completedTopics: 4,
    totalTopics: 5,
    weeklyHours: 25,
    thisWeekHours: 16,
  },
  {
    id: "16",
    username: "noah.garcia",
    email: "noah.garcia@outlook.com",
    role: "student",
    firstName: "Noah",
    lastName: "Garcia",
    joinedDate: "02/12/24",
    completedTopics: 1,
    totalTopics: 5,
    weeklyHours: 10,
    thisWeekHours: 4,
  },
  {
    id: "17",
    username: "ava.johnson",
    email: "ava.johnson@gmail.com",
    role: "student",
    firstName: "Ava",
    lastName: "Johnson",
    joinedDate: "05/16/23",
    completedTopics: 3,
    totalTopics: 5,
    weeklyHours: 19,
    thisWeekHours: 13,
  },
  {
    id: "18",
    username: "william.brown",
    email: "william.brown@yahoo.com",
    role: "student",
    firstName: "William",
    lastName: "Brown",
    joinedDate: "04/25/23",
    completedTopics: 2,
    totalTopics: 5,
    weeklyHours: 17,
    thisWeekHours: 11,
  },
  {
    id: "19",
    username: "isabella.lee",
    email: "isabella.lee@gmail.com",
    role: "student",
    firstName: "Isabella",
    lastName: "Lee",
    joinedDate: "09/03/23",
    completedTopics: 5,
    totalTopics: 5,
    weeklyHours: 28,
    thisWeekHours: 20,
  },
  {
    id: "20",
    username: "ethan.white",
    email: "ethan.white@hotmail.com",
    role: "student",
    firstName: "Ethan",
    lastName: "White",
    joinedDate: "11/07/23",
    completedTopics: 1,
    totalTopics: 5,
    weeklyHours: 9,
    thisWeekHours: 3,
  },
  {
    id: "21",
    username: "mia.clark",
    email: "mia.clark@gmail.com",
    role: "student",
    firstName: "Mia",
    lastName: "Clark",
    joinedDate: "12/20/23",
    completedTopics: 2,
    totalTopics: 5,
    weeklyHours: 13,
    thisWeekHours: 7,
  },
]

// Data store class
class DataStore {
  private topics: Topic[] = []
  private assessments: Assessment[] = []
  private users: User[] = []
  private lessons: Lesson[] = []
  private lessonCompletions: LessonCompletion[] = []
  private lessonViews: LessonView[] = []
  private assessmentAttempts: AssessmentAttempt[] = []
  private communityPosts: CommunityPost[] = []
  private communityReplies: CommunityReply[] = []
  private listeners: (() => void)[] = []
  private idCounter: number = 1

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage()
      this.generateSampleData()
    }
  }

  private loadFromStorage() {
    const storedTopics = localStorage.getItem("lms-topics")
    const storedAssessments = localStorage.getItem("lms-assessments")
    const storedUsers = localStorage.getItem("lms-users")
    const storedLessons = localStorage.getItem("lms-lessons")
    const storedCompletions = localStorage.getItem("lms-lesson-completions")
    const storedViews = localStorage.getItem("lms-lesson-views")
    const storedAttempts = localStorage.getItem("lms-assessment-attempts")
    const storedPosts = localStorage.getItem("lms-community-posts")
    const storedReplies = localStorage.getItem("lms-community-replies")

    this.topics = storedTopics ? JSON.parse(storedTopics) : initialTopics
    this.assessments = storedAssessments ? JSON.parse(storedAssessments) : generateInitialAssessments()
    this.users = storedUsers ? JSON.parse(storedUsers) : initialUsers
    this.lessons = storedLessons ? JSON.parse(storedLessons) : this.generateInitialLessons()
    this.lessonCompletions = storedCompletions ? JSON.parse(storedCompletions) : []
    this.lessonViews = storedViews ? JSON.parse(storedViews) : []
    this.assessmentAttempts = storedAttempts ? JSON.parse(storedAttempts) : []
    this.communityPosts = storedPosts ? JSON.parse(storedPosts) : this.generateInitialCommunityPosts()
    this.communityReplies = storedReplies ? JSON.parse(storedReplies) : this.generateInitialCommunityReplies()

    // Update topics with current lesson counts and assessment status
    this.updateTopicsMetadata()
  }

  private generateSampleData() {
    // Only generate sample data if there are no existing views/completions
    if (this.lessonViews.length === 0 && this.lessonCompletions.length === 0) {
      this.generateSampleViewsAndCompletions()
    }
  }

  private generateSampleViewsAndCompletions() {
    const students = this.users.filter(u => u.role === 'student')
    const lessons = this.lessons
    
    if (students.length === 0 || lessons.length === 0) return

    // Generate sample views (80% of students view 60% of lessons)
    const sampleViews: LessonView[] = []
    const sampleCompletions: LessonCompletion[] = []
    
    students.forEach(student => {
      // Each student views 60-80% of lessons
      const viewCount = Math.floor(lessons.length * (0.6 + Math.random() * 0.2))
      const lessonsToView = lessons.slice(0, viewCount)
      
      lessonsToView.forEach(lesson => {
        // Generate multiple views over time (simulate multiple sessions)
        const viewSessions = Math.floor(Math.random() * 3) + 1
        
        for (let i = 0; i < viewSessions; i++) {
          const viewId = `${student.id}-${lesson.id}-${Date.now()}-${i}`
          const daysAgo = Math.floor(Math.random() * 30)
          const viewDate = new Date()
          viewDate.setDate(viewDate.getDate() - daysAgo)
          
          sampleViews.push({
            id: viewId,
            userId: student.id,
            lessonId: lesson.id,
            topicId: lesson.topicId,
            viewedAt: viewDate.toISOString(),
            duration: Math.floor(Math.random() * 30) + 10 // 10-40 minutes
          })
        }
        
        // 70% chance of completion if viewed
        if (Math.random() < 0.7) {
          const completionId = `${student.id}-${lesson.id}-${Date.now()}`
          const daysAgo = Math.floor(Math.random() * 25)
          const completionDate = new Date()
          completionDate.setDate(completionDate.getDate() - daysAgo)
          
          sampleCompletions.push({
            id: completionId,
            userId: student.id,
            lessonId: lesson.id,
            topicId: lesson.topicId,
            completedAt: completionDate.toISOString(),
            timeSpent: Math.floor(Math.random() * 45) + 15 // 15-60 minutes
          })
        }
      })
    })
    
    // Add the sample data
    this.lessonViews = sampleViews
    this.lessonCompletions = sampleCompletions
    
    // Update topic metadata with new data
    this.updateTopicsMetadata()
    
    // Save to storage
    this.saveToStorage()
  }

  private generateInitialLessons(): Lesson[] {
    const lessons: Lesson[] = []
    let lessonId = 1
    // Use a fixed date for initial lessons to prevent hydration mismatch
    const fixedDate = "2024-01-01"

    this.topics.forEach((topic) => {
      const topicTemplates = templateLessons[topic.title] || []
      topicTemplates.forEach((template) => {
        lessons.push({
          ...template,
          id: lessonId++,
          topicId: topic.id,
          createdAt: fixedDate,
        })
      })
    })

    return lessons
  }

  private generateInitialCommunityPosts(): CommunityPost[] {
    const fixedDate = "2024-01-01"
    return [
      {
        id: "1",
        title: "Best practices for NFT smart contracts?",
        content: "I'm working on my first NFT project and want to make sure I'm following the best practices. What are some key things to consider when writing smart contracts for NFTs?",
        authorId: "student1",
        authorName: "Alex Chen",
        category: "Smart Contracts",
        tags: ["NFT", "smart-contracts", "best-practices"],
        createdAt: fixedDate,
        updatedAt: fixedDate,
        views: 45,
        likes: 24,
        isAnswered: true,
        isPinned: false,
        status: "active" as const,
        replyCount: 12
      },
      {
        id: "2",
        title: "How to optimize gas fees in DeFi transactions",
        content: "Gas fees have been really high lately. Are there any strategies or tools you recommend for optimizing gas usage in DeFi transactions?",
        authorId: "student2",
        authorName: "Sarah Johnson",
        category: "DeFi",
        tags: ["gas-optimization", "defi", "ethereum"],
        createdAt: fixedDate,
        updatedAt: fixedDate,
        views: 32,
        likes: 15,
        isAnswered: false,
        isPinned: false,
        status: "active" as const,
        replyCount: 8
      },
      {
        id: "3",
        title: "Understanding Layer 2 solutions",
        content: "Can someone explain the different Layer 2 solutions and their trade-offs? I'm trying to decide which one to use for my project.",
        authorId: "student1",
        authorName: "Mike Rodriguez",
        category: "Blockchain",
        tags: ["layer2", "scaling", "ethereum"],
        createdAt: fixedDate,
        updatedAt: fixedDate,
        views: 68,
        likes: 32,
        isAnswered: true,
        isPinned: true,
        status: "active" as const,
        replyCount: 18
      }
    ]
  }

  private generateInitialCommunityReplies(): CommunityReply[] {
    const fixedDate = "2024-01-01"
    return [
      {
        id: "1",
        postId: "1",
        authorId: "admin1",
        authorName: "Expert Admin",
        content: "Great question! Here are some key best practices: 1) Use OpenZeppelin's contracts as a base, 2) Implement proper access controls, 3) Add metadata standards like ERC-721, 4) Test thoroughly on testnets first.",
        createdAt: fixedDate,
        updatedAt: fixedDate,
        likes: 15,
        isAcceptedAnswer: true
      },
      {
        id: "2",
        postId: "2",
        authorId: "student3",
        authorName: "Emma Davis",
        content: "I've been using 1inch for gas optimization. Their API helps find the most efficient routes for swaps.",
        createdAt: fixedDate,
        updatedAt: fixedDate,
        likes: 8,
        isAcceptedAnswer: false
      }
    ]
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("lms-topics", JSON.stringify(this.topics))
      localStorage.setItem("lms-assessments", JSON.stringify(this.assessments))
      localStorage.setItem("lms-users", JSON.stringify(this.users))
      localStorage.setItem("lms-lessons", JSON.stringify(this.lessons))
      localStorage.setItem("lms-lesson-completions", JSON.stringify(this.lessonCompletions))
      localStorage.setItem("lms-lesson-views", JSON.stringify(this.lessonViews))
      localStorage.setItem("lms-assessment-attempts", JSON.stringify(this.assessmentAttempts))
      localStorage.setItem("lms-community-posts", JSON.stringify(this.communityPosts))
      localStorage.setItem("lms-community-replies", JSON.stringify(this.communityReplies))
    }
  }

  private updateTopicsMetadata() {
    this.topics = this.topics.map((topic) => ({
      ...topic,
      hasAssessment: this.assessments.some((assessment) => assessment.topicId === topic.id),
      lessons: this.lessons.filter((lesson) => lesson.topicId === topic.id).length,
      students: this.getTopicStudentCount(topic.id),
    }))
  }

  // Calculate actual student count for a topic based on user activity
  getTopicStudentCount(topicId: number): number {
    const studentUsers = this.users.filter(user => user.role === 'student')
    
    // Count unique students who have engaged with this topic
    const enrolledStudents = new Set<string>()
    
    // Students who have viewed any lesson in this topic
    this.lessonViews.forEach(view => {
      if (view.topicId === topicId && studentUsers.some(user => user.id === view.userId)) {
        enrolledStudents.add(view.userId)
      }
    })
    
    // Students who have completed any lesson in this topic
    this.lessonCompletions.forEach(completion => {
      if (completion.topicId === topicId && studentUsers.some(user => user.id === completion.userId)) {
        enrolledStudents.add(completion.userId)
      }
    })
    
    // Students who have attempted any assessment for this topic
    this.assessmentAttempts.forEach(attempt => {
      if (attempt.topicId === topicId && studentUsers.some(user => user.id === attempt.userId)) {
        enrolledStudents.add(attempt.userId)
      }
    })
    
    return enrolledStudents.size
  }

  // Get detailed student enrollment breakdown for a topic (for admin analytics)
  getTopicStudentDetails(topicId: number): {
    totalStudents: number
    studentsWithViews: number
    studentsWithCompletions: number
    studentsWithAssessments: number
    studentsList: {
      id: string
      name: string
      hasViewed: boolean
      hasCompleted: boolean
      hasAttemptedAssessment: boolean
    }[]
  } {
    const studentUsers = this.users.filter(user => user.role === 'student')
    const enrolledStudents = new Set<string>()
    
    // Collect all students who have engaged with this topic
    const studentsWithViews = new Set<string>()
    const studentsWithCompletions = new Set<string>()
    const studentsWithAssessments = new Set<string>()
    
    this.lessonViews.forEach(view => {
      if (view.topicId === topicId && studentUsers.some(user => user.id === view.userId)) {
        enrolledStudents.add(view.userId)
        studentsWithViews.add(view.userId)
      }
    })
    
    this.lessonCompletions.forEach(completion => {
      if (completion.topicId === topicId && studentUsers.some(user => user.id === completion.userId)) {
        enrolledStudents.add(completion.userId)
        studentsWithCompletions.add(completion.userId)
      }
    })
    
    this.assessmentAttempts.forEach(attempt => {
      if (attempt.topicId === topicId && studentUsers.some(user => user.id === attempt.userId)) {
        enrolledStudents.add(attempt.userId)
        studentsWithAssessments.add(attempt.userId)
      }
    })
    
    // Create detailed list
    const studentsList = Array.from(enrolledStudents).map(userId => {
      const user = studentUsers.find(u => u.id === userId)
      return {
        id: userId,
        name: user ? `${user.firstName} ${user.lastName}` : 'Unknown User',
        hasViewed: studentsWithViews.has(userId),
        hasCompleted: studentsWithCompletions.has(userId),
        hasAttemptedAssessment: studentsWithAssessments.has(userId)
      }
    })
    
    return {
      totalStudents: enrolledStudents.size,
      studentsWithViews: studentsWithViews.size,
      studentsWithCompletions: studentsWithCompletions.size,
      studentsWithAssessments: studentsWithAssessments.size,
      studentsList
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  // Topic methods
  getTopics(): Topic[] {
    return this.topics
  }

  addTopic(topic: Omit<Topic, "id">): Topic {
    const newTopic: Topic = {
      ...topic,
      id: Math.max(0, ...this.topics.map((t) => t.id)) + 1,
    }
    this.topics.push(newTopic)
    this.updateTopicsMetadata()
    this.saveToStorage()
    this.notifyListeners()
    return newTopic
  }

  updateTopic(id: number, updates: Partial<Topic>): void {
    this.topics = this.topics.map((topic) => (topic.id === id ? { ...topic, ...updates } : topic))
    this.updateTopicsMetadata()
    this.saveToStorage()
    this.notifyListeners()
  }

  deleteTopic(id: number): void {
    this.topics = this.topics.filter((topic) => topic.id !== id)
    // Also delete associated assessments, lessons, completions, and views
    this.assessments = this.assessments.filter((assessment) => assessment.topicId !== id)
    this.lessons = this.lessons.filter((lesson) => lesson.topicId !== id)
    this.lessonCompletions = this.lessonCompletions.filter((completion) => completion.topicId !== id)
    this.lessonViews = this.lessonViews.filter((view) => view.topicId !== id)
    this.updateTopicsMetadata()
    this.saveToStorage()
    this.notifyListeners()
  }

  getTopicById(id: number): Topic | undefined {
    return this.topics.find((topic) => topic.id === id)
  }

  // Assessment methods
  getAssessments(): Assessment[] {
    return this.assessments
  }

  addAssessment(assessment: Omit<Assessment, "id">): Assessment {
    const newAssessment: Assessment = {
      ...assessment,
      id: Math.max(0, ...this.assessments.map((a) => a.id)) + 1,
    }
    this.assessments.push(newAssessment)
    this.updateTopicsMetadata()
    this.saveToStorage()
    this.notifyListeners()
    return newAssessment
  }

  updateAssessment(id: number, updates: Partial<Assessment>): void {
    this.assessments = this.assessments.map((assessment) =>
      assessment.id === id ? { ...assessment, ...updates } : assessment,
    )
    this.updateTopicsMetadata()
    this.saveToStorage()
    this.notifyListeners()
  }

  deleteAssessment(topicId: number): void {
    this.assessments = this.assessments.filter((assessment) => assessment.topicId !== topicId)
    this.updateTopicsMetadata()
    this.saveToStorage()
    this.notifyListeners()
  }

  getAssessmentByTopicId(topicId: number): Assessment | undefined {
    return this.assessments.find((assessment) => assessment.topicId === topicId)
  }

  // User methods
  getUsers(): User[] {
    return this.users
  }

  addUser(user: Omit<User, "id">): User {
    const newUser: User = {
      ...user,
      id: (Math.max(0, ...this.users.map((u) => Number.parseInt(u.id))) + 1).toString(),
    }
    this.users.push(newUser)
    this.saveToStorage()
    this.notifyListeners()
    return newUser
  }

  updateUser(id: string, updates: Partial<User>): void {
    this.users = this.users.map((user) => (user.id === id ? { ...user, ...updates } : user))
    this.saveToStorage()
    this.notifyListeners()
  }

  deleteUser(id: string): void {
    this.users = this.users.filter((user) => user.id !== id)
    this.saveToStorage()
    this.notifyListeners()
  }

  // Lesson methods
  getLessons(): Lesson[] {
    return this.lessons
  }

  getLessonsByTopicId(topicId: number): Lesson[] {
    return this.lessons.filter((lesson) => lesson.topicId === topicId).sort((a, b) => a.order - b.order)
  }

  getLessonById(id: number): Lesson | undefined {
    return this.lessons.find((lesson) => lesson.id === id)
  }

  addLesson(lesson: Omit<Lesson, "id">): Lesson {
    const newLesson: Lesson = {
      ...lesson,
      id: Math.max(0, ...this.lessons.map((l) => l.id)) + 1,
    }
    this.lessons.push(newLesson)
    this.updateTopicsMetadata()
    this.saveToStorage()
    this.notifyListeners()
    return newLesson
  }

  updateLesson(id: number, updates: Partial<Lesson>): void {
    this.lessons = this.lessons.map((lesson) => (lesson.id === id ? { ...lesson, ...updates } : lesson))
    this.updateTopicsMetadata()
    this.saveToStorage()
    this.notifyListeners()
  }

  deleteLesson(id: number): void {
    this.lessons = this.lessons.filter((lesson) => lesson.id !== id)
    // Also delete associated completions and views
    this.lessonCompletions = this.lessonCompletions.filter((completion) => completion.lessonId !== id)
    this.lessonViews = this.lessonViews.filter((view) => view.lessonId !== id)
    this.updateTopicsMetadata()
    this.saveToStorage()
    this.notifyListeners()
  }

  // Lesson completion methods
  getLessonCompletions(): LessonCompletion[] {
    return this.lessonCompletions
  }

  getUserLessonCompletions(userId: string): LessonCompletion[] {
    return this.lessonCompletions.filter((completion) => completion.userId === userId)
  }

  getTopicCompletions(userId: string, topicId: number): LessonCompletion[] {
    return this.lessonCompletions.filter((completion) => completion.userId === userId && completion.topicId === topicId)
  }

  isLessonCompleted(userId: string, lessonId: number): boolean {
    return this.lessonCompletions.some((completion) => completion.userId === userId && completion.lessonId === lessonId)
  }

  markLessonComplete(userId: string, lessonId: number, timeSpent?: number): void {
    const lesson = this.getLessonById(lessonId)
    if (!lesson) return

    // Check if already completed
    const existingCompletion = this.lessonCompletions.find(
      (completion) => completion.userId === userId && completion.lessonId === lessonId,
    )

    if (!existingCompletion) {
      // Generate a more deterministic ID
      const completionId = `${userId}-${lessonId}-${this.idCounter++}`
      const newCompletion: LessonCompletion = {
        id: completionId,
        userId,
        lessonId,
        topicId: lesson.topicId,
        completedAt: new Date().toISOString(),
        timeSpent,
      }
      this.lessonCompletions.push(newCompletion)
      this.updateTopicsMetadata() // Update student counts
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  markLessonIncomplete(userId: string, lessonId: number): void {
    this.lessonCompletions = this.lessonCompletions.filter(
      (completion) => !(completion.userId === userId && completion.lessonId === lessonId),
    )
    this.saveToStorage()
    this.notifyListeners()
  }

  // Lesson view methods
  getLessonViews(): LessonView[] {
    return this.lessonViews
  }

  getUserLessonViews(userId: string): LessonView[] {
    return this.lessonViews.filter((view) => view.userId === userId)
  }

  getLessonViewsByLessonId(lessonId: number): LessonView[] {
    return this.lessonViews.filter((view) => view.lessonId === lessonId)
  }

  trackLessonView(userId: string, lessonId: number, duration?: number): void {
    const lesson = this.getLessonById(lessonId)
    if (!lesson) return

    // Check if already viewed today
    const today = new Date().toDateString()
    const existingView = this.lessonViews.find(
      (view) => view.userId === userId && view.lessonId === lessonId && 
      new Date(view.viewedAt).toDateString() === today
    )

    if (!existingView) {
      // Create new view record
      const viewId = `${userId}-${lessonId}-${Date.now()}`
      const newView: LessonView = {
        id: viewId,
        userId,
        lessonId,
        topicId: lesson.topicId,
        viewedAt: new Date().toISOString(),
        duration,
      }
      this.lessonViews.push(newView)
      this.updateTopicsMetadata() // Update student counts
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  getTopicProgress(userId: string, topicId: number): { completed: number; total: number; percentage: number } {
    const topicLessons = this.getLessonsByTopicId(topicId)
    const completedLessons = this.getTopicCompletions(userId, topicId)

    const total = topicLessons.length
    const completed = completedLessons.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { completed, total, percentage }
  }

  // Template question generator
  generateTemplateQuestions(topicTitle: string, count: number): Question[] {
    const availableQuestions = templateQuestions[topicTitle] || []

    if (availableQuestions.length === 0) {
      // Generate default questions if no template exists
      return [
        {
          id: 1,
          type: "true-false" as const,
          question: `This topic covers important concepts about ${topicTitle}.`,
          correctAnswer: "true",
        },
        {
          id: 2,
          type: "multiple-choice" as const,
          question: `What is the main focus of ${topicTitle}?`,
          options: ["Basic concepts", "Advanced techniques", "Practical applications", "All of the above"],
          correctAnswer: 3,
        },
      ].slice(0, count)
    }

    // Return the requested number of questions
    const selectedQuestions = availableQuestions.slice(0, count)

    // If we need more questions than available, repeat some
    while (selectedQuestions.length < count && availableQuestions.length > 0) {
      const remaining = count - selectedQuestions.length
      const additionalQuestions = availableQuestions.slice(0, remaining).map((q, index) => ({
        ...q,
        id: selectedQuestions.length + index + 1,
      }))
      selectedQuestions.push(...additionalQuestions)
    }

    return selectedQuestions
  }

  // Assessment attempt methods
  getAssessmentAttempts(): AssessmentAttempt[] {
    return this.assessmentAttempts
  }

  getUserAssessmentAttempts(userId: string): AssessmentAttempt[] {
    return this.assessmentAttempts.filter((attempt) => attempt.userId === userId)
  }

  getTopicAssessmentAttempts(userId: string, topicId: number): AssessmentAttempt[] {
    return this.assessmentAttempts.filter((attempt) => attempt.userId === userId && attempt.topicId === topicId)
  }

  getLastAssessmentAttempt(userId: string, assessmentId: number): AssessmentAttempt | undefined {
    const attempts = this.assessmentAttempts
      .filter((attempt) => attempt.userId === userId && attempt.assessmentId === assessmentId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    return attempts[0]
  }

  canTakeAssessment(userId: string, assessmentId: number): { canTake: boolean; timeRemaining?: number; message?: string } {
    const assessment = this.assessments.find((a) => a.id === assessmentId)
    if (!assessment) {
      return { canTake: false, message: "Assessment not found" }
    }

    const lastAttempt = this.getLastAssessmentAttempt(userId, assessmentId)
    if (!lastAttempt) {
      return { canTake: true, message: "No previous attempts" }
    }

    const lastAttemptTime = new Date(lastAttempt.completedAt).getTime()
    const now = new Date().getTime()
    const cooldownMs = assessment.cooldownPeriod * 60 * 60 * 1000 // Convert hours to milliseconds
    const timeSinceLastAttempt = now - lastAttemptTime
    const timeRemaining = cooldownMs - timeSinceLastAttempt

    if (timeRemaining <= 0) {
      return { canTake: true, message: "Cooldown period completed" }
    }

    return {
      canTake: false,
      timeRemaining: Math.ceil(timeRemaining / (60 * 1000)), // Return in minutes
      message: `Must wait ${this.formatCooldownTime(timeRemaining)} before retaking`
    }
  }

  private formatCooldownTime(timeMs: number): string {
    const hours = Math.floor(timeMs / (60 * 60 * 1000))
    const minutes = Math.floor((timeMs % (60 * 60 * 1000)) / (60 * 1000))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  addAssessmentAttempt(attempt: Omit<AssessmentAttempt, "id">): AssessmentAttempt {
    const newAttempt: AssessmentAttempt = {
      ...attempt,
      id: (Math.max(0, ...this.assessmentAttempts.map((a) => Number.parseInt(a.id))) + 1).toString(),
    }
    this.assessmentAttempts.push(newAttempt)
    this.updateTopicsMetadata() // Update student counts
    this.saveToStorage()
    this.notifyListeners()
    return newAttempt
  }

  updateAssessmentCooldown(assessmentId: number, cooldownHours: number): void {
    if (cooldownHours < 1 || cooldownHours > 168) {
      throw new Error("Cooldown period must be between 1 hour and 168 hours (7 days)")
    }
    
    const assessment = this.assessments.find((a) => a.id === assessmentId)
    if (assessment) {
      assessment.cooldownPeriod = cooldownHours
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  formatCooldownPeriod(hours: number): string {
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'}`
    }
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    if (remainingHours === 0) {
      return `${days} day${days === 1 ? '' : 's'}`
    }
    return `${days} day${days === 1 ? '' : 's'} ${remainingHours} hour${remainingHours === 1 ? '' : 's'}`
  }

  // Community Posts methods
  getCommunityPosts(): CommunityPost[] {
    return this.communityPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  getCommunityPostById(id: string): CommunityPost | undefined {
    return this.communityPosts.find(post => post.id === id)
  }

  addCommunityPost(post: Omit<CommunityPost, "id" | "createdAt" | "updatedAt" | "views" | "likes" | "replyCount">): CommunityPost {
    const newPost: CommunityPost = {
      ...post,
      id: (Math.max(0, ...this.communityPosts.map(p => parseInt(p.id))) + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      replyCount: 0
    }
    this.communityPosts.push(newPost)
    this.saveToStorage()
    this.notifyListeners()
    return newPost
  }

  updateCommunityPost(id: string, updates: Partial<CommunityPost>): void {
    this.communityPosts = this.communityPosts.map(post => 
      post.id === id ? { ...post, ...updates, updatedAt: new Date().toISOString() } : post
    )
    this.saveToStorage()
    this.notifyListeners()
  }

  deleteCommunityPost(id: string): void {
    this.communityPosts = this.communityPosts.filter(post => post.id !== id)
    this.communityReplies = this.communityReplies.filter(reply => reply.postId !== id)
    this.saveToStorage()
    this.notifyListeners()
  }

  incrementPostViews(id: string): void {
    const post = this.communityPosts.find(p => p.id === id)
    if (post) {
      post.views += 1
      this.saveToStorage()
    }
  }

  togglePostLike(postId: string, userId: string): void {
    const post = this.communityPosts.find(p => p.id === postId)
    if (post) {
      // Simple like tracking - in a real app you'd track individual user likes properly
      const storageKey = `post_likes_${postId}`
      const userLikes = JSON.parse(localStorage.getItem(storageKey) || '[]')
      const hasLiked = userLikes.includes(userId)
      
      if (hasLiked) {
        post.likes = Math.max(0, post.likes - 1)
        const updatedLikes = userLikes.filter((id: string) => id !== userId)
        localStorage.setItem(storageKey, JSON.stringify(updatedLikes))
      } else {
        post.likes += 1
        userLikes.push(userId)
        localStorage.setItem(storageKey, JSON.stringify(userLikes))
      }
      
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  hasUserLikedPost(postId: string, userId: string): boolean {
    const storageKey = `post_likes_${postId}`
    const userLikes = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return userLikes.includes(userId)
  }

  toggleReplyLike(replyId: string, userId: string): void {
    const reply = this.communityReplies.find(r => r.id === replyId)
    if (reply) {
      const storageKey = `reply_likes_${replyId}`
      const userLikes = JSON.parse(localStorage.getItem(storageKey) || '[]')
      const hasLiked = userLikes.includes(userId)
      
      if (hasLiked) {
        reply.likes = Math.max(0, reply.likes - 1)
        const updatedLikes = userLikes.filter((id: string) => id !== userId)
        localStorage.setItem(storageKey, JSON.stringify(updatedLikes))
      } else {
        reply.likes += 1
        userLikes.push(userId)
        localStorage.setItem(storageKey, JSON.stringify(userLikes))
      }
      
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  hasUserLikedReply(replyId: string, userId: string): boolean {
    const storageKey = `reply_likes_${replyId}`
    const userLikes = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return userLikes.includes(userId)
  }

  // Community Replies methods
  getCommunityReplies(): CommunityReply[] {
    return this.communityReplies
  }

  getRepliesByPostId(postId: string): CommunityReply[] {
    return this.communityReplies
      .filter(reply => reply.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  addCommunityReply(reply: Omit<CommunityReply, "id" | "createdAt" | "updatedAt" | "likes">): CommunityReply {
    const newReply: CommunityReply = {
      ...reply,
      id: (Math.max(0, ...this.communityReplies.map(r => parseInt(r.id))) + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0
    }
    this.communityReplies.push(newReply)
    
    // Update post reply count
    const post = this.communityPosts.find(p => p.id === reply.postId)
    if (post) {
      post.replyCount += 1
      if (newReply.isAcceptedAnswer) {
        post.isAnswered = true
      }
    }
    
    this.saveToStorage()
    this.notifyListeners()
    return newReply
  }

  updateCommunityReply(id: string, updates: Partial<CommunityReply>): void {
    this.communityReplies = this.communityReplies.map(reply => 
      reply.id === id ? { ...reply, ...updates, updatedAt: new Date().toISOString() } : reply
    )
    this.saveToStorage()
    this.notifyListeners()
  }

  deleteCommunityReply(id: string): void {
    const reply = this.communityReplies.find(r => r.id === id)
    if (reply) {
      // Update post reply count
      const post = this.communityPosts.find(p => p.id === reply.postId)
      if (post) {
        post.replyCount = Math.max(0, post.replyCount - 1)
      }
    }
    this.communityReplies = this.communityReplies.filter(reply => reply.id !== id)
    this.saveToStorage()
    this.notifyListeners()
  }

  markReplyAsAccepted(replyId: string): void {
    const reply = this.communityReplies.find(r => r.id === replyId)
    if (reply) {
      // Unmark other accepted answers for the same post
      this.communityReplies.forEach(r => {
        if (r.postId === reply.postId && r.id !== replyId) {
          r.isAcceptedAnswer = false
        }
      })
      
      reply.isAcceptedAnswer = true
      
      // Mark post as answered
      const post = this.communityPosts.find(p => p.id === reply.postId)
      if (post) {
        post.isAnswered = true
      }
      
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  // Community Statistics
  getCommunityStats(): CommunityStats {
    const totalPosts = this.communityPosts.length
    const totalReplies = this.communityReplies.length
    const answeredPosts = this.communityPosts.filter(p => p.isAnswered).length
    const answeredRate = totalPosts > 0 ? (answeredPosts / totalPosts) * 100 : 0

    // Calculate category counts
    const categoryMap = new Map<string, number>()
    this.communityPosts.forEach(post => {
      categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1)
    })
    const topCategories = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Calculate top contributors
    const contributorMap = new Map<string, { name: string; posts: number; replies: number }>()
    
    this.communityPosts.forEach(post => {
      const existing = contributorMap.get(post.authorId) || { name: post.authorName, posts: 0, replies: 0 }
      existing.posts += 1
      contributorMap.set(post.authorId, existing)
    })
    
    this.communityReplies.forEach(reply => {
      const existing = contributorMap.get(reply.authorId) || { name: reply.authorName, posts: 0, replies: 0 }
      existing.replies += 1
      contributorMap.set(reply.authorId, existing)
    })

    const topContributors = Array.from(contributorMap.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        posts: data.posts,
        replies: data.replies,
        reputation: data.posts * 5 + data.replies * 2 // Simple reputation calculation
      }))
      .sort((a, b) => b.reputation - a.reputation)
      .slice(0, 5)

    return {
      totalPosts,
      totalReplies,
      totalUsers: this.users.filter(u => u.role === 'student').length,
      answeredRate,
      topCategories,
      topContributors
    }
  }
}

// Create singleton instance
export const dataStore = new DataStore()

// Export types
export type { 
  Topic, 
  Assessment, 
  AssessmentAttempt, 
  Question, 
  User, 
  Lesson, 
  LessonCompletion, 
  LessonView,
  CommunityPost,
  CommunityReply,
  CommunityStats 
}

// Dashboard Analytics Functions - Calculate real metrics from actual data
export const calculateDashboardMetrics = () => {
  const users = dataStore.getUsers()
  const topics = dataStore.getTopics()
  const lessons = dataStore.getLessons()
  const lessonViews = dataStore.getLessonViews()
  const lessonCompletions = dataStore.getLessonCompletions()
  
  // Filter active users (students with activity)
  const activeUsers = users.filter(user => user.role === 'student' && user.thisWeekHours > 0)
  const allStudents = users.filter(user => user.role === 'student')
  const totalUsers = users.length
  
  // Calculate average learning time for active students
  const averageTimeThisMonth = allStudents.length > 0 
    ? Math.round(allStudents.reduce((sum, user) => sum + user.thisWeekHours, 0) / allStudents.length)
    : 0
    
  // Simulate last month data (in real app, this would come from historical data)
  const averageTimeLastMonth = Math.max(1, Math.round(averageTimeThisMonth * 0.7)) // 70% of current
  
  // Calculate top lessons based on actual view data
  const lessonStats = lessons.map(lesson => {
    const views = lessonViews.filter(view => view.lessonId === lesson.id)
    const completions = lessonCompletions.filter(completion => completion.lessonId === lesson.id)
    const uniqueViewers = new Set(views.map(view => view.userId)).size
    const topic = topics.find(t => t.id === lesson.topicId)
    
    return {
      id: lesson.id,
      title: lesson.title,
      topic: topic?.category || 'Unknown',
      topicTitle: topic?.title || 'Unknown Topic',
      totalViews: views.length,
      numberOfUsers: uniqueViewers,
      completions: completions.length,
      completionRate: uniqueViewers > 0 ? Math.round((completions.length / uniqueViewers) * 100) : 0,
      image: lesson.image || topic?.image || "/placeholder.jpg",
      duration: lesson.duration,
      difficulty: lesson.difficulty,
      videoUrl: lesson.videoUrl,
    }
  }).sort((a, b) => b.totalViews - a.totalViews) // Sort by most viewed
  
  // Get top 4 lessons for top videos
  const topVideos = lessonStats.slice(0, 4)
  
  // Calculate most viewed topics
  const topicStats = topics.map(topic => {
    const topicLessons = lessons.filter(lesson => lesson.topicId === topic.id)
    const topicViews = lessonViews.filter(view => 
      topicLessons.some(lesson => lesson.id === view.lessonId)
    )
    const topicCompletions = lessonCompletions.filter(completion => 
      topicLessons.some(lesson => lesson.id === completion.lessonId)
    )
    const uniqueViewers = new Set(topicViews.map(view => view.userId)).size
    
    return {
      id: topic.id,
      title: topic.title,
      category: topic.category,
      totalViews: topicViews.length,
      numberOfUsers: uniqueViewers,
      completions: topicCompletions.length,
      completionRate: uniqueViewers > 0 ? Math.round((topicCompletions.length / uniqueViewers) * 100) : 0,
      image: topic.image || "/placeholder.jpg",
      difficulty: topic.difficulty,
      lessons: topicLessons.length,
      enrolledStudents: topic.students,
    }
  }).sort((a, b) => b.totalViews - a.totalViews) // Sort by most viewed
  
  // Get top 6 topics for most viewed topics
  const mostViewedTopics = topicStats.slice(0, 6)

  return {
    admin: {
      activeUsersThisMonth: activeUsers.length,
      activeUsersLastMonth: Math.max(activeUsers.length, allStudents.length), // Simulate last month
      actualUsers: totalUsers,
      averageTimeThisMonth,
      averageTimeLastMonth,
      totalStudents: allStudents.length,
      totalAdmins: users.filter(u => u.role === 'admin').length,
      topVideos,
      mostViewedTopics,
      totalLessons: lessons.length,
      totalTopics: topics.length,
      totalViews: lessonViews.length,
      totalCompletions: lessonCompletions.length
    },
    student: (userId?: string) => {
      // Get specific student data or use defaults
      const currentUser = userId ? users.find(u => u.id === userId) : allStudents[0]
      const userData = currentUser || {
        currentTopic: "Getting Started",
        completedTopics: 0,
        totalTopics: topics.length,
        weeklyHours: 10,
        thisWeekHours: 0,
        joinedDate: "Recently",
        recentActivity: "No recent activity"
      }

      return {
        currentTopic: userData.currentTopic || topics[0]?.title || "Getting Started",
        completedTopics: userData.completedTopics || 0,
        totalTopics: topics.length,
        weeklyGoal: userData.weeklyHours || 10,
        thisWeekHours: userData.thisWeekHours || 0,
        joinedDate: userData.joinedDate || "Recently",
        recentActivity: "Introduction to Blockchain",
        recentActivities: [
          {
            id: 1,
            type: "completion",
            title: "Completed: Introduction to Blockchain",
            date: "2 days ago",
            icon: "BookOpen",
            status: "Completed",
            statusColor: "green"
          },
          {
            id: 2,
            type: "assessment", 
            title: "Assessment: Crypto Basics Quiz",
            date: "5 days ago",
            score: "85%",
            icon: "Trophy",
            status: "Passed", 
            statusColor: "yellow"
          }
        ]
      }
    }
  }
}

// Helper functions for dashboard calculations
export const getDashboardStats = (userId?: string) => {
  const metrics = calculateDashboardMetrics()
  const studentData = metrics.student(userId)
  
  return {
    admin: {
      ...metrics.admin,
      progressPercentage: (metrics.admin.activeUsersThisMonth / Math.max(1, metrics.admin.activeUsersLastMonth)) * 100,
    },
    student: {
      ...studentData,
      progressPercentage: (studentData.completedTopics / Math.max(1, studentData.totalTopics)) * 100,
      weeklyProgressPercentage: (studentData.thisWeekHours / Math.max(1, studentData.weeklyGoal)) * 100,
      remainingHours: Math.max(0, studentData.weeklyGoal - studentData.thisWeekHours),
    }
  }
}

// Function to update dashboard metrics (for future API integration)
export const updateDashboardMetrics = (type: 'admin' | 'student', updates: any) => {
  // This would update user data in the data store instead of hardcoded metrics
  console.log(`Updating ${type} metrics:`, updates)
  // In the future, this could update user statistics, learning hours, etc.
}

// Debug function to show current metrics
export const logCurrentMetrics = () => {
  const stats = getDashboardStats()
  console.log('📊 Current Dashboard Metrics:')
  console.log('👥 Admin Dashboard:')
  console.log(`  - Active users this month: ${stats.admin.activeUsersThisMonth}`)
  console.log(`  - Active users last month: ${stats.admin.activeUsersLastMonth}`)
  console.log(`  - Total users: ${stats.admin.actualUsers}`)
  console.log(`  - Students: ${stats.admin.totalStudents}`)
  console.log(`  - Admins: ${stats.admin.totalAdmins}`)
  console.log(`  - Avg time this month: ${stats.admin.averageTimeThisMonth}h`)
  console.log(`  - Avg time last month: ${stats.admin.averageTimeLastMonth}h`)
  console.log('📚 Student Dashboard:')
  console.log(`  - Current topic: ${stats.student.currentTopic}`)
  console.log(`  - Progress: ${stats.student.completedTopics}/${stats.student.totalTopics} (${Math.round(stats.student.progressPercentage)}%)`)
  console.log(`  - Weekly: ${stats.student.thisWeekHours}h/${stats.student.weeklyGoal}h (${Math.round(stats.student.weeklyProgressPercentage)}%)`)
  return stats
}

// Function to reset all data (for development/testing)
export const resetLMSData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("lms-topics")
    localStorage.removeItem("lms-assessments") 
    localStorage.removeItem("lms-users")
    localStorage.removeItem("lms-lessons")
    localStorage.removeItem("lms-lesson-completions")
    localStorage.removeItem("lms-lesson-views")
    localStorage.removeItem("lms-assessment-attempts")
    localStorage.removeItem("lms-community-posts")
    localStorage.removeItem("lms-community-replies")
    console.log('🔄 LMS data reset! Please refresh the page to load new data.')
    window.location.reload()
  }
}
