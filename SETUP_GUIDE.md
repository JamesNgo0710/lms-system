# 🚀 LMS System - Complete Setup Guide

This guide will help you set up the LMS system on any development machine without environment issues.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** (v18 or higher)
- **PHP** (v8.1 or higher)
- **Composer** (PHP package manager)
- **Git**

## 🛠️ Quick Setup (New Machine)

### 1. Clone and Setup Frontend

```bash
# Clone the repository
git clone <your-repo-url> lms-system
cd lms-system

# Install frontend dependencies
npm install

# Copy environment file and configure
cp .env.example .env.local
```

### 2. Configure Frontend Environment

Edit `.env.local` and set these **REQUIRED** values:

```bash
# Generate a secure secret: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here

# Ensure these URLs match your setup
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
```

### 3. Setup Laravel Backend

```bash
# Navigate to Laravel backend
cd laravel-backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate Laravel application key (CRITICAL!)
php artisan key:generate

# Create database and run migrations
php artisan migrate

# Seed initial data (admin, teacher, student users)
php artisan db:seed
```

### 4. Configure Backend Environment

The `.env` file should be automatically configured, but verify these critical settings:

```bash
APP_URL=http://localhost:8000
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
FRONTEND_URL=http://localhost:3000
SESSION_DOMAIN=localhost
```

### 5. Start Development Servers

```bash
# Terminal 1: Start Laravel backend
cd laravel-backend
php artisan serve

# Terminal 2: Start Next.js frontend (from project root)
cd ..
npm run dev
```

## ⚠️ Common Issues & Solutions

### Issue: ChunkLoadError / SyntaxError (From Screenshot)

**Cause:** Environment configuration mismatch between frontend and backend

**Solution:**
1. **Clear all caches:**
   ```bash
   # Frontend
   rm -rf .next
   rm -rf node_modules/.cache
   
   # Backend
   cd laravel-backend
   php artisan cache:clear
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   ```

2. **Verify environment files:**
   ```bash
   # Check frontend .env.local exists and has NEXTAUTH_SECRET
   cat .env.local | grep NEXTAUTH_SECRET
   
   # Check backend .env has APP_KEY
   cd laravel-backend
   cat .env | grep APP_KEY
   ```

3. **Restart both servers**

### Issue: CORS Errors

**Cause:** Frontend and backend URLs don't match configuration

**Solution:**
1. Ensure Laravel `.env` has:
   ```
   SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
   FRONTEND_URL=http://localhost:3000
   ```

2. Check Next.js `.env.local` has:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### Issue: 404 API Errors

**Cause:** Backend server not running or wrong URL

**Solution:**
1. Verify Laravel is running on `http://localhost:8000`
2. Test API directly: `curl http://localhost:8000/api/users`
3. Check Laravel logs: `tail -f laravel-backend/storage/logs/laravel.log`

### Issue: Authentication Failures

**Cause:** Missing or incorrect APP_KEY or NEXTAUTH_SECRET

**Solution:**
1. **Backend:** Run `php artisan key:generate`
2. **Frontend:** Generate new NEXTAUTH_SECRET: `openssl rand -base64 32`
3. Restart both servers

## 🔧 Environment Files Checklist

### Frontend (.env.local) - Required Values:
- ✅ `NEXT_PUBLIC_API_URL=http://localhost:8000`
- ✅ `NEXTAUTH_URL=http://localhost:3000`
- ✅ `NEXTAUTH_SECRET=<generated-32-char-string>`

### Backend (laravel-backend/.env) - Required Values:
- ✅ `APP_KEY=<generated-by-artisan>`
- ✅ `APP_URL=http://localhost:8000`
- ✅ `SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000`
- ✅ `FRONTEND_URL=http://localhost:3000`
- ✅ `SESSION_DOMAIN=localhost`

## 🧪 Testing the Setup

### 1. Test Backend API
```bash
# Test health endpoint
curl http://localhost:8000/api/users

# Should return user data or authentication required
```

### 2. Test Frontend
1. Open `http://localhost:3000`
2. Should load without console errors
3. Login with test credentials (CONSISTENT ACROSS ALL PCs):
   - **Admin:** admin@lms.com / admin123
   - **Teacher:** teacher@lms.com / teacher123
   - **Student:** student@lms.com / student123
   
   ⚠️ **IMPORTANT:** These are the ONLY valid test credentials!
   DO NOT use admin@example.com or any other variations!

## 🚀 Deployment Considerations

### Production Environment Files

**Frontend (.env.production):**
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXTAUTH_URL=https://your-frontend-domain.com
NEXTAUTH_SECRET=<super-secure-production-secret>
```

**Backend (.env production):**
```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-api-domain.com
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
SESSION_DOMAIN=your-api-domain.com
SESSION_SECURE_COOKIE=true
```

## 📞 Need Help?

If you're still experiencing issues:

1. **Check logs:**
   - Frontend: Browser console (F12)
   - Backend: `laravel-backend/storage/logs/laravel.log`

2. **Verify ports:**
   - Frontend should be on `:3000`
   - Backend should be on `:8000`

3. **Reset everything:**
   ```bash
   # Stop all servers
   # Delete .env files
   # Follow setup guide from step 1
   ```

## 🎯 Success Indicators

When properly set up, you should see:
- ✅ Next.js running on `http://localhost:3000`
- ✅ Laravel running on `http://localhost:8000`
- ✅ No console errors in browser
- ✅ Successful login with test credentials
- ✅ API calls working (check Network tab in browser dev tools)

---

**⚡ Pro Tip:** Always run this setup process when moving to a new development machine to avoid environment conflicts!