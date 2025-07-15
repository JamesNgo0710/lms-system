<?php

// Laravel Artisan Command to Seed LMS Database
// Run this from your Laravel project root: php artisan make:command SeedLmsData

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class SeedLmsData extends Command
{
    protected $signature = 'lms:seed-data';
    protected $description = 'Seed the LMS database with sample data';

    public function handle()
    {
        $this->info('Seeding LMS database with sample data...');

        try {
            DB::beginTransaction();

            // Clear existing data
            $this->info('Clearing existing data...');
            DB::table('assessment_attempts')->delete();
            DB::table('lesson_views')->delete();
            DB::table('lesson_completions')->delete();
            DB::table('assessments')->delete();
            DB::table('lessons')->delete();
            DB::table('topics')->delete();
            DB::table('users')->where('email', '!=', 'admin@lms.com')->delete();

            // Insert users
            $this->info('Creating users...');
            DB::table('users')->insert([
                [
                    'id' => 1,
                    'name' => 'Admin User',
                    'email' => 'admin@lms.com',
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'role' => 'admin',
                    'first_name' => 'Admin',
                    'last_name' => 'User',
                    'joined_date' => '2023-01-01',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => 2,
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'first_name' => 'John',
                    'last_name' => 'Doe',
                    'joined_date' => '2023-02-15',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => 3,
                    'name' => 'Jane Smith',
                    'email' => 'jane@example.com',
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'first_name' => 'Jane',
                    'last_name' => 'Smith',
                    'joined_date' => '2023-03-01',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => 4,
                    'name' => 'Bob Wilson',
                    'email' => 'bob@example.com',
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'first_name' => 'Bob',
                    'last_name' => 'Wilson',
                    'joined_date' => '2023-03-10',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => 5,
                    'name' => 'Alice Johnson',
                    'email' => 'alice@example.com',
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'first_name' => 'Alice',
                    'last_name' => 'Johnson',
                    'joined_date' => '2023-03-15',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);

            // Insert topics
            $this->info('Creating topics...');
            DB::table('topics')->insert([
                [
                    'id' => 1,
                    'title' => 'General Info on Blockchain Tech',
                    'category' => 'Basics',
                    'status' => 'Published',
                    'lessons_count' => 3,
                    'created_at' => '2023-01-15',
                    'updated_at' => now(),
                    'has_assessment' => true,
                    'difficulty' => 'Beginner',
                    'description' => 'Learn the fundamentals of blockchain technology, including how it works, its key features like decentralization and immutability, and explore various real-world applications across different industries.',
                    'image' => 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop&crop=center',
                ],
                [
                    'id' => 2,
                    'title' => 'Getting Started With Crypto',
                    'category' => 'Basics',
                    'status' => 'Published',
                    'lessons_count' => 2,
                    'created_at' => '2023-02-20',
                    'updated_at' => now(),
                    'has_assessment' => true,
                    'difficulty' => 'Beginner',
                    'description' => 'Introduction to cryptocurrency basics, understanding digital currencies, and learning how to create and secure your first cryptocurrency wallet with best practices.',
                    'image' => 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=225&fit=crop&crop=center',
                ],
                [
                    'id' => 3,
                    'title' => 'Using MetaMask',
                    'category' => 'Wallets',
                    'status' => 'Published',
                    'lessons_count' => 2,
                    'created_at' => '2023-03-10',
                    'updated_at' => now(),
                    'has_assessment' => true,
                    'difficulty' => 'Beginner',
                    'description' => 'Complete guide to installing, setting up, and using MetaMask browser extension. Learn about network switching, token management, and advanced security features.',
                    'image' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center',
                ],
                [
                    'id' => 4,
                    'title' => 'Decentralised Finance (DeFi)',
                    'category' => 'DeFi',
                    'status' => 'Published',
                    'lessons_count' => 2,
                    'created_at' => '2023-01-25',
                    'updated_at' => now(),
                    'has_assessment' => true,
                    'difficulty' => 'Intermediate',
                    'description' => 'Explore decentralized finance protocols, yield farming strategies, liquidity pools, and learn advanced techniques for maximizing DeFi yields while managing risks.',
                    'image' => 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=225&fit=crop&crop=center',
                ],
                [
                    'id' => 5,
                    'title' => 'Non-Fungible Tokens (NFTs)',
                    'category' => 'NFTs',
                    'status' => 'Published',
                    'lessons_count' => 1,
                    'created_at' => '2023-02-15',
                    'updated_at' => now(),
                    'has_assessment' => false,
                    'difficulty' => 'Beginner',
                    'description' => 'Understanding non-fungible tokens (NFTs), their technology, use cases, marketplaces, and applications in digital art, gaming, and various other industries.',
                    'image' => 'https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=400&h=225&fit=crop&crop=center',
                ],
                [
                    'id' => 6,
                    'title' => 'Smart Contracts',
                    'category' => 'Advanced',
                    'status' => 'Published',
                    'lessons_count' => 2,
                    'created_at' => '2023-04-01',
                    'updated_at' => now(),
                    'has_assessment' => true,
                    'difficulty' => 'Advanced',
                    'description' => 'Deep dive into smart contracts, their development, deployment, and real-world applications in various blockchain ecosystems.',
                    'image' => 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=225&fit=crop&crop=center',
                ],
            ]);

            // Insert lessons (abbreviated for space - would include all 12 lessons)
            $this->info('Creating lessons...');
            // ... (insert lesson data here)

            // Insert assessments with questions
            $this->info('Creating assessments...');
            // ... (insert assessment data with JSON questions here)

            // Insert sample progress data
            $this->info('Creating sample progress data...');
            // ... (insert lesson completions, views, and assessment attempts)

            DB::commit();
            $this->info('LMS database seeding completed successfully!');
            $this->info('Test accounts created:');
            $this->info('- Admin: admin@lms.com / password');
            $this->info('- Student: john@example.com / password');
            $this->info('- Student: jane@example.com / password');

        } catch (\Exception $e) {
            DB::rollback();
            $this->error('Error seeding database: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}