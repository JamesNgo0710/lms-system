<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\UserAchievement;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function index()
    {
        return Achievement::where('is_active', true)->get();
    }

    public function getUserAchievements(Request $request, $userId)
    {
        // Users can only view their own achievements unless they're admin
        if (auth()->user()->id != $userId && !auth()->user()->hasRole('admin')) {
            abort(403);
        }

        $achievements = UserAchievement::where('user_id', $userId)
            ->with('achievement')
            ->get();

        return response()->json($achievements);
    }

    public function checkUserAchievement(Request $request, $userId, $achievementId)
    {
        // Users can only check their own achievements unless they're admin
        if (auth()->user()->id != $userId && !auth()->user()->hasRole('admin')) {
            abort(403);
        }

        $userAchievement = UserAchievement::where('user_id', $userId)
            ->where('achievement_id', $achievementId)
            ->first();

        return response()->json([
            'has_achievement' => $userAchievement !== null,
            'earned_at' => $userAchievement ? $userAchievement->earned_at : null
        ]);
    }

    public function awardAchievement(Request $request, $userId, $achievementId)
    {
        // Only system or admin can award achievements
        if (!auth()->user()->hasRole('admin')) {
            abort(403);
        }

        // Check if user already has this achievement
        $existing = UserAchievement::where('user_id', $userId)
            ->where('achievement_id', $achievementId)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'User already has this achievement'], 400);
        }

        $userAchievement = UserAchievement::create([
            'user_id' => $userId,
            'achievement_id' => $achievementId,
            'earned_at' => now(),
        ]);

        return response()->json($userAchievement->load('achievement'), 201);
    }
}
