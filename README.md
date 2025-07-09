# Learning Management System (LMS)

A comprehensive full-stack Learning Management System built with **Next.js 15**, **Laravel 11**, **TypeScript**, and **Tailwind CSS**.

## 🚀 Features

### Frontend (Next.js)
- **Modern UI/UX**: Built with Radix UI and Tailwind CSS
- **Role-Based Dashboard**: Admin, teacher, and student interfaces
- **Real-time Updates**: Synchronized data across sessions
- **Responsive Design**: Mobile-first design approach
- **Theme Support**: Light and dark mode with system preference detection
- **Progressive Web App**: Optimized for performance and accessibility

### Backend (Laravel)
- **RESTful API**: Comprehensive API endpoints for all features
- **Authentication**: Laravel Sanctum for secure token-based auth
- **Role-Based Access Control**: Using Spatie Laravel Permission
- **Database Management**: Eloquent ORM with optimized queries
- **File Storage**: Support for local and cloud storage
- **API Documentation**: Well-documented endpoints

### Core Functionality
- **Topic & Lesson Management**: Create, edit, and organize learning content
- **Assessment System**: Timed quizzes with automatic grading
- **Community Features**: Discussion forums with threaded replies
- **Progress Tracking**: Detailed analytics and completion tracking
- **User Management**: Admin controls for user roles and permissions
- **Content Analytics**: Engagement and performance metrics

## 🏗️ Architecture

```
lms-system/
├── app/                    # Next.js 15 App Router
├── components/            # React components with TypeScript
├── lib/                   # Utilities and API services
│   ├── api-client.ts      # Axios configuration for Laravel API
│   ├── services/          # API service layers
│   ├── config.ts          # Environment configuration
│   └── utils.ts           # Utility functions
├── laravel-backend/       # Laravel 11 API backend
│   ├── app/Models/        # Eloquent models
│   ├── app/Http/Controllers/Api/  # API controllers
│   ├── database/migrations/       # Database schema
│   └── routes/api.php     # API routes
├── public/                # Static assets
└── types/                 # TypeScript definitions
```

## 📋 Prerequisites

- **Node.js** 18.0 or later
- **PHP** 8.1 or later
- **Composer** 2.0 or later
- **MySQL** 8.0 or **PostgreSQL** 13+
- **Git**

## 🛠️ Installation

### Step 1: Clone and Setup Frontend

```bash
git clone https://github.com/your-username/lms-system.git
cd lms-system

# Install dependencies
npm install

# Create environment file
cp env.example .env.local
```

### Step 2: Configure Environment Variables

Update `.env.local`:

```bash
# Next.js Configuration
NEXT_PUBLIC_APP_NAME="LMS System"
NEXT_PUBLIC_API_URL="http://localhost:8000"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key-for-production"
NEXTAUTH_URL="http://localhost:3000"

# Laravel Backend URL
NEXT_PUBLIC_LARAVEL_API_URL="http://localhost:8000/api"
```

### Step 3: Setup Laravel Backend

```bash
cd laravel-backend

# Install dependencies
composer install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lms_system
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Configure CORS and Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DOMAIN=localhost
```

### Step 4: Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE lms_system;"

# Run migrations and seeders
php artisan migrate --seed

# Publish Sanctum configuration
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### Step 5: Start Development Servers

**Terminal 1 - Laravel Backend:**
```bash
cd laravel-backend
php artisan serve
```
Backend runs at: http://localhost:8000

**Terminal 2 - Next.js Frontend:**
```bash
# From project root
npm run dev
```
Frontend runs at: http://localhost:3000

## 🔑 Demo Accounts

After running the database seeder, you can login with:

- **Admin**: `admin@lms.com` / `admin123`
- **Teacher**: `teacher@lms.com` / `teacher123`  
- **Student**: `student@lms.com` / `student123`

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user

### Topics & Lessons
- `GET /api/topics` - List all topics
- `POST /api/topics` - Create new topic
- `GET /api/topics/{id}/lessons` - Get topic lessons
- `POST /api/lessons` - Create new lesson

### Community
- `GET /api/community/posts` - List community posts
- `POST /api/community/posts` - Create new post
- `POST /api/community/posts/{id}/replies` - Add reply

### Assessments
- `GET /api/assessments` - List assessments
- `POST /api/assessments/{id}/attempt` - Submit assessment attempt
- `GET /api/assessments/{id}/results` - Get assessment results

## 🚀 Deployment

### Production Environment Variables

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_APP_NAME="Your LMS Name"
NEXT_PUBLIC_API_URL="https://your-api-domain.com"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-frontend-domain.com"
```

**Backend (.env):**
```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-api-domain.com
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
```

### Deployment Platforms

**Frontend (Vercel):**
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

**Backend (Laravel Forge/DigitalOcean):**
1. Set up server with PHP 8.1+, MySQL, and Nginx
2. Configure environment variables
3. Set up SSL certificates
4. Configure CORS for your frontend domain

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # TypeScript checking
```

**Backend:**
```bash
php artisan serve    # Development server
php artisan migrate  # Run migrations
php artisan db:seed  # Seed database
php artisan test     # Run tests
```

### Adding New Features

1. **Backend**: Create controllers, models, and migrations
2. **Frontend**: Create services in `lib/services/`
3. **UI**: Build components in `components/`
4. **Integration**: Update API client and hooks

## 🧪 Testing

**Frontend:**
```bash
npm run test
```

**Backend:**
```bash
php artisan test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill process using port 3000
npx kill-port 3000

# Or use different port
npm run dev:alt  # Uses port 3001

# Or manually specify port
npm run dev -- --port 3001
```

**CORS Errors:**
- Check `config/cors.php` in Laravel backend
- Ensure frontend URL is in `SANCTUM_STATEFUL_DOMAINS`

**Database Connection:**
- Verify database credentials in Laravel `.env`
- Ensure MySQL/PostgreSQL is running
- Check if database exists

**Authentication Issues:**
- Clear browser cookies and localStorage
- Verify `NEXTAUTH_SECRET` is set
- Check Laravel session configuration

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For questions and support:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation

---

**Built with ❤️ using Next.js and Laravel** 