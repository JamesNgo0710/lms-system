-- LMS System Database Seeder
-- This script populates the Laravel backend with realistic LMS data

-- Insert sample users
INSERT INTO users (id, name, email, email_verified_at, password, role, first_name, last_name, joined_date, profile_image, created_at, updated_at) VALUES
(1, 'Admin User', 'admin@lms.com', NOW(), '$2y$12$LWJzGJQ8YZpL7zZMtL3IWO8.9Y5MfTrj9qGbH5xKpPfY2sM3N8WQC', 'admin', 'Admin', 'User', '2023-01-01', NULL, NOW(), NOW()),
(2, 'John Doe', 'john@example.com', NOW(), '$2y$12$LWJzGJQ8YZpL7zZMtL3IWO8.9Y5MfTrj9qGbH5xKpPfY2sM3N8WQC', 'student', 'John', 'Doe', '2023-02-15', NULL, NOW(), NOW()),
(3, 'Jane Smith', 'jane@example.com', NOW(), '$2y$12$LWJzGJQ8YZpL7zZMtL3IWO8.9Y5MfTrj9qGbH5xKpPfY2sM3N8WQC', 'student', 'Jane', 'Smith', '2023-03-01', NULL, NOW(), NOW()),
(4, 'Bob Wilson', 'bob@example.com', NOW(), '$2y$12$LWJzGJQ8YZpL7zZMtL3IWO8.9Y5MfTrj9qGbH5xKpPfY2sM3N8WQC', 'student', 'Bob', 'Wilson', '2023-03-10', NULL, NOW(), NOW()),
(5, 'Alice Johnson', 'alice@example.com', NOW(), '$2y$12$LWJzGJQ8YZpL7zZMtL3IWO8.9Y5MfTrj9qGbH5xKpPfY2sM3N8WQC', 'student', 'Alice', 'Johnson', '2023-03-15', NULL, NOW(), NOW());

