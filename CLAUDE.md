# Claude Memory - LMS System

## Project Architecture
- **Frontend**: Next.js application hosted on Vercel
  - Repository: `JamesNgo0710/lms-system`
  - Deployment: Vercel (https://lms-system-xkit.vercel.app)
  - Framework: Next.js with TypeScript

- **Backend**: Laravel API hosted on Laravel Cloud
  - Repository: `JamesNgo0710/lms-backend`
  - Deployment: Laravel Cloud (https://learning-management-system-master-zcttuk.laravel.cloud)
  - Database: PostgreSQL 17 (serverless)

## Key Configuration
- Frontend and backend are separate repositories
- Authentication: NextAuth.js (frontend) + Laravel Sanctum (backend)
- Database: PostgreSQL 17 serverless on Laravel Cloud
- Role system: Admin, Teacher, Student roles using Spatie Laravel Permission

## Development Commands
- Frontend: `npm run dev` (Next.js)
- Backend: `php artisan serve` (Laravel)
- Database: Use Laravel migrations and seeders

## Recent Work & Solutions (Latest Session)
### Coding Curriculum Content
- Created comprehensive coding curriculum scripts in `scripts/` folder
- 6 progressive topics: Intro to Programming → HTML/CSS → JavaScript → React → Node.js → Database Design
- All content uses online images (Unsplash) to avoid storage costs
- Population script ready but requires valid admin credentials

### Technical Issues Fixed
1. **canTakeAssessment Bug**: Fixed undefined `assessments` variable in `hooks/use-api-data-store.ts:327`
2. **API URL Truncation**: Environment variable gets truncated on Vercel ("learning-management-syst")
   - Fixed with auto-detection and correction in `lib/config.ts`
3. **404 Assessment Errors**: Reduced console spam by returning `null` for missing assessments instead of throwing errors

### Key Files Created/Modified
- `scripts/populate-coding-curriculum.js` - Complete curriculum population script
- `scripts/test-backend.js` - Backend connectivity testing
- `hooks/use-api-data-store.ts` - Fixed canTakeAssessment function
- `lib/config.ts` - Added API URL truncation fix
- `lib/api-data-store.ts` - Improved 404 error handling

### Authentication Status
- Backend authentication works with CSRF cookies
- Population script ready but needs valid admin credentials
- Multiple test credentials attempted but failed (no register endpoint exists)

### Content Structure Created
Each topic includes:
- Detailed descriptions and learning objectives
- Multiple lessons with code examples
- Comprehensive assessments with questions
- Online images from Unsplash (cost-free)
- Progressive difficulty levels

## Common Issues to Remember
- Students should only see Published topics/lessons/assessments
- Role-based filtering is implemented in backend controllers
- Environment variables need to be configured for production URLs
- Database seeders use `firstOrCreate()` to handle existing data
- Vercel sometimes truncates long environment variable values
- Missing assessments return 404s (now handled gracefully)

## Git Workflow Reminder
**IMPORTANT**: Always push changes to the appropriate repository after making commits:
- Frontend changes: Push to `JamesNgo0710/lms-system` repository
- Backend changes: Push to `JamesNgo0710/lms-backend` repository
- Both repositories are separate and need individual pushes
- Changes are deployed automatically via Vercel (frontend) and Laravel Cloud (backend)