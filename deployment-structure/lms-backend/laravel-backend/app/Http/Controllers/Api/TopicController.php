<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function index()
    {
        $topics = Topic::with(['lessons', 'assessments'])
            ->withCount(['lessons', 'lessonViews', 'lessonCompletions'])
            ->get()
            ->map(function ($topic) {
                // Calculate actual student count from views
                $topic->students = $topic->lessonViews()->distinct('user_id')->count();
                $topic->lessons = $topic->lessons_count;
                return $topic;
            });

        return response()->json($topics);
    }

    public function show($id)
    {
        $topic = Topic::with(['lessons', 'assessments'])
            ->withCount(['lessons', 'lessonViews', 'lessonCompletions'])
            ->findOrFail($id);

        // Calculate actual student count
        $topic->students = $topic->lessonViews()->distinct('user_id')->count();
        $topic->lessons = $topic->lessons_count;

        return response()->json($topic);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'status' => 'required|in:Published,Draft',
            'difficulty' => 'required|in:Beginner,Intermediate,Advanced',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'has_assessment' => 'boolean',
        ]);

        $topic = Topic::create($validated);

        return response()->json($topic, 201);
    }

    public function update(Request $request, $id)
    {
        $topic = Topic::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:Published,Draft',
            'difficulty' => 'sometimes|in:Beginner,Intermediate,Advanced',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'has_assessment' => 'sometimes|boolean',
        ]);

        $topic->update($validated);

        return response()->json($topic);
    }

    public function destroy($id)
    {
        $topic = Topic::findOrFail($id);
        $topic->delete();

        return response()->json(['message' => 'Topic deleted successfully']);
    }

    public function getStudentDetails($id)
    {
        $topic = Topic::findOrFail($id);

        // Get all users who have interacted with this topic
        $userIds = collect()
            ->merge($topic->lessonViews()->pluck('user_id'))
            ->merge($topic->lessonCompletions()->pluck('user_id'))
            ->merge($topic->assessmentAttempts()->pluck('user_id'))
            ->unique();

        $students = [];
        foreach ($userIds as $userId) {
            $user = \App\Models\User::find($userId);
            if ($user) {
                $students[] = [
                    'id' => $user->id,
                    'name' => $user->name,
                    'hasViewed' => $topic->lessonViews()->where('user_id', $userId)->exists(),
                    'hasCompleted' => $topic->lessonCompletions()->where('user_id', $userId)->exists(),
                    'hasAttemptedAssessment' => $topic->assessmentAttempts()->where('user_id', $userId)->exists(),
                ];
            }
        }

        return response()->json([
            'totalStudents' => count($students),
            'studentsWithViews' => $topic->lessonViews()->distinct('user_id')->count(),
            'studentsWithCompletions' => $topic->lessonCompletions()->distinct('user_id')->count(),
            'studentsWithAssessments' => $topic->assessmentAttempts()->distinct('user_id')->count(),
            'studentsList' => $students,
        ]);
    }
}
