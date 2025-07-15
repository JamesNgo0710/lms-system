# 🚀 LMS System - Universal Deployment Guide

This guide helps you deploy the LMS system anywhere - locally, on cloud platforms, or custom servers. The system automatically detects and connects to available backends.

## 🎯 Quick Start (Works Everywhere)

### Option 1: With Laravel Backend (Recommended)

```bash
# 1. Clone the project
git clone <your-repo-url>
cd lms-system

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local

# 4. Start Laravel backend (separate terminal)
cd laravel-backend
composer install
php artisan serve --port=8000

# 5. Populate backend with sample data
node scripts/populate-backend.js

# 6. Start frontend
npm run dev
```

### Option 2: Mock Data Mode (No Backend Required)

```bash
# 1. Clone and install
git clone <your-repo-url>
cd lms-system
npm install

# 2. Enable mock data mode
echo "NEXT_PUBLIC_ENABLE_MOCK_DATA=true" > .env.local

# 3. Start application
npm run dev
```

## 🔧 Environment Configuration

The system automatically detects your backend. Configure using environment variables:

### Basic Configuration (.env.local)

```env
# Backend URL (auto-detected if not set)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Optional: Force mock data mode
# NEXT_PUBLIC_ENABLE_MOCK_DATA=true
```

### Advanced Configuration

```env
# Multiple backend URLs (system tries in order)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_LARAVEL_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_BACKUP_API_URL=https://your-backup-api.com

# Feature flags
NEXT_PUBLIC_DEMO_MODE=false
NODE_ENV=production

# External services
NEXT_PUBLIC_CDN_URL=https://your-cdn.com
NEXT_PUBLIC_AVATAR_SERVICE=https://ui-avatars.com/api
```

## 🌐 Platform-Specific Deployment

### Vercel Deployment

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Set environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-laravel-api.com
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-production-secret
```

### Netlify Deployment

```bash
# 1. Build the project
npm run build

# 2. Deploy to Netlify
# Upload 'out' folder or connect GitHub repo

# 3. Set environment variables in Netlify dashboard
NEXT_PUBLIC_API_URL=https://your-api.com
NEXTAUTH_URL=https://your-app.netlify.app
```

### Docker Deployment

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - backend
  
  backend:
    build: ./laravel-backend
    ports:
      - "8000:8000"
    environment:
      - DB_CONNECTION=sqlite
      - APP_URL=http://localhost:8000
```

### VPS/Dedicated Server

```bash
# 1. Install Node.js and PHP
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs php8.1 php8.1-cli composer

# 2. Clone and setup
git clone <your-repo>
cd lms-system

# 3. Install dependencies
npm install
cd laravel-backend && composer install && cd ..

# 4. Configure environment
cp .env.example .env.local
# Edit .env.local with your domain/IP

# 5. Start services (use PM2 for production)
npm install -g pm2
pm2 start npm --name "lms-frontend" -- start
pm2 start --name "lms-backend" "php laravel-backend/artisan serve --host=0.0.0.0 --port=8000"
```

## 📊 Backend Setup Options

### Option 1: Laravel Backend (Full Features)

```bash
cd laravel-backend
composer install
php artisan migrate
php artisan db:seed
php artisan serve
```

### Option 2: Custom Backend

The frontend works with any REST API that implements these endpoints:
- `GET /api/topics`
- `GET /api/users`
- `GET /api/lessons`
- `GET /api/assessments`
- `POST /api/topics` (for creating)
- `PUT /api/topics/{id}` (for updating)

### Option 3: Database Population

Use the included scripts to populate any backend:

```bash
# Automatic population
node scripts/populate-backend.js

# Custom backend URL
node scripts/populate-backend.js --url=https://your-api.com

# Generate SQL files for manual import
node scripts/populate-backend.js --force-mock
```

## 🔄 Data Synchronization

### Automatic Backend Detection

The system automatically detects and connects to available backends:

1. Checks environment variables for API URLs
2. Tests common localhost ports (8000, 8080)
3. Falls back to mock data if no backend found
4. Caches successful connections for performance

### Cross-Platform Consistency

Data sync works across different environments:

```javascript
// The system handles different scenarios automatically
const backend = await detectBackend()

if (backend.isConnected) {
  // Use real API
  return await fetch('/api/topics')
} else {
  // Use mock data
  return mockDataService.getTopics()
}
```

## 🎛️ Configuration Management

### Environment Detection

```javascript
// Automatic environment detection
const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'auto-detect',
}
```

### Feature Flags

```env
# Enable/disable features per environment
NEXT_PUBLIC_FEATURE_ANALYTICS=true
NEXT_PUBLIC_FEATURE_SOCIAL_LOGIN=false
NEXT_PUBLIC_DEMO_MODE=true
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. Backend Not Detected

```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Test with custom URL
node scripts/populate-backend.js --url=http://your-backend

# Force mock data mode
echo "NEXT_PUBLIC_ENABLE_MOCK_DATA=true" >> .env.local
```

#### 2. CORS Issues

```php
// Laravel: config/cors.php
'allowed_origins' => ['http://localhost:3000', 'https://your-frontend.com'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

#### 3. Authentication Problems

```env
# Ensure URLs match
NEXTAUTH_URL=http://localhost:3000  # Must match frontend URL
NEXT_PUBLIC_API_URL=http://localhost:8000  # Must match backend URL
```

#### 4. Data Not Loading

```bash
# Check API endpoints
curl -H "Accept: application/json" http://localhost:8000/api/topics

# Repopulate data
node scripts/populate-backend.js

# Check browser console for errors
```

### Debug Mode

```env
# Enable detailed logging
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 🚀 Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure proper domain URLs
- [ ] Set secure `NEXTAUTH_SECRET`
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Configure CDN for assets
- [ ] Set up monitoring/logging
- [ ] Test cross-platform compatibility

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting Guide](CROSS_PC_TROUBLESHOOTING.md)
2. Review backend logs
3. Test with mock data mode
4. Verify environment variables
5. Check network connectivity

The system is designed to work out-of-the-box with automatic backend detection and mock data fallback, ensuring it runs consistently across different environments.