# 📡 LMS System API Documentation

> **Complete API reference for the Learning Management System**

## 🌐 Base Information

- **Base URL**: `http://localhost:8000/api` (development)
- **Authentication**: Bearer Token (Laravel Sanctum)
- **Content-Type**: `application/json`
- **Response Format**: JSON

## 🔐 Authentication

### Login
```http
POST /api/login
```

**Request Body:**
```json
{
  "email": "admin@lms.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "admin@lms.com",
    "first_name": "Admin",
    "last_name": "User",
    "name": "Admin User",
    "role": "admin",
    "profile_image": null,
    "roles": [
      {
        "id": 1,
        "name": "admin",
        "guard_name": "web"
      }
    ]
  },
  "token": "1|abcdef123456..."
}
```

### Get Current User
```http
GET /api/user
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "email": "admin@lms.com",
  "first_name": "Admin",
  "last_name": "User",
  "name": "Admin User",
  "role": "admin",
  "roles": [...]
}
```

### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## 👥 User Management

### List Users (Admin Only)
```http
GET /api/users
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "email": "admin@lms.com",
    "first_name": "Admin",
    "last_name": "User",
    "name": "Admin User",
    "role": "admin",
    "profile_image": null,
    "joined_date": "2025-07-09",
    "completed_topics": 0,
    "total_topics": 0,
    "roles": [...]
  }
]
```

### Create User (Admin Only)
```http
POST /api/users
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

### Get User Details
```http
GET /api/users/{id}
Authorization: Bearer {token}
```

### Update User
```http
PUT /api/users/{id}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "first_name": "Updated Name",
  "last_name": "Updated Last",
  "email": "updated@example.com",
  "profile_image": "base64_image_string"
}
```

### Update User Password
```http
PUT /api/users/{id}/password
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

### Delete User (Admin Only)
```http
DELETE /api/users/{id}
Authorization: Bearer {token}
```

## 📚 Topics & Lessons

### List Topics
```http
GET /api/topics
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Introduction to Programming",
    "description": "Learn the basics of programming",
    "difficulty": "beginner",
    "estimated_duration": 120,
    "is_published": true,
    "created_at": "2025-01-19T00:00:00.000000Z",
    "lessons_count": 5
  }
]
```

### Create Topic (Teacher/Admin)
```http
POST /api/topics
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Advanced JavaScript",
  "description": "Deep dive into JavaScript concepts",
  "difficulty": "advanced",
  "estimated_duration": 240,
  "is_published": true
}
```

### Get Topic Details
```http
GET /api/topics/{id}
Authorization: Bearer {token}
```

### Update Topic (Teacher/Admin)
```http
PUT /api/topics/{id}
Authorization: Bearer {token}
```

### Delete Topic (Admin Only)
```http
DELETE /api/topics/{id}
Authorization: Bearer {token}
```

### Get Topic Lessons
```http
GET /api/topics/{topicId}/lessons
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "topic_id": 1,
    "title": "Variables and Data Types",
    "content": "Lesson content here...",
    "order": 1,
    "estimated_duration": 30,
    "is_published": true,
    "completion_status": "completed"
  }
]
```

### Get Topic Student Details
```http
GET /api/topics/{id}/students
Authorization: Bearer {token}
```

## 📝 Lessons

### List All Lessons (Teacher/Admin)
```http
GET /api/lessons
Authorization: Bearer {token}
```

### Create Lesson (Teacher/Admin)
```http
POST /api/lessons
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "topic_id": 1,
  "title": "Functions in JavaScript",
  "content": "Detailed lesson content...",
  "order": 2,
  "estimated_duration": 45,
  "is_published": true
}
```

### Get Lesson Details
```http
GET /api/lessons/{id}
Authorization: Bearer {token}
```

### Update Lesson (Teacher/Admin)
```http
PUT /api/lessons/{id}
Authorization: Bearer {token}
```

### Delete Lesson (Teacher/Admin)
```http
DELETE /api/lessons/{id}
Authorization: Bearer {token}
```

### Mark Lesson Complete
```http
POST /api/lessons/{id}/complete
Authorization: Bearer {token}
```

### Mark Lesson Incomplete
```http
DELETE /api/lessons/{id}/complete
Authorization: Bearer {token}
```

