# LMS Backend Setup Guide

This guide will help you set up the Laravel backend with realistic data and ensure the frontend is completely disconnected from localStorage.

## 📋 Prerequisites

- Laravel backend running on `http://localhost:8000`
- Next.js frontend running on `http://localhost:3000`
- MySQL/PostgreSQL database configured

## 🚀 Step 1: Database Setup

### Option A: SQL Scripts (Recommended)
1. Run the main seeder:
   ```sql
   -- Run in your Laravel database
   mysql -u your_username -p your_database < database-seeder.sql
   ```

2. Add assessment questions:
   ```sql
   -- Run in your Laravel database  
   mysql -u your_username -p your_database < database-questions-seeder.sql
   ```

### Option B: Laravel Artisan Command
1. Copy the content from `laravel-seeder-command.php` into a new Laravel command
2. Create the command:
   ```bash
   cd your-laravel-project
   php artisan make:command SeedLmsData
   ```
3. Replace the generated file content with the provided code
4. Run the seeder:
   ```bash
   php artisan lms:seed-data
   ```

## 🔧 Step 2: Laravel Configuration

### Environment Variables
Add to your Laravel `.env`:
```env
LARAVEL_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### API Routes
Ensure your Laravel `routes/api.php` includes:
```php
// Topics
Route::apiResource('topics', TopicController::class);
Route::get('topics/{topic}/lessons', [TopicController::class, 'lessons']);
Route::get('topics/{topic}/assessment', [TopicController::class, 'assessment']);

// Lessons  
Route::apiResource('lessons', LessonController::class);
Route::post('lessons/{lesson}/complete', [LessonController::class, 'markComplete']);
Route::delete('lessons/{lesson}/complete', [LessonController::class, 'markIncomplete']);
Route::post('lessons/{lesson}/view', [LessonController::class, 'trackView']);

// Assessments
Route::apiResource('assessments', AssessmentController::class);
Route::post('assessments/{assessment}/submit', [AssessmentController::class, 'submit']);
Route::get('assessments/{assessment}/attempts', [AssessmentController::class, 'attempts']);

// Users
Route::apiResource('users', UserController::class);
Route::get('users/{user}/lesson-completions', [UserController::class, 'lessonCompletions']);
Route::get('users/{user}/lesson-views', [UserController::class, 'lessonViews']);
Route::get('users/{user}/assessment-attempts', [UserController::class, 'assessmentAttempts']);
Route::get('users/{user}/topics/{topic}/progress', [UserController::class, 'topicProgress']);
```

## 📊 Step 3: Data Verification

### Test API Connection
1. Run the API test:
   ```bash
   node test-api-connection.js
   ```

2. Expected output:
   ```
   ✅ Topics: 6 items
   ✅ Users: 5 items  
   ✅ Lessons: 12 items
   ✅ Assessments: 5 items
   ```

### Sample Data Included

**Topics (6 total):**
- General Info on Blockchain Tech (Beginner, 3 lessons)
- Getting Started With Crypto (Beginner, 2 lessons)
- Using MetaMask (Beginner, 2 lessons)
- Decentralised Finance (DeFi) (Intermediate, 2 lessons)
- Non-Fungible Tokens (NFTs) (Beginner, 1 lesson)
- Smart Contracts (Advanced, 2 lessons)

**Users (5 total):**
- Admin User (admin@lms.com) - Administrator
- John Doe (john@example.com) - Student with progress
- Jane Smith (jane@example.com) - Student with progress
- Bob Wilson (bob@example.com) - Student with some progress
- Alice Johnson (alice@example.com) - New student

**Progress Data:**
- Lesson completions and views
- Assessment attempts with realistic scores
- Student enrollment tracking

## 🔍 Step 4: Frontend Verification

### Check Data Sources
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Verify no LMS data in localStorage
4. Check Network tab for API calls to Laravel backend

### Expected Behavior
- ✅ Dashboard shows realistic data from database
- ✅ Topics load from Laravel API
- ✅ Student progress reflects database state
- ✅ Creating/editing saves to Laravel backend
- ❌ No localStorage usage for main data

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```php
   // In Laravel config/cors.php
   'paths' => ['api/*'],
   'allowed_origins' => ['http://localhost:3000'],
   'allowed_methods' => ['*'],
   'allowed_headers' => ['*'],
   ```

2. **Authentication Issues**
   - Ensure NextAuth tokens are properly forwarded
   - Check API middleware configuration

3. **Database Connection**
   ```bash
   # Test Laravel database
   php artisan migrate:status
   php artisan tinker
   >>> App\Models\Topic::count()
   ```

4. **API Routes Not Working**
   ```bash
   # Check Laravel routes
   php artisan route:list --name=api
   ```

## 📝 Default Login Credentials

After seeding, you can login with:

**Admin Account:**
- Email: `admin@lms.com`
- Password: `password`

**Student Accounts:**
- Email: `john@example.com` / Password: `password`
- Email: `jane@example.com` / Password: `password`
- Email: `bob@example.com` / Password: `password`
- Email: `alice@example.com` / Password: `password`

## ✅ Success Checklist

- [ ] Database seeded with 6 topics and 12 lessons
- [ ] 5 assessments with questions created
- [ ] 5 users created (1 admin, 4 students)
- [ ] Sample progress data populated
- [ ] Laravel API endpoints responding correctly
- [ ] Frontend loading data from Laravel backend
- [ ] No localStorage usage for main application data
- [ ] Create/edit operations saving to Laravel
- [ ] Student progress tracking working

## 🎯 Final Verification

1. Login as admin and verify all topics are visible
2. Login as student and verify progress tracking
3. Create a new topic - confirm it saves to Laravel
4. Edit an assessment - confirm changes persist
5. Check that student progress updates in real-time

Your LMS system should now be fully connected to the Laravel backend with realistic data!