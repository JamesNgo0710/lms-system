# Quick Start Guide - Laravel + Next.js LMS

## Prerequisites
- PHP 8.1+ and Composer
- Node.js 18+ and NPM
- MySQL or PostgreSQL database
- Git

## Step 1: Set Up Laravel Backend

### 1.1 Create Laravel Project
```bash
# In a separate directory (not inside lms-system)
composer create-project laravel/laravel lms-backend
cd lms-backend
```

### 1.2 Install Dependencies
```bash
composer require laravel/sanctum spatie/laravel-permission fruitcake/laravel-cors
```

### 1.3 Configure Database
Create a database named `lms_system` and update `.env`:
```
DB_DATABASE=lms_system
DB_USERNAME=your_username
DB_PASSWORD=your_password

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### 1.4 Quick Setup Script
Create `setup.sh` in Laravel root:
```bash
#!/bin/bash
# Publish configs
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan vendor:publish --tag="cors"

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

echo "Setup complete! Run 'php artisan serve' to start the backend."
```

Run: `chmod +x setup.sh && ./setup.sh`

### 1.5 Copy Laravel Files
Copy the following from the guides:
- User model from `LARAVEL_BACKEND_SETUP.md` → `app/Models/User.php`
- AuthController → `app/Http/Controllers/Api/AuthController.php`
- UserController → `app/Http/Controllers/Api/UserController.php`
- API routes → `routes/api.php`
- Database seeder → `database/seeders/DatabaseSeeder.php`

### 1.6 Start Laravel
```bash
php artisan serve
```
Backend should now be running at http://localhost:8000

## Step 2: Configure Next.js Frontend

### 2.1 Install Dependencies
```bash
cd lms-system
npm install axios --legacy-peer-deps
```

### 2.2 Create Environment File
```bash
cp env.example .env.local
```
Update `.env.local` with your values.

### 2.3 Files Already Created
The following files have been created for you:
- `lib/api-client.ts` - Axios client for API calls
- `lib/services/user.service.ts` - User service layer

### 2.4 Update NextAuth (TODO)
You'll need to update `app/api/auth/[...nextauth]/route.ts` to use the Laravel backend. See `NEXTJS_LARAVEL_INTEGRATION.md` for the complete code.

### 2.5 Start Next.js
```bash
npm run dev
```
Frontend should now be running at http://localhost:3000

## Step 3: Test the Integration

### 3.1 Test Login
Try logging in with:
- Admin: `admin@lms.com` / `admin123`
- Student: `student@lms.com` / `student123`

### 3.2 Common Issues

**CORS Error?**
- Check Laravel's `config/cors.php` includes your frontend URL
- Ensure `withCredentials: true` in axios

**401 Unauthorized?**
- Check token is being sent in headers
- Verify Sanctum configuration

**Cannot connect to backend?**
- Verify Laravel is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

## Next Steps

1. **Update Remaining Components**
   - Modify user management to use API
   - Update other data hooks to use services
   - Remove localStorage dependencies

2. **Implement Additional APIs**
   - Topics and lessons endpoints
   - Assessment system
   - Community features

3. **Production Deployment**
   - Use HTTPS for both frontend and backend
   - Set proper environment variables
   - Configure proper CORS origins

## Helpful Commands

### Laravel
```bash
# Create new controller
php artisan make:controller Api/TopicController --resource

# Create model with migration
php artisan make:model Topic -m

# Clear caches
php artisan cache:clear
php artisan config:clear

# View routes
php artisan route:list
```

### Next.js
```bash
# Type checking
npm run type-check

# Build for production
npm run build

# Analyze bundle
npm run analyze
```

## Resources
- [Laravel Sanctum Docs](https://laravel.com/docs/sanctum)
- [Spatie Permission Docs](https://spatie.be/docs/laravel-permission)
- [NextAuth Docs](https://next-auth.js.org/)
- Full setup guides in `LARAVEL_BACKEND_SETUP.md` and `NEXTJS_LARAVEL_INTEGRATION.md` 