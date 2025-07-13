# 🔧 Cross-PC Troubleshooting Guide

This guide addresses common issues when working with the LMS system across different development machines.

## 🚨 Critical Issues and Solutions

### Issue 1: "admin@example.com" vs "admin@lms.com" Login Confusion

**Problem:** Different PCs have different test credentials in documentation or memory.

**Solution:**
✅ **ALWAYS use these exact credentials (seeded in database):**
- **Admin:** `admin@lms.com` / `admin123`
- **Teacher:** `teacher@lms.com` / `teacher123`
- **Student:** `student@lms.com` / `student123`

❌ **DO NOT use any variations like:**
- admin@example.com
- admin@test.com
- Any other email format

**Prevention:**
```bash
# Always run this on new PCs to ensure fresh data:
cd laravel-backend
php artisan migrate:fresh --seed
```

### Issue 2: Dashboard Reports 500 Error

**Problem:** `AxiosError: Request failed with status code 500` on `/community/reports`

**Root Cause:** Missing database migrations (community_reports table doesn't exist)

**Solution:**
```bash
cd laravel-backend

# Check migration status
php artisan migrate:status

# Run any pending migrations
php artisan migrate

# If community_reports migration is missing, run:
php artisan migrate --path=database/migrations/2025_07_12_044334_create_community_reports_table.php
```

**Prevention:** Always run `php artisan migrate` when pulling updates from git.

### Issue 3: NEXTAUTH_SECRET Missing/Invalid

**Problem:** 401 Unauthorized errors during login

**Solution:**
```bash
# Generate new secret
openssl rand -base64 32

# Update .env.local with the generated secret
NEXTAUTH_SECRET=your-generated-secret-here
```

**Prevention:** Never commit `.env.local` files - always copy from `.env.example`.

### Issue 4: Laravel APP_KEY Missing

**Problem:** Laravel encryption errors or 500 errors

**Solution:**
```bash
cd laravel-backend
php artisan key:generate
```

**Prevention:** Always run this command after copying `.env.example` to `.env`.

## 📝 Cross-PC Setup Checklist

When setting up on a **new PC**, follow this exact order:

### Frontend Setup:
```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.example .env.local

# 3. Generate NEXTAUTH_SECRET
openssl rand -base64 32
# Add this to .env.local

# 4. Verify configuration
cat .env.local | grep NEXTAUTH_SECRET
cat .env.local | grep NEXT_PUBLIC_API_URL
```

### Backend Setup:
```bash
cd laravel-backend

# 1. Install dependencies
composer install

# 2. Copy and configure environment
cp .env.example .env

# 3. Generate application key
php artisan key:generate

# 4. Run all migrations (CRITICAL!)
php artisan migrate

# 5. Seed database with test users
php artisan db:seed

# 6. Verify setup
php artisan migrate:status
```

### Verification:
```bash
# 1. Test backend directly
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@lms.com", "password": "admin123"}'

# Should return user data and token

# 2. Test frontend
# Open http://localhost:3000
# Login with admin@lms.com / admin123
```

## 🔄 Git Pull Best Practices

When pulling updates from git:

### Always Run These Commands:
```bash
# Frontend
npm install  # In case new packages were added

# Backend
cd laravel-backend
composer install       # In case new packages were added
php artisan migrate    # CRITICAL: Run any new migrations
php artisan config:clear
php artisan cache:clear
```

### Check for New Environment Variables:
```bash
# Compare your .env with .env.example
diff .env .env.example

# Add any new required variables
```

## 🚨 Emergency Reset (When Everything Breaks)

If the system is completely broken across PCs:

### Nuclear Option - Complete Reset:
```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clean frontend
rm -rf .next
rm -rf node_modules
rm .env.local
npm install
cp .env.example .env.local
# Update NEXTAUTH_SECRET manually

# 3. Reset backend database
cd laravel-backend
php artisan migrate:fresh --seed
php artisan cache:clear
php artisan config:clear

# 4. Restart servers
php artisan serve &
cd .. && npm run dev
```

## 📊 Environment Validation Script

Create this script to validate your setup:

```bash
#!/bin/bash
# save as validate-setup.sh

echo "🔍 Validating LMS Setup..."

# Check frontend environment
echo "Frontend Environment:"
if [ -f .env.local ]; then
  if grep -q "NEXTAUTH_SECRET=your-secret-key" .env.local; then
    echo "❌ NEXTAUTH_SECRET not configured"
  else
    echo "✅ NEXTAUTH_SECRET configured"
  fi
  
  if grep -q "NEXT_PUBLIC_API_URL=http://localhost:8000" .env.local; then
    echo "✅ API URL configured correctly"
  else
    echo "❌ API URL misconfigured"
  fi
else
  echo "❌ .env.local missing"
fi

# Check backend environment
echo "Backend Environment:"
cd laravel-backend
if [ -f .env ]; then
  if grep -q "APP_KEY=base64:" .env; then
    echo "✅ Laravel APP_KEY configured"
  else
    echo "❌ Laravel APP_KEY missing"
  fi
else
  echo "❌ Laravel .env missing"
fi

# Check database
echo "Database Status:"
php artisan migrate:status | grep community_reports
echo "✅ Validation complete"
```

## 🎯 Success Indicators

Your setup is correct when:
- ✅ Frontend loads at http://localhost:3000 without errors
- ✅ Backend responds at http://localhost:8000/api
- ✅ Login works with `admin@lms.com` / `admin123`
- ✅ Dashboard loads without 500 errors
- ✅ Reports page loads without errors
- ✅ No console errors in browser dev tools

---

**💡 Pro Tip:** Always use the automated setup scripts (`setup.bat` or `setup.sh`) on new PCs to avoid manual configuration errors!