-- Insert topics
INSERT INTO topics (id, title, category, status, lessons_count, created_at, updated_at, has_assessment, difficulty, description, image) VALUES
(1, 'General Info on Blockchain Tech', 'Basics', 'Published', 3, '2023-01-15', NOW(), 1, 'Beginner', 'Learn the fundamentals of blockchain technology, including how it works, its key features like decentralization and immutability, and explore various real-world applications across different industries.', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop&crop=center'),
(2, 'Getting Started With Crypto', 'Basics', 'Published', 2, '2023-02-20', NOW(), 1, 'Beginner', 'Introduction to cryptocurrency basics, understanding digital currencies, and learning how to create and secure your first cryptocurrency wallet with best practices.', 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=225&fit=crop&crop=center'),
(3, 'Using MetaMask', 'Wallets', 'Published', 2, '2023-03-10', NOW(), 1, 'Beginner', 'Complete guide to installing, setting up, and using MetaMask browser extension. Learn about network switching, token management, and advanced security features.', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center'),
(4, 'Decentralised Finance (DeFi)', 'DeFi', 'Published', 2, '2023-01-25', NOW(), 1, 'Intermediate', 'Explore decentralized finance protocols, yield farming strategies, liquidity pools, and learn advanced techniques for maximizing DeFi yields while managing risks.', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=225&fit=crop&crop=center'),
(5, 'Non-Fungible Tokens (NFTs)', 'NFTs', 'Published', 1, '2023-02-15', NOW(), 0, 'Beginner', 'Understanding non-fungible tokens (NFTs), their technology, use cases, marketplaces, and applications in digital art, gaming, and various other industries.', 'https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=400&h=225&fit=crop&crop=center'),
(6, 'Smart Contracts', 'Advanced', 'Published', 2, '2023-04-01', NOW(), 1, 'Advanced', 'Deep dive into smart contracts, their development, deployment, and real-world applications in various blockchain ecosystems.', 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=225&fit=crop&crop=center');

-- Insert lessons for Topic 1: General Info on Blockchain Tech
INSERT INTO lessons (id, topic_id, title, description, duration, difficulty, video_url, prerequisites, content, social_links, downloads, lesson_order, status, created_at, updated_at, image) VALUES
(1, 1, 'Introduction to Blockchain', 'Learn the fundamentals of blockchain technology and how it works.', '15 min', 'Beginner', 'https://www.youtube.com/watch?v=bBC-nXj3Ng4', '[]', 'This lesson covers the basic concepts of blockchain technology, including decentralization, immutability, and consensus mechanisms. You will learn about the distributed ledger system that forms the backbone of cryptocurrencies and many other applications.', '{"youtube": "https://www.youtube.com/watch?v=bBC-nXj3Ng4", "discord": "https://discord.gg/blockchain"}', '[{"id": 1, "name": "Blockchain Basics Guide.pdf", "size": "2.5 MB", "url": "/downloads/blockchain-basics.pdf"}]', 1, 'Published', NOW(), NOW(), 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop&crop=center'),
(2, 1, 'How Blockchain Works', 'Deep dive into the technical aspects of blockchain operations.', '20 min', 'Beginner', 'https://www.youtube.com/watch?v=SSo_EIwHSd4', '[]', 'Understanding the technical mechanisms behind blockchain technology, including hashing, merkle trees, and proof-of-work consensus algorithms.', '{"youtube": "https://www.youtube.com/watch?v=SSo_EIwHSd4"}', '[{"id": 2, "name": "Technical Guide.pdf", "size": "3.1 MB", "url": "/downloads/technical-guide.pdf"}]', 2, 'Published', NOW(), NOW(), 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop&crop=center'),
(3, 1, 'Blockchain Applications', 'Explore real-world applications and use cases of blockchain technology.', '18 min', 'Intermediate', 'https://www.youtube.com/watch?v=kP6EezXJKNM', '["Introduction to Blockchain"]', 'Discover how blockchain technology is being used across various industries including finance, supply chain, healthcare, and digital identity.', '{}', '[]', 3, 'Published', NOW(), NOW(), 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=225&fit=crop&crop=center');

-- Insert lessons for Topic 2: Getting Started With Crypto
INSERT INTO lessons (id, topic_id, title, description, duration, difficulty, video_url, prerequisites, content, social_links, downloads, lesson_order, status, created_at, updated_at, image) VALUES
(4, 2, 'What is Cryptocurrency?', 'Introduction to digital currencies and how they work.', '12 min', 'Beginner', 'https://www.youtube.com/watch?v=41JCpzvnn_0', '[]', 'Learn about digital currencies, their advantages over traditional money, and how they enable peer-to-peer transactions without intermediaries.', '{}', '[{"id": 3, "name": "Crypto Basics.pdf", "size": "1.8 MB", "url": "/downloads/crypto-basics.pdf"}]', 1, 'Published', NOW(), NOW(), 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=225&fit=crop&crop=center'),
(5, 2, 'Creating Your First Wallet', 'Step-by-step guide to setting up a cryptocurrency wallet.', '16 min', 'Beginner', 'https://www.youtube.com/watch?v=d8IBpfs9bf4', '["What is Cryptocurrency?"]', 'Comprehensive guide to creating and securing your first cryptocurrency wallet, including security best practices and backup procedures.', '{}', '[{"id": 4, "name": "Wallet Security Guide.pdf", "size": "2.2 MB", "url": "/downloads/wallet-security.pdf"}]', 2, 'Published', NOW(), NOW(), 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center');

-- Insert lessons for Topic 3: Using MetaMask
INSERT INTO lessons (id, topic_id, title, description, duration, difficulty, video_url, prerequisites, content, social_links, downloads, lesson_order, status, created_at, updated_at, image) VALUES
(6, 3, 'Installing MetaMask', 'How to install and set up MetaMask browser extension.', '10 min', 'Beginner', 'https://www.youtube.com/watch?v=Af_lQ1zUnoM', '[]', 'Step-by-step instructions for installing MetaMask on different browsers and setting up your first wallet with proper security measures.', '{}', '[{"id": 5, "name": "MetaMask Setup Guide.pdf", "size": "1.5 MB", "url": "/downloads/metamask-setup.pdf"}]', 1, 'Published', NOW(), NOW(), 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center'),
(7, 3, 'Advanced MetaMask Features', 'Explore advanced features and security settings.', '22 min', 'Intermediate', 'https://www.youtube.com/watch?v=YVgfHZMFFFQ', '["Installing MetaMask"]', 'Learn about network switching, custom tokens, transaction settings, and advanced security features to maximize your MetaMask experience.', '{}', '[]', 2, 'Published', NOW(), NOW(), 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop&crop=center');

-- Insert lessons for Topic 4: DeFi
INSERT INTO lessons (id, topic_id, title, description, duration, difficulty, video_url, prerequisites, content, social_links, downloads, lesson_order, status, created_at, updated_at, image) VALUES
(8, 4, 'Introduction to DeFi', 'Understanding decentralized finance and its core principles.', '18 min', 'Intermediate', 'https://www.youtube.com/watch?v=k9HYC0EJU6E', '[]', 'Introduction to decentralized finance protocols, their advantages over traditional finance, and key concepts like liquidity pools and yield farming.', '{}', '[{"id": 6, "name": "DeFi Guide.pdf", "size": "3.5 MB", "url": "/downloads/defi-guide.pdf"}]', 1, 'Published', NOW(), NOW(), 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=225&fit=crop&crop=center'),
(9, 4, 'Yield Farming Strategies', 'Advanced strategies for maximizing DeFi yields.', '25 min', 'Advanced', 'https://www.youtube.com/watch?v=ClnnLI1SClA', '["Introduction to DeFi"]', 'Complex yield farming techniques, risk management strategies, and advanced DeFi protocols for experienced users.', '{}', '[]', 2, 'Published', NOW(), NOW(), 'https://images.unsplash.com/photo-1627118392839-b46a15ad71bb?w=400&h=225&fit=crop&crop=center');

-- Insert lessons for Topic 5: NFTs
INSERT INTO lessons (id, topic_id, title, description, duration, difficulty, video_url, prerequisites, content, social_links, downloads, lesson_order, status, created_at, updated_at, image) VALUES
(10, 5, 'What are NFTs?', 'Introduction to non-fungible tokens and their use cases.', '14 min', 'Beginner', 'https://www.youtube.com/watch?v=Oz9zw7-_vhM', '[]', 'Understanding NFT technology, marketplaces, and applications in digital art, gaming, and collectibles.', '{}', '[{"id": 7, "name": "NFT Guide.pdf", "size": "2.8 MB", "url": "/downloads/nft-guide.pdf"}]', 1, 'Published', NOW(), NOW(), 'https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=400&h=225&fit=crop&crop=center');

-- Insert lessons for Topic 6: Smart Contracts
INSERT INTO lessons (id, topic_id, title, description, duration, difficulty, video_url, prerequisites, content, social_links, downloads, lesson_order, status, created_at, updated_at, image) VALUES
(11, 6, 'Smart Contract Basics', 'Introduction to smart contracts and their applications.', '20 min', 'Advanced', 'https://www.youtube.com/watch?v=ZE2HxTmxfrI', '[]', 'Understanding smart contracts, their execution, and real-world applications in various blockchain ecosystems.', '{}', '[{"id": 8, "name": "Smart Contracts Guide.pdf", "size": "4.2 MB", "url": "/downloads/smart-contracts.pdf"}]', 1, 'Published', NOW(), NOW(), 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=225&fit=crop&crop=center'),
(12, 6, 'Solidity Programming', 'Learn Solidity programming for Ethereum smart contracts.', '35 min', 'Advanced', 'https://www.youtube.com/watch?v=ipwxYa-F1uY', '["Smart Contract Basics"]', 'Comprehensive introduction to Solidity programming language for developing smart contracts on the Ethereum blockchain.', '{}', '[{"id": 9, "name": "Solidity Reference.pdf", "size": "5.1 MB", "url": "/downloads/solidity-reference.pdf"}]', 2, 'Published', NOW(), NOW(), 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop&crop=center');

-- Insert assessments
INSERT INTO assessments (id, topic_id, total_questions, time_limit, retake_period, cooldown_period, status, created_at, updated_at) VALUES
(1, 1, 10, '01:00', '3 months', 24, 'Published', NOW(), NOW()),
(2, 2, 8, '00:45', '3 months', 24, 'Published', NOW(), NOW()),
(3, 3, 5, '00:30', '3 months', 24, 'Published', NOW(), NOW()),
(4, 4, 5, '00:45', '3 months', 48, 'Published', NOW(), NOW()),
(5, 6, 5, '01:00', '3 months', 48, 'Published', NOW(), NOW());

-- Insert sample lesson completions
INSERT INTO lesson_completions (id, user_id, lesson_id, topic_id, completed_at, time_spent, created_at, updated_at) VALUES
(UUID(), 2, 1, 1, '2023-03-15 10:30:00', 15, NOW(), NOW()),
(UUID(), 2, 2, 1, '2023-03-16 11:00:00', 22, NOW(), NOW()),
(UUID(), 2, 4, 2, '2023-03-18 14:15:00', 14, NOW(), NOW()),
(UUID(), 3, 1, 1, '2023-03-20 09:00:00', 18, NOW(), NOW()),
(UUID(), 3, 4, 2, '2023-03-22 16:30:00', 13, NOW(), NOW()),
(UUID(), 3, 6, 3, '2023-03-25 10:45:00', 11, NOW(), NOW()),
(UUID(), 4, 1, 1, '2023-03-28 13:20:00', 16, NOW(), NOW()),
(UUID(), 5, 10, 5, '2023-04-01 11:30:00', 15, NOW(), NOW());

-- Insert sample lesson views
INSERT INTO lesson_views (id, user_id, lesson_id, topic_id, viewed_at, duration, created_at, updated_at) VALUES
(UUID(), 2, 1, 1, '2023-03-15 10:30:00', 15, NOW(), NOW()),
(UUID(), 2, 2, 1, '2023-03-16 11:00:00', 22, NOW(), NOW()),
(UUID(), 2, 3, 1, '2023-03-17 15:30:00', 8, NOW(), NOW()),
(UUID(), 3, 1, 1, '2023-03-20 09:00:00', 18, NOW(), NOW()),
(UUID(), 3, 4, 2, '2023-03-22 16:30:00', 13, NOW(), NOW()),
(UUID(), 4, 1, 1, '2023-03-28 13:20:00', 16, NOW(), NOW()),
(UUID(), 5, 10, 5, '2023-04-01 11:30:00', 15, NOW(), NOW());

-- Insert sample assessment attempts
INSERT INTO assessment_attempts (id, user_id, assessment_id, topic_id, score, correct_answers, total_questions, time_spent, completed_at, answers, created_at, updated_at) VALUES
(UUID(), 2, 1, 1, 85, 8, 10, 2400, '2023-03-17 16:00:00', '[1, "false", 1, "true", 1, 1, "false", 0, "false", 1]', NOW(), NOW()),
(UUID(), 3, 2, 2, 92, 7, 8, 1800, '2023-03-25 17:30:00', '[1, "false", 2, "true", 1, "false", 0, "false"]', NOW(), NOW()),
(UUID(), 4, 1, 1, 78, 7, 10, 2700, '2023-03-30 14:15:00', '[1, "false", 0, "true", 1, 1, "true", 0, "false", 1]', NOW(), NOW());

-- Update topic student counts based on enrollments/completions
UPDATE topics SET students_count = (
    SELECT COUNT(DISTINCT user_id) 
    FROM lesson_views 
    WHERE lesson_views.topic_id = topics.id
) WHERE id IN (1, 2, 3, 4, 5, 6);