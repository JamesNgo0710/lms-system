# Community Functionality Test Plan

## Overview
This document outlines all the community features and provides a test plan to verify they work correctly for both admin and student users.

## Test Environment Setup
1. Start development server: `npm run dev -- --port 3001`
2. Login as admin: `admin@lms.com` / `admin123`
3. Login as student: `student@lms.com` / `student123`

## Community Features to Test

### 1. Community Main Page (`/dashboard/community`)

#### A. Basic Display Features
- [ ] **Community Stats Display**
  - Total Discussions count
  - Active Members count
  - Total Replies count
  
- [ ] **Popular Categories**
  - Category badges display with counts
  - Hover effect on category badges
  - Fallback categories when no posts exist

- [ ] **Recent Discussions List**
  - Posts display in chronological order (newest first)
  - Post titles, authors, categories, timestamps
  - View counts display
  - Answered/Pinned badges display correctly

#### B. Interactive Features
- [ ] **Post Creation (Both Admin & Student)**
  - Click "Start New Discussion" button
  - Fill out form (title, content, category, tags)
  - Form validation (required fields, length limits)
  - Successfully create post
  - New post appears in discussions list

- [ ] **Post Interaction (Both Admin & Student)**
  - Click on post to navigate to post detail page
  - View count increments when clicking on post
  - Like/Unlike posts from main page
  - Like count updates immediately
  - Like button shows correct state (liked/not liked)

#### C. Sidebar Features
- [ ] **Top Contributors**
  - Display ranking with reputation points
  - Badge levels (Beginner/Advanced/Expert)
  - Shows "No contributors yet" when empty

- [ ] **Community Guidelines**
  - Guidelines display correctly
  - Readable formatting

- [ ] **User Role Info**
  - Shows correct role (Administrator/Student)
  - Shows appropriate role description

### 2. Individual Post Page (`/dashboard/community/[id]`)

#### A. Post Display
- [ ] **Post Header**
  - Back to Community button works
  - Post title displays correctly
  - Author information with avatar
  - Post creation timestamp
  - View count display
  - Category and status badges

- [ ] **Post Content**
  - Post content displays with proper formatting
  - Tags display correctly (if present)
  - Pinned/Answered badges show when applicable

#### B. Post Actions
- [ ] **Like/Unlike Post (Both Admin & Student)**
  - Like button toggles correctly
  - Like count updates immediately
  - Button shows correct state (liked/not liked)
  - Requires login (shows alert if not logged in)

- [ ] **Admin Actions (Admin Only)**
  - Pin/Unpin post functionality
  - Button text changes based on current state
  - Button styling changes when active
  - Close/Reopen post functionality
  - Button text changes based on current state
  - Button styling changes when active
  - Only visible to admin users

#### C. Replies Section
- [ ] **Reply Form**
  - Main reply form appears
  - Textarea accepts input
  - Submit button works
  - Form disabled when post is closed
  - "Post is closed" message appears for closed posts
  - Reply count updates after posting

- [ ] **Reply Display**
  - Replies display in chronological order
  - Author information with avatars
  - Reply timestamps
  - Reply content with proper formatting
  - Nested/threaded replies display correctly

- [ ] **Reply Interactions (Both Admin & Student)**
  - Like/Unlike replies
  - Reply to specific replies (nested replies)
  - Expand/collapse reply threads
  - Reply count badges show correct numbers

- [ ] **Reply Actions (Post Author Only)**
  - "Accept Answer" button visible only to post author
  - Accepting answer marks reply with green "Accepted Answer" badge
  - Only one answer can be accepted per post
  - Post shows "Answered" badge after accepting answer

### 3. Post Creation Modal

#### A. Form Validation
- [ ] **Required Fields**
  - Title (minimum 5 characters, maximum 200 characters)
  - Content (minimum 10 characters)
  - Category (must select from dropdown)

- [ ] **Optional Fields**
  - Tags (up to 5 tags allowed)
  - Tag input accepts Enter key
  - Tags can be removed with X button

#### B. Form Submission
- [ ] **Success Case**
  - Form submits successfully
  - Modal closes after submission
  - New post appears in community list
  - Form fields reset after submission

- [ ] **Error Handling**
  - Validation errors show for invalid fields
  - Form remains open if validation fails
  - User must be logged in to submit

### 4. Permission-Based Features

#### A. Admin-Only Features
- [ ] **Pin/Unpin Posts**
  - Admin can pin posts (shows "Pinned" badge)
  - Admin can unpin posts (removes "Pinned" badge)
  - Pinned posts appear with special styling
  - Student users cannot see pin buttons

- [ ] **Close/Reopen Posts**
  - Admin can close posts (shows "Closed" status)
  - Admin can reopen posts (changes to "Active" status)
  - Closed posts prevent new replies
  - Student users cannot see close buttons

#### B. Post Author Features
- [ ] **Accept Answers**
  - Post author can accept replies as answers
  - Only post author sees "Accept Answer" buttons
  - Accepted answers show green badge
  - Post shows "Answered" badge after accepting

#### C. General User Features
- [ ] **Creating Posts**
  - Both admin and student can create posts
  - Posts show correct author information
  - Posts appear in community feed

- [ ] **Replying to Posts**
  - Both admin and student can reply to posts
  - Cannot reply to closed posts
  - Replies show correct author information

- [ ] **Liking Posts/Replies**
  - Both admin and student can like posts/replies
  - Cannot like without being logged in
  - Like state persists across page loads

### 5. Data Persistence

#### A. Local Storage
- [ ] **Posts Persist**
  - Created posts remain after page refresh
  - Like states persist after page refresh
  - View counts persist after page refresh

- [ ] **Replies Persist**
  - Created replies remain after page refresh
  - Reply like states persist after page refresh
  - Accepted answer states persist after page refresh

#### B. Real-time Updates
- [ ] **Stats Update**
  - Community stats update after creating posts/replies
  - Top contributors update based on activity
  - Category counts update appropriately

## Test Execution Checklist

### Phase 1: Admin User Testing
1. Login as admin (`admin@lms.com` / `admin123`)
2. Test all community features listed above
3. Verify admin-only features work correctly
4. Test post creation, liking, and replying
5. Test admin actions (pin/unpin, close/reopen)

### Phase 2: Student User Testing
1. Login as student (`student@lms.com` / `student123`)
2. Test all community features listed above
3. Verify student features work correctly
4. Verify admin-only features are hidden
5. Test post creation, liking, and replying

### Phase 3: Cross-User Testing
1. Create posts as admin, interact as student
2. Create posts as student, interact as admin
3. Test reply chains between different users
4. Test answer acceptance by post authors

### Phase 4: Edge Cases
1. Test with no posts/replies
2. Test with very long content
3. Test with special characters
4. Test form validation edge cases
5. Test closed post behavior

## Expected Results

All features should work correctly for both admin and student users, with appropriate permission restrictions in place. The community should feel responsive and interactive, with proper feedback for all user actions.

## Bug Reporting

If any functionality doesn't work as expected, note:
1. User role being tested
2. Specific action attempted
3. Expected vs actual behavior
4. Any error messages displayed
5. Browser console errors (if any) 