# Learning Management System (LMS)

A comprehensive full-stack Learning Management System built with **Next.js 15**, **Laravel 11**, **TypeScript**, and **Tailwind CSS**. Features a modern, responsive design with complete dark mode support and mobile-first approach.

## 🚀 Features

### Frontend (Next.js)
- **Modern UI/UX**: Built with Radix UI and Tailwind CSS with shadcn/ui components
- **Role-Based Dashboard**: Admin, creator, and student interfaces with role-specific features
- **Real-time Updates**: Synchronized data across sessions with optimized state management
- **Responsive Design**: Mobile-first design with comprehensive responsive breakpoints
- **Dark Mode Support**: Complete dark mode implementation with warm, neutral color palette
- **Touch-Friendly**: Optimized for mobile devices with proper touch targets and gestures
- **Progressive Web App**: Optimized for performance, accessibility, and SEO

### Backend (Laravel)
- **RESTful API**: Comprehensive API endpoints for all features
- **Authentication**: Laravel Sanctum for secure token-based auth
- **Role-Based Access Control**: Using Spatie Laravel Permission
- **Database Management**: Eloquent ORM with optimized queries
- **File Storage**: Support for local and cloud storage
- **API Documentation**: Well-documented endpoints

### Core Functionality
- **Topic & Lesson Management**: Create, edit, and organize learning content with rich media support
- **Assessment System**: Timed quizzes with automatic grading and detailed feedback
- **Community Forum**: Full-featured discussion forum with posts, comments, voting, and moderation
- **Bookmark & Report System**: Users can bookmark posts and report inappropriate content
- **Progress Tracking**: Detailed analytics, completion tracking, and learning insights
- **User Management**: Admin controls for user roles, permissions, and profile management
- **Content Analytics**: Comprehensive engagement metrics and performance dashboards
- **Advanced Reporting**: Detailed reports for videos, users, and community activity
- **Mobile-Responsive Interface**: Optimized for all devices with touch-friendly interactions

## 🏗️ Architecture

