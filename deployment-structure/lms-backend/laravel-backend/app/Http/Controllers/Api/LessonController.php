<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use App\Models\LessonView;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function index()
    {
        $lessons = Lesson::with(['topic', 'completions', 'views'])->get();
        return response()->json($lessons);
    }

    public function show($id)
    {
        $lesson = Lesson::with(['topic', 'completions', 'views'])->findOrFail($id);
        return response()->json($lesson);
    }

    public function getByTopic($topicId)
    {
        $lessons = Lesson::where('topic_id', $topicId)
            ->with(['completions', 'views'])
            ->orderBy('order')
            ->get();

        // Add completion status for current user if authenticated
        if (auth()->check()) {
            $userId = auth()->id();
            $lessons = $lessons->map(function ($lesson) use ($userId) {
                $lesson->is_completed = $lesson->isCompletedBy($userId);
                $lesson->completion = $lesson->getCompletionFor($userId);
                return $lesson;
            });
        }

        return response()->json($lessons);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'duration' => 'required|string',
            'difficulty' => 'required|in:Beginner,Intermediate,Advanced',
            'video_url' => 'nullable|string',
            'prerequisites' => 'nullable|array',
            'content' => 'required|string',
            'social_links' => 'nullable|array',
            'downloads' => 'nullable|array',
            'order' => 'required|integer',
            'status' => 'required|in:Published,Draft',
            'image' => 'nullable|string',
        ]);

        $lesson = Lesson::create($validated);

        return response()->json($lesson, 201);
    }

    public function update(Request $request, $id)
    {
        $lesson = Lesson::findOrFail($id);

        $validated = $request->validate([
            'topic_id' => 'sometimes|exists:topics,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'duration' => 'sometimes|string',
            'difficulty' => 'sometimes|in:Beginner,Intermediate,Advanced',
            'video_url' => 'nullable|string',
            'prerequisites' => 'nullable|array',
            'content' => 'sometimes|string',
            'social_links' => 'nullable|array',
            'downloads' => 'nullable|array',
            'order' => 'sometimes|integer',
            'status' => 'sometimes|in:Published,Draft',
            'image' => 'nullable|string',
        ]);

        $lesson->update($validated);

        return response()->json($lesson);
    }

    public function destroy($id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->delete();

        return response()->json(['message' => 'Lesson deleted successfully']);
    }

    public function markComplete(Request $request, $id)
    {
        $lesson = Lesson::findOrFail($id);
        $userId = auth()->id();

        $validated = $request->validate([
            'time_spent' => 'nullable|integer|min:0',
        ]);

        // Check if already completed
        $existing = LessonCompletion::where('user_id', $userId)
            ->where('lesson_id', $id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Lesson already completed']);
        }

        $completion = LessonCompletion::create([
            'user_id' => $userId,
            'lesson_id' => $id,
            'topic_id' => $lesson->topic_id,
            'time_spent' => $validated['time_spent'] ?? null,
            'completed_at' => now(),
        ]);

        return response()->json($completion, 201);
    }

    public function markIncomplete($id)
    {
        $userId = auth()->id();

        $completion = LessonCompletion::where('user_id', $userId)
            ->where('lesson_id', $id)
            ->first();

        if ($completion) {
            $completion->delete();
            return response()->json(['message' => 'Lesson marked as incomplete']);
        }

        return response()->json(['message' => 'Lesson was not completed'], 404);
    }

    public function trackView(Request $request, $id)
    {
        $lesson = Lesson::findOrFail($id);
        $userId = auth()->id();

        $validated = $request->validate([
            'duration' => 'nullable|integer|min:0',
        ]);

        $view = LessonView::create([
            'user_id' => $userId,
            'lesson_id' => $id,
            'topic_id' => $lesson->topic_id,
            'duration' => $validated['duration'] ?? null,
            'viewed_at' => now(),
        ]);

        return response()->json($view, 201);
    }
}
