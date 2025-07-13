#!/bin/bash

echo "========================================"
echo "LMS System - Quick Setup Script"
echo "========================================"
echo

echo "[1/6] Setting up frontend environment..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✓ Created .env.local from example"
else
    echo "⚠ .env.local already exists, skipping..."
fi

echo
echo "[2/6] Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✓ Frontend dependencies installed"

echo
echo "[3/6] Setting up Laravel backend environment..."
cd laravel-backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created .env from example"
else
    echo "⚠ .env already exists, skipping..."
fi

echo
echo "[4/6] Installing backend dependencies..."
composer install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✓ Backend dependencies installed"

echo
echo "[5/6] Generating Laravel application key..."
php artisan key:generate
if [ $? -ne 0 ]; then
    echo "❌ Failed to generate application key"
    exit 1
fi
echo "✓ Laravel application key generated"

echo
echo "[6/6] Setting up database..."
php artisan migrate
if [ $? -ne 0 ]; then
    echo "❌ Failed to run migrations"
    exit 1
fi
echo "✓ Database migrations completed"

php artisan db:seed
if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi
echo "✓ Database seeded with test data"

cd ..

echo
echo "========================================"
echo "✅ SETUP COMPLETE!"
echo "========================================"
echo
echo "IMPORTANT: You need to manually update these values:"
echo
echo "1. In .env.local, set NEXTAUTH_SECRET to a secure value"
echo "   Generate one with: openssl rand -base64 32"
echo
echo "2. To start the development servers:"
echo "   Terminal 1: cd laravel-backend && php artisan serve"
echo "   Terminal 2: npm run dev"
echo
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo
echo "Test login credentials (CONSISTENT ACROSS ALL PCs):"
echo "   Admin: admin@lms.com / admin123"
echo "   Teacher: teacher@lms.com / teacher123"
echo "   Student: student@lms.com / student123"
echo
echo "   WARNING: These are the ONLY valid test credentials!"
echo "   DO NOT use admin@example.com or any other variations!"
echo