### Track Lesson View
```http
POST /api/lessons/{id}/view
Authorization: Bearer {token}
```

## 📊 Assessments

### List Assessments (Teacher/Admin)
```http
GET /api/assessments
Authorization: Bearer {token}
```

### Create Assessment (Teacher/Admin)
```http
POST /api/assessments
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "topic_id": 1,
  "title": "JavaScript Basics Quiz",
  "description": "Test your JavaScript knowledge",
  "time_limit": 30,
  "max_attempts": 3,
  "passing_score": 70,
  "is_published": true,
  "questions": [
    {
      "question": "What is a variable?",
      "type": "multiple_choice",
      "options": ["A storage location", "A function", "A loop", "An object"],
      "correct_answer": "A storage location",
      "points": 10
    }
  ]
}
```

### Get Topic Assessment
```http
GET /api/topics/{topicId}/assessment
Authorization: Bearer {token}
```

### Get Assessment Details
```http
GET /api/assessments/{id}
Authorization: Bearer {token}
```

### Submit Assessment Attempt
```http
POST /api/assessments/{id}/submit
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "answers": [
    {
      "question_id": 1,
      "answer": "A storage location"
    },
    {
      "question_id": 2,
      "answer": "To store data"
    }
  ]
}
```

**Response:**
```json
{
  "attempt": {
    "id": 1,
    "assessment_id": 1,
    "user_id": 1,
    "score": 85,
    "total_points": 100,
    "passed": true,
    "completed_at": "2025-07-13T10:30:00.000000Z"
  },
  "results": [
    {
      "question_id": 1,
      "user_answer": "A storage location",
      "correct_answer": "A storage location",
      "is_correct": true,
      "points_earned": 10
    }
  ]
}
```

### Get User Assessment Attempts
```http
GET /api/assessments/{id}/attempts
Authorization: Bearer {token}
```

### Get Specific Attempt Results
```http
GET /api/assessments/{assessmentId}/attempts/{attemptId}
Authorization: Bearer {token}
```

## 💬 Community Forum

### List Forum Posts
```http
GET /api/community/posts
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20, max: 100)
- `sort` - Sort by: `latest`, `popular`, `oldest` (default: latest)
- `filter` - Filter by: `all`, `pinned`, `locked` (default: all)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Welcome to the community!",
      "content": "This is our first post...",
      "author": {
        "id": 1,
        "name": "Admin User",
        "profile_image": null
      },
      "votes_score": 5,
      "comments_count": 3,
      "is_pinned": true,
      "is_locked": false,
      "is_hidden": false,
      "created_at": "2025-07-13T10:00:00.000000Z",
      "user_vote": null,
      "user_bookmarked": false
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 25,
    "per_page": 20,
    "last_page": 2
  }
}
```

### Create Forum Post
```http
POST /api/community/posts
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Need help with JavaScript",
  "content": "I'm struggling with understanding closures..."
}
```

### Get Post Details
```http
GET /api/community/posts/{id}
```

**Response:**
```json
{
  "id": 1,
  "title": "Welcome to the community!",
  "content": "This is our first post...",
  "author": {
    "id": 1,
    "name": "Admin User",
    "profile_image": null
  },
  "votes_score": 5,
  "comments_count": 3,
  "is_pinned": true,
  "is_locked": false,
  "is_hidden": false,
  "created_at": "2025-07-13T10:00:00.000000Z",
  "user_vote": "up",
  "user_bookmarked": true,
  "comments": [
    {
      "id": 1,
      "content": "Great post! Thanks for sharing.",
      "author": {
        "id": 2,
        "name": "Student User"
      },
      "votes_score": 2,
      "created_at": "2025-07-13T10:15:00.000000Z",
      "user_vote": null,
      "replies": []
    }
  ]
}
```

### Update Post (Author/Admin)
```http
PUT /api/community/posts/{id}
Authorization: Bearer {token}
```

### Delete Post (Author/Admin)
```http
DELETE /api/community/posts/{id}
Authorization: Bearer {token}
```

### Get Post Comments
```http
GET /api/community/posts/{id}/comments
```

### Create Comment
```http
POST /api/community/posts/{id}/comments
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "content": "This is a helpful comment!",
  "parent_id": null
}
```

### Update Comment (Author/Admin)
```http
PUT /api/community/comments/{id}
Authorization: Bearer {token}
```

