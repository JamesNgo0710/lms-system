# LMS System Deployment Guide

## Overview
This guide will help you deploy the LMS system with:
- **Frontend (Next.js)** → Vercel (Free Plan)
- **Backend (Laravel)** → Laravel Cloud (Free Plan)

## Prerequisites
- GitHub account
- Vercel account 
- Laravel Cloud account
- Git installed locally

---

## Part 1: Prepare Backend for Laravel Cloud

### Step 1: Create Backend Repository
```bash
# Create new repository on GitHub: lms-backend
git clone https://github.com/yourusername/lms-backend.git
cd lms-backend
```

### Step 2: Copy Laravel Files
Copy all contents from `laravel-backend/` folder to the root of your new repository:
```bash
# Copy these files/folders to root:
- app/
- bootstrap/
- config/
- database/
- public/
- resources/
- routes/
- storage/
- tests/
- vendor/
- .env.example
- artisan
- composer.json
- composer.lock
```

### Step 3: Update Backend Configuration
1. Copy `deployment-structure/backend-env.example` to `.env`
2. Update the following in your `.env`:
   ```
   FRONTEND_URL=https://your-frontend-app.vercel.app
   SANCTUM_STATEFUL_DOMAINS=your-frontend-app.vercel.app
   SESSION_DOMAIN=.your-frontend-app.vercel.app
   ```

### Step 4: Update CORS Configuration
Edit `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
'allowed_origins_patterns' => ['https://*.vercel.app'],
'supports_credentials' => true,
```

### Step 5: Deploy to Laravel Cloud
1. Go to [Laravel Cloud](https://cloud.laravel.com)
2. Create new project
3. Connect your `lms-backend` repository
4. Configure environment variables in Laravel Cloud dashboard
5. Deploy

---

## Part 2: Prepare Frontend for Vercel

### Step 1: Create Frontend Repository
```bash
# Create new repository on GitHub: lms-frontend
git clone https://github.com/yourusername/lms-frontend.git
cd lms-frontend
```

### Step 2: Copy Frontend Files
Copy all files from current project EXCEPT:
- `laravel-backend/` folder
- `deployment-structure/` folder
- Laravel-specific files

### Step 3: Update Package.json
Replace `package.json` with `deployment-structure/frontend-package.json`

### Step 4: Update Environment Variables
1. Copy `deployment-structure/frontend-env.example` to `.env.local`
2. Update with your actual URLs:
   ```
   NEXT_PUBLIC_API_URL=https://your-laravel-cloud-app.dev
   NEXTAUTH_URL=https://your-frontend-app.vercel.app
   NEXTAUTH_SECRET=your-very-secure-secret-key
   ```

### Step 5: Add Vercel Configuration
Copy `deployment-structure/vercel.json` to root of frontend project

### Step 6: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your `lms-frontend` repository
3. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your Laravel Cloud URL
   - `NEXTAUTH_URL`: Your Vercel app URL
   - `NEXTAUTH_SECRET`: A secure random string
4. Deploy

---

## Part 3: Final Configuration

### Step 1: Update Backend Environment
In Laravel Cloud dashboard, update:
```
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-actual-vercel-url.vercel.app
SESSION_DOMAIN=.vercel.app
```

### Step 2: Test the Connection
1. Visit your Vercel app
2. Try logging in
3. Check API endpoints are working
4. Verify data is syncing properly

---

## Troubleshooting

### CORS Issues
If you get CORS errors:
1. Check `FRONTEND_URL` in Laravel Cloud
2. Verify `SANCTUM_STATEFUL_DOMAINS` is correct
3. Ensure `supports_credentials: true` in CORS config

### API Connection Issues
If API calls fail:
1. Check `NEXT_PUBLIC_API_URL` in Vercel
2. Verify Laravel Cloud app is running
3. Check Laravel Cloud logs for errors

### Authentication Issues
If login doesn't work:
1. Check `NEXTAUTH_URL` matches your Vercel domain
2. Verify `NEXTAUTH_SECRET` is set
3. Check session configuration in Laravel

---

## Cost Summary
- **Vercel**: Free plan (with usage limits)
- **Laravel Cloud**: Free plan (with usage limits)
- **Total Monthly Cost**: $0 (with free tier limitations)

## Scaling Considerations
- Vercel free: 100GB bandwidth, 100 serverless functions executions
- Laravel Cloud free: Limited resources, upgrade for production use
- Consider paid plans for production applications