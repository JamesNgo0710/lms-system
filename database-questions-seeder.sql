-- Assessment Questions Seeder
-- This script adds the questions as JSON data to the assessments table

-- Update assessment 1 (Blockchain Tech) with questions
UPDATE assessments SET questions = '[
  {
    "id": 1,
    "type": "multiple-choice",
    "question": "What is blockchain technology primarily used for?",
    "options": ["Gaming only", "Decentralized transactions", "Social media", "Video streaming"],
    "correctAnswer": 1,
    "image": "/placeholder.svg?height=200&width=300"
  },
  {
    "id": 2,
    "type": "true-false",
    "question": "Blockchain is a centralized database system.",
    "correctAnswer": "false"
  },
  {
    "id": 3,
    "type": "multiple-choice",
    "question": "Which of the following is a key feature of blockchain?",
    "options": ["Centralization", "Immutability", "Single point of failure", "Manual verification"],
    "correctAnswer": 1
  },
  {
    "id": 4,
    "type": "true-false",
    "question": "Bitcoin was the first cryptocurrency ever created.",
    "correctAnswer": "true"
  },
  {
    "id": 5,
    "type": "multiple-choice",
    "question": "What does mining refer to in blockchain?",
    "options": ["Extracting gold", "Validating transactions", "Creating websites", "Storing data"],
    "correctAnswer": 1
  },
  {
    "id": 6,
    "type": "multiple-choice",
    "question": "What is a hash function in blockchain?",
    "options": [
      "A type of cryptocurrency",
      "A mathematical function that converts input to fixed output",
      "A mining tool",
      "A wallet address"
    ],
    "correctAnswer": 1
  },
  {
    "id": 7,
    "type": "true-false",
    "question": "Blockchain transactions are reversible.",
    "correctAnswer": "false"
  },
  {
    "id": 8,
    "type": "multiple-choice",
    "question": "What is consensus in blockchain?",
    "options": ["Agreement between users", "A type of cryptocurrency", "A wallet feature", "A mining reward"],
    "correctAnswer": 0
  },
  {
    "id": 9,
    "type": "true-false",
    "question": "All blockchain networks are public.",
    "correctAnswer": "false"
  },
  {
    "id": 10,
    "type": "multiple-choice",
    "question": "What is a smart contract?",
    "options": [
      "A legal document",
      "Self-executing contract with code",
      "A type of cryptocurrency",
      "A mining algorithm"
    ],
    "correctAnswer": 1
  }
]' WHERE id = 1;

-- Update assessment 2 (Getting Started With Crypto) with questions
UPDATE assessments SET questions = '[
  {
    "id": 1,
    "type": "multiple-choice",
    "question": "What is cryptocurrency?",
    "options": ["Physical money", "Digital currency", "Credit card", "Bank account"],
    "correctAnswer": 1
  },
  {
    "id": 2,
    "type": "true-false",
    "question": "Cryptocurrencies are controlled by central banks.",
    "correctAnswer": "false"
  },
  {
    "id": 3,
    "type": "multiple-choice",
    "question": "Which was the first cryptocurrency?",
    "options": ["Ethereum", "Litecoin", "Bitcoin", "Ripple"],
    "correctAnswer": 2
  },
  {
    "id": 4,
    "type": "true-false",
    "question": "You need a wallet to store cryptocurrencies.",
    "correctAnswer": "true"
  },
  {
    "id": 5,
    "type": "multiple-choice",
    "question": "What is a private key?",
    "options": ["Public address", "Secret code for wallet access", "Exchange name", "Coin type"],
    "correctAnswer": 1
  },
  {
    "id": 6,
    "type": "true-false",
    "question": "Cryptocurrency transactions are anonymous.",
    "correctAnswer": "false"
  },
  {
    "id": 7,
    "type": "multiple-choice",
    "question": "What is market capitalization in crypto?",
    "options": ["Total value of all coins", "Price per coin", "Number of transactions", "Mining difficulty"],
    "correctAnswer": 0
  },
  {
    "id": 8,
    "type": "true-false",
    "question": "All cryptocurrencies use the same technology.",
    "correctAnswer": "false"
  }
]' WHERE id = 2;

-- Update assessment 3 (Using MetaMask) with questions
UPDATE assessments SET questions = '[
  {
    "id": 1,
    "type": "multiple-choice",
    "question": "What is MetaMask?",
    "options": ["A cryptocurrency", "A blockchain wallet", "An exchange", "A mining tool"],
    "correctAnswer": 1
  },
  {
    "id": 2,
    "type": "true-false",
    "question": "MetaMask can be used as a browser extension.",
    "correctAnswer": "true"
  },
  {
    "id": 3,
    "type": "multiple-choice",
    "question": "What should you never share from your MetaMask wallet?",
    "options": ["Public address", "Seed phrase", "Transaction history", "Network settings"],
    "correctAnswer": 1
  },
  {
    "id": 4,
    "type": "true-false",
    "question": "MetaMask only works with Bitcoin.",
    "correctAnswer": "false"
  },
  {
    "id": 5,
    "type": "multiple-choice",
    "question": "How many words are typically in a MetaMask seed phrase?",
    "options": ["8", "12", "16", "24"],
    "correctAnswer": 1
  }
]' WHERE id = 3;

-- Update assessment 4 (DeFi) with questions
UPDATE assessments SET questions = '[
  {
    "id": 1,
    "type": "multiple-choice",
    "question": "What does DeFi stand for?",
    "options": ["Digital Finance", "Decentralized Finance", "Direct Finance", "Distributed Finance"],
    "correctAnswer": 1
  },
  {
    "id": 2,
    "type": "true-false",
    "question": "DeFi applications require traditional banks.",
    "correctAnswer": "false"
  },
  {
    "id": 3,
    "type": "multiple-choice",
    "question": "What is yield farming in DeFi?",
    "options": ["Growing crops", "Earning rewards by providing liquidity", "Mining coins", "Trading stocks"],
    "correctAnswer": 1
  },
  {
    "id": 4,
    "type": "true-false",
    "question": "Smart contracts are essential for DeFi protocols.",
    "correctAnswer": "true"
  },
  {
    "id": 5,
    "type": "multiple-choice",
    "question": "What is a liquidity pool?",
    "options": ["A swimming pool", "Collection of funds for trading", "Mining equipment", "Wallet type"],
    "correctAnswer": 1
  }
]' WHERE id = 4;

-- Update assessment 5 (Smart Contracts) with questions
UPDATE assessments SET questions = '[
  {
    "id": 1,
    "type": "multiple-choice",
    "question": "What is a smart contract?",
    "options": ["Legal document", "Self-executing contract with code", "Insurance policy", "Bank agreement"],
    "correctAnswer": 1
  },
  {
    "id": 2,
    "type": "true-false",
    "question": "Smart contracts can execute automatically without human intervention.",
    "correctAnswer": "true"
  },
  {
    "id": 3,
    "type": "multiple-choice",
    "question": "Which programming language is commonly used for Ethereum smart contracts?",
    "options": ["JavaScript", "Python", "Solidity", "Java"],
    "correctAnswer": 2
  },
  {
    "id": 4,
    "type": "true-false",
    "question": "Smart contracts are immutable once deployed.",
    "correctAnswer": "true"
  },
  {
    "id": 5,
    "type": "multiple-choice",
    "question": "What triggers a smart contract execution?",
    "options": ["Time", "Conditions being met", "External calls", "All of the above"],
    "correctAnswer": 3
  }
]' WHERE id = 5;