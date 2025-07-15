<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\AssessmentAttempt;
use App\Models\Question;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    public function index()
    {
        $assessments = Assessment::with(['topic', 'questions', 'attempts'])->get();
        return response()->json($assessments);
    }

    public function show($id)
    {
        $assessment = Assessment::with(['topic', 'questions', 'attempts'])->findOrFail($id);
        return response()->json($assessment);
    }

    public function getByTopic($topicId)
    {
        $assessment = Assessment::with(['questions', 'attempts'])
            ->where('topic_id', $topicId)
            ->first();

        if (!$assessment) {
            return response()->json(['message' => 'No assessment found for this topic'], 404);
        }

        // Check if user can take assessment
        if (auth()->check()) {
            $canTake = $assessment->canUserTake(auth()->id());
            $assessment->can_take = $canTake['can_take'];
            if (!$canTake['can_take']) {
                $assessment->time_remaining = $canTake['time_remaining'] ?? null;
                $assessment->message = $canTake['message'] ?? null;
            }

            // Get user's last attempt
            $assessment->last_attempt = $assessment->attempts()
                ->where('user_id', auth()->id())
                ->latest('completed_at')
                ->first();
        }

        return response()->json($assessment);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'total_questions' => 'required|integer|min:1',
            'time_limit' => 'required|string',
            'retake_period' => 'required|string',
            'cooldown_period' => 'required|integer|min:1|max:168',
            'questions' => 'required|array|min:1',
            'questions.*.type' => 'required|in:true-false,multiple-choice',
            'questions.*.question' => 'required|string',
            'questions.*.options' => 'required_if:questions.*.type,multiple-choice|array',
            'questions.*.correct_answer' => 'required',
            'questions.*.image' => 'nullable|string',
        ]);

        $assessment = Assessment::create([
            'topic_id' => $validated['topic_id'],
            'total_questions' => $validated['total_questions'],
            'time_limit' => $validated['time_limit'],
            'retake_period' => $validated['retake_period'],
            'cooldown_period' => $validated['cooldown_period'],
        ]);

        // Create questions
        foreach ($validated['questions'] as $index => $questionData) {
            Question::create([
                'assessment_id' => $assessment->id,
                'type' => $questionData['type'],
                'question' => $questionData['question'],
                'options' => $questionData['options'] ?? null,
                'correct_answer' => $questionData['correct_answer'],
                'image' => $questionData['image'] ?? null,
                'order' => $index + 1,
            ]);
        }

        return response()->json($assessment->load('questions'), 201);
    }

    public function update(Request $request, $id)
    {
        $assessment = Assessment::findOrFail($id);

        $validated = $request->validate([
            'total_questions' => 'sometimes|integer|min:1',
            'time_limit' => 'sometimes|string',
            'retake_period' => 'sometimes|string',
            'cooldown_period' => 'sometimes|integer|min:1|max:168',
        ]);

        $assessment->update($validated);

        return response()->json($assessment);
    }

    public function destroy($id)
    {
        $assessment = Assessment::findOrFail($id);
        $assessment->delete();

        return response()->json(['message' => 'Assessment deleted successfully']);
    }

    public function submitAttempt(Request $request, $id)
    {
        $assessment = Assessment::with('questions')->findOrFail($id);
        $userId = auth()->id();

        // Check if user can take assessment
        $canTake = $assessment->canUserTake($userId);
        if (!$canTake['can_take']) {
            return response()->json([
                'message' => $canTake['message'] ?? 'Cannot take assessment at this time',
                'time_remaining' => $canTake['time_remaining'] ?? null
            ], 403);
        }

        $validated = $request->validate([
            'answers' => 'required|array',
            'time_spent' => 'required|integer|min:0',
        ]);

        // Calculate score
        $correctAnswers = 0;
        $questions = $assessment->questions;

        foreach ($questions as $index => $question) {
            $userAnswer = $validated['answers'][$index] ?? null;
            if ($userAnswer == $question->correct_answer) {
                $correctAnswers++;
            }
        }

        $totalQuestions = $questions->count();
        $score = $totalQuestions > 0 ? ($correctAnswers / $totalQuestions) * 100 : 0;

        $attempt = AssessmentAttempt::create([
            'user_id' => $userId,
            'assessment_id' => $id,
            'topic_id' => $assessment->topic_id,
            'score' => round($score, 2),
            'correct_answers' => $correctAnswers,
            'total_questions' => $totalQuestions,
            'time_spent' => $validated['time_spent'],
            'answers' => $validated['answers'],
            'completed_at' => now(),
        ]);

        return response()->json($attempt, 201);
    }

    public function getAttempts($id)
    {
        $assessment = Assessment::findOrFail($id);
        $userId = auth()->id();

        $attempts = $assessment->attempts()
            ->where('user_id', $userId)
            ->orderBy('completed_at', 'desc')
            ->get();

        return response()->json($attempts);
    }

    public function getAttemptResults($assessmentId, $attemptId)
    {
        $attempt = AssessmentAttempt::with(['assessment.questions'])
            ->where('assessment_id', $assessmentId)
            ->where('user_id', auth()->id())
            ->findOrFail($attemptId);

        // Add correct/incorrect flags to questions
        $questions = $attempt->assessment->questions->map(function ($question, $index) use ($attempt) {
            $userAnswer = $attempt->answers[$index] ?? null;
            $question->user_answer = $userAnswer;
            $question->is_correct = $userAnswer == $question->correct_answer;
            return $question;
        });

        $attempt->questions_with_results = $questions;

        return response()->json($attempt);
    }
}