```
lms-system/
├── app/                    # Next.js 15 App Router
│   ├── dashboard/          # Protected dashboard routes
│   │   ├── community/      # Community forum pages
│   │   ├── manage-topics/  # Topic management (admin/creator)
│   │   ├── profile/        # User profile with admin view support
│   │   ├── reports/        # Analytics and reporting dashboard
│   │   ├── settings/       # Account settings with dark mode
│   │   └── user-management/ # User administration
│   └── api/               # NextAuth API routes
├── components/            # React components with TypeScript
│   ├── ui/                # shadcn/ui components
│   └── dashboard-*        # Dashboard-specific components
├── lib/                   # Utilities and API services
│   ├── api-client.ts      # Axios configuration for Laravel API
│   ├── services/          # API service layers
│   │   └── community.service.ts # Community forum API
│   ├── data-store.ts      # Client-side data management
│   ├── image-utils.ts     # Image processing utilities
│   └── utils.ts           # Utility functions
├── laravel-backend/       # Laravel 11 API backend
│   ├── app/Models/        # Eloquent models
│   │   ├── CommunityPost.php     # Forum posts
│   │   ├── CommunityComment.php  # Forum comments
│   │   ├── CommunityBookmark.php # User bookmarks
│   │   └── CommunityReport.php   # Content reports
│   ├── app/Http/Controllers/Api/ # API controllers
│   ├── database/migrations/      # Database schema
│   └── routes/api.php     # API routes with community endpoints
├── hooks/                 # Custom React hooks
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
  - Full system access, user management, content moderation
- **Creator**: `creator@lms.com` / `creator123`
  - Content creation, topic management, analytics access
- **Student**: `student@lms.com` / `student123`
  - Learning access, community participation, progress tracking

### Account Features by Role:

**Admin:**
- User management and role assignment
- Community moderation (reports, hiding posts)
- System analytics and comprehensive reporting
- Profile management for all users

**Creator:**
- Topic and lesson creation/management
- Assessment creation and grading
- Content analytics and engagement metrics

**Student:**
- Learning progress tracking
- Community forum participation
- Bookmark and report functionality
- Personal profile customization

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



### Assessments
- `GET /api/assessments` - List assessments
- `POST /api/assessments/{id}/attempt` - Submit assessment attempt
- `GET /api/assessments/{id}/results` - Get assessment results

### Community Forum
- `GET /api/community/posts` - List forum posts with pagination and filtering
- `POST /api/community/posts` - Create new post
- `GET /api/community/posts/{id}` - Get specific post with comments
- `GET /api/community/posts/{id}/comments` - Get post comments with nested replies
- `POST /api/community/posts/{id}/comments` - Create comment or reply
- `POST /api/community/vote` - Vote on posts/comments
- `POST /api/community/posts/{id}/bookmark` - Bookmark/unbookmark posts
- `GET /api/community/bookmarks` - Get user's bookmarked posts
- `POST /api/community/report` - Report inappropriate content
- `GET /api/community/reports` - Get reports for admin review
- `PUT /api/community/reports/{id}` - Update report status (admin)
- `POST /api/community/posts/{id}/pin` - Pin/unpin posts (admin)
- `POST /api/community/posts/{id}/lock` - Lock/unlock posts (admin)
- `POST /api/community/posts/{id}/hide` - Hide/show posts (admin)

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

1. **Backend**: Create controllers, models, and migrations in Laravel
2. **API Services**: Create service files in `lib/services/`
3. **Data Management**: Update data store hooks in `hooks/use-data-store.ts`
4. **UI Components**: Build responsive components in `components/`
5. **Dark Mode**: Add dark mode classes using `dark:` prefix
6. **Mobile Support**: Implement responsive breakpoints (`sm:`, `md:`, `lg:`)
7. **Integration**: Update API client and state management

### Mobile-First Development

- Start with mobile design and scale up
- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Test on multiple screen sizes (320px, 375px, 768px, 1024px)
- Ensure touch targets are at least 44px
- Implement proper overflow handling for tables and content

### Dark Mode Implementation

- Use consistent color palette: `gray-900`, `gray-800`, `gray-700`
- Implement warm, neutral grays instead of blue-tinted ones
- Test contrast ratios for accessibility
- Use `dark:` prefix for all dark mode styles

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
- Verify `SESSION_DOMAIN` matches your domain

**Database Connection:**
- Verify database credentials in Laravel `.env`
- Ensure MySQL/PostgreSQL is running
- Check if database exists
- Run `php artisan migrate:fresh --seed` to reset database

**Authentication Issues:**
- Clear browser cookies and localStorage
- Verify `NEXTAUTH_SECRET` is set
- Check Laravel session configuration
- Ensure API endpoints are properly authenticated

**Mobile Display Issues:**
- Check for missing responsive classes
- Verify table overflow is handled with `overflow-x-auto`
- Test on actual mobile devices, not just browser dev tools
- Ensure touch targets meet minimum size requirements

**Dark Mode Problems:**
- Verify all components have `dark:` classes
- Check color contrast ratios for accessibility
- Ensure consistent color palette usage
- Test theme switching functionality

## 📚 Additional Resources

### Framework Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [NextAuth.js](https://next-auth.js.org/)

### UI & Styling
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

### Development Tools
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks](https://react.dev/reference/react)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Dark Mode Implementation](https://tailwindcss.com/docs/dark-mode)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For questions and support:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation

## 🎨 Design Features

### Responsive Design
- **Mobile-First**: Designed for mobile devices first, then enhanced for larger screens
- **Breakpoints**: Supports all device sizes from 320px to 4K displays
- **Touch-Friendly**: Optimized button sizes and touch targets for mobile interaction
- **Adaptive Layouts**: Grid and flexbox layouts that adapt to screen size

### Dark Mode
- **System Preference**: Automatically detects user's system theme preference
- **Manual Toggle**: Users can manually switch between light and dark modes
- **Consistent Palette**: Uses warm, neutral grays for better readability
- **Accessibility**: Maintains proper contrast ratios in both modes

### Performance
- **Optimized Images**: Automatic image compression and optimization
- **Lazy Loading**: Components and images load on demand
- **Efficient State**: Client-side state management with optimized re-renders
- **Fast API**: Laravel backend with optimized database queries

---

**Built with ❤️ using Next.js and Laravel**

*Last Updated: July 2025* 