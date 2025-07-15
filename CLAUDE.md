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

## Common Issues to Remember
- Students should only see Published topics/lessons/assessments
- Role-based filtering is implemented in backend controllers
- Environment variables need to be configured for production URLs
- Database seeders use `firstOrCreate()` to handle existing data

## Git Workflow Reminder
**IMPORTANT**: Always push changes to the appropriate repository after making commits:
- Frontend changes: Push to `JamesNgo0710/lms-system` repository
- Backend changes: Push to `JamesNgo0710/lms-backend` repository
- Both repositories are separate and need individual pushes
- Changes are deployed automatically via Vercel (frontend) and Laravel Cloud (backend)