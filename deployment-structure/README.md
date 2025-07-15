# LMS System Deployment Structure

This directory contains the separated frontend and backend for deployment.

## Frontend (Next.js) - Deploy to Vercel

### Files to copy to new frontend project:
- All root files except `laravel-backend/` folder
- Remove Laravel-related files and folders
- Update environment variables for production

### Deployment Steps:
1. Create new repository for frontend only
2. Copy all files except Laravel backend
3. Update `NEXT_PUBLIC_API_URL` to point to Laravel Cloud URL
4. Deploy to Vercel

## Backend (Laravel) - Deploy to Laravel Cloud

### Files to copy to new backend project:
- Contents of `laravel-backend/` folder becomes root
- Add Laravel Cloud configuration

### Deployment Steps:
1. Create new repository for backend only
2. Copy Laravel backend contents to root
3. Configure for Laravel Cloud
4. Update CORS settings for Vercel domain

## Environment Variables

### Frontend (.env.local for Vercel):
```
NEXT_PUBLIC_API_URL=https://your-laravel-cloud-domain.com
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
```

### Backend (.env for Laravel Cloud):
```
FRONTEND_URL=https://your-vercel-domain.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-vercel-domain.vercel.app
SESSION_DOMAIN=.your-vercel-domain.vercel.app
```