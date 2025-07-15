<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Achievement;

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $achievements = [
            [
                'name' => 'First Steps',
                'description' => 'Complete your first lesson',
                'icon' => '🎯',
                'type' => 'badge',
                'criteria' => ['type' => 'lesson_completion', 'count' => 1],
                'is_active' => true,
            ],
            [
                'name' => 'Quick Learner',
                'description' => 'Complete 5 lessons',
                'icon' => '⚡',
                'type' => 'badge',
                'criteria' => ['type' => 'lesson_completion', 'count' => 5],
                'is_active' => true,
            ],
            [
                'name' => 'Dedicated Student',
                'description' => 'Complete 10 lessons',
                'icon' => '📚',
                'type' => 'badge',
                'criteria' => ['type' => 'lesson_completion', 'count' => 10],
                'is_active' => true,
            ],
            [
                'name' => 'Knowledge Seeker',
                'description' => 'Complete 25 lessons',
                'icon' => '🔍',
                'type' => 'badge',
                'criteria' => ['type' => 'lesson_completion', 'count' => 25],
                'is_active' => true,
            ],
            [
                'name' => 'Scholar',
                'description' => 'Complete 50 lessons',
                'icon' => '🎓',
                'type' => 'badge',
                'criteria' => ['type' => 'lesson_completion', 'count' => 50],
                'is_active' => true,
            ],
            [
                'name' => 'Master Learner',
                'description' => 'Complete 100 lessons',
                'icon' => '👑',
                'type' => 'badge',
                'criteria' => ['type' => 'lesson_completion', 'count' => 100],
                'is_active' => true,
            ],
            [
                'name' => 'First Assessment',
                'description' => 'Complete your first assessment',
                'icon' => '📝',
                'type' => 'badge',
                'criteria' => ['type' => 'assessment_completion', 'count' => 1],
                'is_active' => true,
            ],
            [
                'name' => 'Assessment Pro',
                'description' => 'Complete 5 assessments',
                'icon' => '💯',
                'type' => 'badge',
                'criteria' => ['type' => 'assessment_completion', 'count' => 5],
                'is_active' => true,
            ],
            [
                'name' => 'Perfect Score',
                'description' => 'Get 100% on an assessment',
                'icon' => '🌟',
                'type' => 'badge',
                'criteria' => ['type' => 'assessment_perfect_score', 'count' => 1],
                'is_active' => true,
            ],
            [
                'name' => 'Topic Master',
                'description' => 'Complete an entire topic',
                'icon' => '🏆',
                'type' => 'badge',
                'criteria' => ['type' => 'topic_completion', 'count' => 1],
                'is_active' => true,
            ],
            [
                'name' => 'Multi-Subject',
                'description' => 'Complete 3 different topics',
                'icon' => '🎨',
                'type' => 'badge',
                'criteria' => ['type' => 'topic_completion', 'count' => 3],
                'is_active' => true,
            ],
            [
                'name' => 'Consistent Learner',
                'description' => 'Log in for 7 consecutive days',
                'icon' => '🔥',
                'type' => 'badge',
                'criteria' => ['type' => 'daily_streak', 'count' => 7],
                'is_active' => true,
            ],
        ];

        foreach ($achievements as $achievement) {
            Achievement::updateOrCreate(
                ['name' => $achievement['name']],
                $achievement
            );
        }
    }
}
