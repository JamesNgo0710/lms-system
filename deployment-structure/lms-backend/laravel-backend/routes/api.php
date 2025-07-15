<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TopicController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\AssessmentController;
use App\Http\Controllers\Api\CommunityController;
use App\Http\Controllers\Api\AchievementController;

// API Welcome route
Route::get('/', function () {
    return response()->json([
        'message' => 'LMS System API v1.0',
        'status' => 'active',
        'endpoints' => [
            // Authentication
            'POST /api/login' => 'User login',
            'GET /api/user' => 'Get current user (authenticated)',
            'POST /api/logout' => 'User logout (authenticated)',

            // User Management
            'GET /api/users' => 'List all users (admin only)',
            'POST /api/users' => 'Create new user (admin only)',
            'GET /api/users/{id}' => 'Get user details',
            'PUT /api/users/{id}' => 'Update user',
            'DELETE /api/users/{id}' => 'Delete user (admin only)',
            'PUT /api/users/{id}/password' => 'Update user password',
            'GET /api/users/{id}/lesson-completions' => 'Get user lesson completions',
            'GET /api/users/{id}/lesson-views' => 'Get user lesson views',
            'GET /api/users/{id}/assessment-attempts' => 'Get user assessment attempts',
            'GET /api/users/{id}/topics/{topicId}/progress' => 'Get user topic progress',

            // Topics
            'GET /api/topics' => 'List all topics',
            'POST /api/topics' => 'Create topic (admin/teacher)',
            'GET /api/topics/{id}' => 'Get topic details',
            'PUT /api/topics/{id}' => 'Update topic (admin/teacher)',
            'DELETE /api/topics/{id}' => 'Delete topic (admin only)',
            'GET /api/topics/{id}/students' => 'Get topic student details',

            // Lessons
            'GET /api/lessons' => 'List all lessons (admin/teacher)',
            'POST /api/lessons' => 'Create lesson (admin/teacher)',
            'GET /api/topics/{topicId}/lessons' => 'Get lessons by topic',
            'GET /api/lessons/{id}' => 'Get lesson details',
            'PUT /api/lessons/{id}' => 'Update lesson (admin/teacher)',
            'DELETE /api/lessons/{id}' => 'Delete lesson (admin/teacher)',
            'POST /api/lessons/{id}/complete' => 'Mark lesson complete',
            'DELETE /api/lessons/{id}/complete' => 'Mark lesson incomplete',
            'POST /api/lessons/{id}/view' => 'Track lesson view',

            // Assessments
            'GET /api/assessments' => 'List all assessments (admin/teacher)',
            'POST /api/assessments' => 'Create assessment (admin/teacher)',
            'GET /api/topics/{topicId}/assessment' => 'Get assessment by topic',
            'GET /api/assessments/{id}' => 'Get assessment details',
            'PUT /api/assessments/{id}' => 'Update assessment (admin/teacher)',
            'DELETE /api/assessments/{id}' => 'Delete assessment (admin/teacher)',
            'POST /api/assessments/{id}/submit' => 'Submit assessment attempt',
            'GET /api/assessments/{id}/attempts' => 'Get user attempts',
            'GET /api/assessments/{assessmentId}/attempts/{attemptId}' => 'Get attempt results',

            // Achievements
            'GET /api/achievements' => 'List all achievements',
            'GET /api/users/{userId}/achievements' => 'Get user achievements',
            'GET /api/users/{userId}/achievements/{achievementId}' => 'Check if user has achievement',
            'POST /api/users/{userId}/achievements/{achievementId}' => 'Award achievement to user (admin only)',

            // Community Forum
            'GET /api/community/posts' => 'List forum posts',
            'POST /api/community/posts' => 'Create forum post (authenticated)',
            'GET /api/community/posts/{id}' => 'Get post details',
            'PUT /api/community/posts/{id}' => 'Update post (author/admin)',
            'DELETE /api/community/posts/{id}' => 'Delete post (author/admin)',
            'GET /api/community/posts/{id}/comments' => 'Get post comments',
            'POST /api/community/posts/{id}/comments' => 'Create comment (authenticated)',
            'PUT /api/community/comments/{id}' => 'Update comment (author/admin)',
            'DELETE /api/community/comments/{id}' => 'Delete comment (author/admin)',
            'POST /api/community/vote' => 'Vote on post/comment (authenticated)',
            'POST /api/community/posts/{id}/pin' => 'Pin/unpin post (admin)',
            'POST /api/community/posts/{id}/lock' => 'Lock/unlock post (admin)',
            'POST /api/community/posts/{id}/hide' => 'Hide/show post (admin)',
            'POST /api/community/comments/{id}/hide' => 'Hide/show comment (admin)',
        ]
    ]);
});

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Community routes - public access
Route::prefix('community')->group(function () {
    // Public viewing (no auth required)
    Route::get('/posts', [CommunityController::class, 'getPosts']);
    Route::get('/posts/{id}', [CommunityController::class, 'getPost']);
    Route::get('/posts/{id}/comments', [CommunityController::class, 'getComments']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // User management routes with proper middleware
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });

    // Routes accessible to users themselves or admins
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::put('/users/{user}/password', [UserController::class, 'updatePassword']);
    
    // User progress tracking routes
    Route::get('/users/{user}/lesson-completions', [UserController::class, 'getLessonCompletions']);
    Route::get('/users/{user}/lesson-views', [UserController::class, 'getLessonViews']);
    Route::get('/users/{user}/assessment-attempts', [UserController::class, 'getAssessmentAttempts']);
    Route::get('/users/{user}/topics/{topicId}/progress', [UserController::class, 'getTopicProgress']);

    // Topic routes
    Route::get('/topics', [TopicController::class, 'index']);
    Route::get('/topics/{id}', [TopicController::class, 'show']);
    Route::get('/topics/{id}/students', [TopicController::class, 'getStudentDetails']);

    Route::middleware('role:admin|teacher')->group(function () {
        Route::post('/topics', [TopicController::class, 'store']);
        Route::put('/topics/{id}', [TopicController::class, 'update']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::delete('/topics/{id}', [TopicController::class, 'destroy']);
    });

    // Lesson routes
    Route::get('/topics/{topicId}/lessons', [LessonController::class, 'getByTopic']);
    Route::get('/lessons/{id}', [LessonController::class, 'show']);
    Route::post('/lessons/{id}/complete', [LessonController::class, 'markComplete']);
    Route::delete('/lessons/{id}/complete', [LessonController::class, 'markIncomplete']);
    Route::post('/lessons/{id}/view', [LessonController::class, 'trackView']);

    Route::middleware('role:admin|teacher')->group(function () {
        Route::get('/lessons', [LessonController::class, 'index']);
        Route::post('/lessons', [LessonController::class, 'store']);
        Route::put('/lessons/{id}', [LessonController::class, 'update']);
        Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
    });

    // Assessment routes
    Route::get('/topics/{topicId}/assessment', [AssessmentController::class, 'getByTopic']);
    Route::get('/assessments/{id}', [AssessmentController::class, 'show']);
    Route::post('/assessments/{id}/submit', [AssessmentController::class, 'submitAttempt']);
    Route::get('/assessments/{id}/attempts', [AssessmentController::class, 'getAttempts']);
    Route::get('/assessments/{assessmentId}/attempts/{attemptId}', [AssessmentController::class, 'getAttemptResults']);

    Route::middleware('role:admin|teacher')->group(function () {
        Route::get('/assessments', [AssessmentController::class, 'index']);
        Route::post('/assessments', [AssessmentController::class, 'store']);
        Route::put('/assessments/{id}', [AssessmentController::class, 'update']);
        Route::delete('/assessments/{id}', [AssessmentController::class, 'destroy']);
    });

    // Achievement routes
    Route::get('/achievements', [AchievementController::class, 'index']);
    Route::get('/users/{userId}/achievements', [AchievementController::class, 'getUserAchievements']);
    Route::get('/users/{userId}/achievements/{achievementId}', [AchievementController::class, 'checkUserAchievement']);
    
    Route::middleware('role:admin')->group(function () {
        Route::post('/users/{userId}/achievements/{achievementId}', [AchievementController::class, 'awardAchievement']);
    });

        // Community routes - authenticated user actions
    Route::prefix('community')->group(function () {
        // Authenticated user actions
        Route::post('/posts', [CommunityController::class, 'createPost']);
        Route::put('/posts/{id}', [CommunityController::class, 'updatePost']);
        Route::delete('/posts/{id}', [CommunityController::class, 'deletePost']);
        Route::post('/posts/{id}/comments', [CommunityController::class, 'createComment']);
        Route::put('/comments/{id}', [CommunityController::class, 'updateComment']);
        Route::delete('/comments/{id}', [CommunityController::class, 'deleteComment']);
        Route::post('/vote', [CommunityController::class, 'vote']);
        
        // Bookmark routes
        Route::post('/posts/{id}/bookmark', [CommunityController::class, 'toggleBookmark']);
        Route::get('/bookmarks', [CommunityController::class, 'getUserBookmarks']);
        
        // Report routes
        Route::post('/report', [CommunityController::class, 'reportContent']);

        // Admin-only actions
        Route::middleware('role:admin')->group(function () {
            Route::post('/posts/{id}/pin', [CommunityController::class, 'togglePin']);
            Route::post('/posts/{id}/lock', [CommunityController::class, 'toggleLock']);
            Route::post('/posts/{id}/hide', [CommunityController::class, 'toggleHide']);
            Route::post('/comments/{id}/hide', [CommunityController::class, 'hideComment']);
            
            // Admin report management
            Route::get('/reports', [CommunityController::class, 'getReports']);
            Route::put('/reports/{id}', [CommunityController::class, 'updateReportStatus']);
        });
    });
});