### Delete Comment (Author/Admin)
```http
DELETE /api/community/comments/{id}
Authorization: Bearer {token}
```

### Vote on Post/Comment
```http
POST /api/community/vote
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "votable_type": "post",
  "votable_id": 1,
  "vote_type": "up"
}
```

**Vote Types:**
- `up` - Upvote
- `down` - Downvote
- `null` - Remove vote

### Bookmark Post
```http
POST /api/community/posts/{id}/bookmark
Authorization: Bearer {token}
```

**Response:**
```json
{
  "bookmarked": true,
  "message": "Post bookmarked successfully"
}
```

### Get User Bookmarks
```http
GET /api/community/bookmarks
Authorization: Bearer {token}
```

### Report Content
```http
POST /api/community/report
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "reportable_type": "post",
  "reportable_id": 1,
  "reason": "spam",
  "description": "This post contains spam content"
}
```

**Report Reasons:**
- `spam`
- `harassment`
- `inappropriate`
- `misinformation`
- `other`

## 🛡️ Admin Community Moderation

### Get Reports (Admin Only)
```http
GET /api/community/reports
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` - Filter by status: `pending`, `reviewed`, `resolved`
- `reason` - Filter by reason: `spam`, `harassment`, etc.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "reporter": {
        "id": 2,
        "name": "Student User"
      },
      "reportable_type": "post",
      "reportable_id": 1,
      "reason": "spam",
      "description": "This post contains spam content",
      "status": "pending",
      "created_at": "2025-07-13T11:00:00.000000Z",
      "reportable": {
        "id": 1,
        "title": "Spam Post",
        "author": {
          "name": "Some User"
        }
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 5,
    "per_page": 20
  }
}
```

### Update Report Status (Admin Only)
```http
PUT /api/community/reports/{id}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "resolved",
  "admin_notes": "Spam post removed and user warned"
}
```

### Pin/Unpin Post (Admin Only)
```http
POST /api/community/posts/{id}/pin
Authorization: Bearer {token}
```

### Lock/Unlock Post (Admin Only)
```http
POST /api/community/posts/{id}/lock
Authorization: Bearer {token}
```

### Hide/Show Post (Admin Only)
```http
POST /api/community/posts/{id}/hide
Authorization: Bearer {token}
```

### Hide Comment (Admin Only)
```http
POST /api/community/comments/{id}/hide
Authorization: Bearer {token}
```

## 📊 API Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

### Paginated Response
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "per_page": 20,
    "to": 20,
    "total": 100
  },
  "links": {
    "first": "http://localhost:8000/api/posts?page=1",
    "last": "http://localhost:8000/api/posts?page=5",
    "prev": null,
    "next": "http://localhost:8000/api/posts?page=2"
  }
}
```

## 🔧 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content returned |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation errors |
| 500 | Internal Server Error - Server error |

## 🧪 Testing the API

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email": "admin@lms.com", "password": "admin123"}'
```

**Authenticated Request:**
```bash
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Using JavaScript (Axios)

```javascript
// Login
const response = await axios.post('/api/login', {
  email: 'admin@lms.com',
  password: 'admin123'
});

const token = response.data.token;

// Set default authorization header
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Make authenticated requests
const users = await axios.get('/api/users');
```

## 📝 Rate Limiting

- **Default**: 60 requests per minute per IP
- **Authenticated**: 1000 requests per minute per user
- **Headers**: Rate limit info included in response headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1641234567
```

## 🔍 Error Handling

The API returns consistent error responses with appropriate HTTP status codes and descriptive messages.

**Validation Error Example:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

**Authentication Error:**
```json
{
  "message": "Unauthenticated."
}
```

**Authorization Error:**
```json
{
  "message": "This action is unauthorized."
}
```

---

## 📚 Additional Resources

- **API Testing**: Use [Postman Collection](link-to-postman) for easy testing
- **API Playground**: Visit http://localhost:8000/api for endpoint overview
- **Laravel Documentation**: [Laravel API Resources](https://laravel.com/docs/eloquent-resources)
- **Sanctum Documentation**: [Laravel Sanctum](https://laravel.com/docs/sanctum)

This API documentation covers all current endpoints. For the most up-to-date information, refer to the Laravel route list: `php artisan route:list`