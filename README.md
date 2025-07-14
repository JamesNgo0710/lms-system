# 🎓 Learning Management System (LMS)

> **A modern, full-stack Learning Management System built with Next.js 15 & Laravel 11**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-11-red)](https://laravel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive Learning Management System featuring role-based dashboards, community forums, assessment tools, and real-time progress tracking. Built with modern web technologies and designed for scalability, accessibility, and cross-device compatibility.

## ✨ Key Highlights

- 🏗️ **Full-Stack Architecture**: Next.js frontend with Laravel API backend
- 👥 **Role-Based Access**: Admin, Teacher, and Student interfaces with granular permissions
- 📱 **Mobile-First Design**: Responsive across all devices with touch-optimized interactions
- 🌙 **Dark Mode Support**: Complete dark/light theme implementation with system preference detection
- 💬 **Community Forum**: Reddit-style discussion forum with voting, bookmarks, and moderation
- 📊 **Analytics Dashboard**: Comprehensive reporting for users, content, and community engagement
- 🔐 **Secure Authentication**: Laravel Sanctum with NextAuth.js integration
- 🚀 **Production Ready**: Optimized for deployment with comprehensive documentation

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
- 📚 **Content Management**: Create, edit, and organize topics and lessons with rich media support
- 📝 **Assessment System**: Timed quizzes with automatic grading and detailed feedback
- 💬 **Community Forum**: Reddit-style forum with posts, comments, voting, and moderation tools
- 🔖 **Bookmark & Report**: Users can save content and report inappropriate posts
- 📈 **Progress Tracking**: Real-time analytics, completion tracking, and learning insights
- 👥 **User Management**: Admin controls for roles, permissions, and profile management
- 📊 **Analytics Dashboard**: Engagement metrics, performance reports, and usage statistics
- 🚧 **Advanced CMS System** (Beta): Comprehensive content management system with admin dashboard, user analytics, and dashboard customization tools
- 🚧 **Detailed Progress Analytics** (Beta): Enhanced progress tracking with gamification, achievements, learning streaks, and advanced visualization
- 📱 **Cross-Platform**: Optimized for desktop, tablet, and mobile devices
- 🔍 **Advanced Search**: Filter and search across topics, lessons, and forum content

## 🚧 Beta Features

The following features are currently in beta development. They are functional but may have incomplete functionality or be subject to changes:

### Advanced CMS System (Beta)
- **Admin CMS Dashboard**: Comprehensive content management interface for administrators
- **User Analytics**: Detailed user behavior tracking and engagement metrics
- **Content Management Tools**: Advanced content creation and organization features
- **Dashboard Customization**: Configurable admin dashboard layouts and widgets

*Status*: Core functionality implemented, advanced features and UI improvements ongoing

### Detailed Progress Analytics (Beta)
- **Enhanced Progress Tracking**: Visual progress indicators with completion percentages
- **Gamification System**: Experience points, achievement badges, and learning streaks
- **Learning Journey Visualization**: Interactive progress maps and milestone celebrations
- **Advanced Metrics**: Detailed learning analytics and performance insights

*Status*: Basic implementation complete, advanced visualizations and AI-powered insights in development

> 💡 **Note**: Beta features are actively being improved based on user feedback. If you encounter issues or have suggestions, please let us know!

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

## ⚡ Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/lms-system.git
cd lms-system

# Run automated setup script
# Windows:
setup.bat

# Linux/Mac:
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

#### Step 1: Frontend Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Generate NextAuth secret
openssl rand -base64 32
# Add this to .env.local as NEXTAUTH_SECRET
```

#### Step 2: Backend Setup
```bash
cd laravel-backend

# Install dependencies
composer install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations and seed database
php artisan migrate --seed
```

#### Step 3: Start Servers
```bash
# Terminal 1 - Backend
cd laravel-backend && php artisan serve

# Terminal 2 - Frontend  
npm run dev
```

</details>

### 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api (shows available endpoints)

## 🔑 Demo Accounts

After running the database seeder, you can login with:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| 👑 **Admin** | `admin@lms.com` | `admin123` | Full system access, user management, content moderation |
| 👨‍🏫 **Teacher** | `teacher@lms.com` | `teacher123` | Content creation, topic management, analytics access |
| 👨‍🎓 **Student** | `student@lms.com` | `student123` | Learning access, community participation, progress tracking |

⚠️ **Important**: These are the ONLY valid test credentials. Always use `@lms.com` emails across all development environments.

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

## 📚 Project Documentation

### Essential Reading
- 📖 **[Setup Guide](SETUP_GUIDE.md)** - Comprehensive setup and troubleshooting
- 🏗️ **[Architecture Overview](ARCHITECTURE_OVERVIEW.md)** - System design and structure  
- 🔧 **[Cross-PC Troubleshooting](CROSS_PC_TROUBLESHOOTING.md)** - Multi-environment issues
- 🚀 **[Laravel Backend Setup](LARAVEL_BACKEND_SETUP.md)** - Backend configuration guide
- 🔗 **[Next.js Integration](NEXTJS_LARAVEL_INTEGRATION.md)** - Frontend-backend integration
- 📡 **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- 🤝 **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- 🌍 **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint checking
npm run type-check   # TypeScript validation
npm run dev:alt      # Alternative dev server (port 3001)
```

**Backend:**
```bash
php artisan serve              # Development server (http://localhost:8000)
php artisan migrate           # Run database migrations
php artisan migrate:fresh     # Fresh migration (drops all tables)
php artisan db:seed          # Seed database with test data
php artisan migrate:status   # Check migration status
php artisan test            # Run PHPUnit tests
php artisan route:list      # Show all API routes
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

## 🔍 Common Issues & Quick Fixes

<details>
<summary><strong>🚨 Environment & Setup Issues</strong></summary>

### Missing NEXTAUTH_SECRET
```bash
# Generate secure secret
openssl rand -base64 32
# Add to .env.local: NEXTAUTH_SECRET=generated-secret
```

### Database Migration Errors
```bash
cd laravel-backend
php artisan migrate:status      # Check status
php artisan migrate            # Run pending migrations
php artisan migrate:fresh --seed  # Nuclear option: reset everything
```

### Port Already in Use
```bash
npx kill-port 3000           # Kill port 3000
npm run dev:alt              # Use port 3001 instead
```

### CORS/Authentication Errors
- Verify `SANCTUM_STATEFUL_DOMAINS=localhost:3000` in Laravel `.env`
- Check `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env.local`
- Clear browser cookies and restart servers

</details>

<details>
<summary><strong>💻 Cross-PC Development Issues</strong></summary>

### Wrong Login Credentials
- ✅ **ALWAYS use**: `admin@lms.com` / `admin123`
- ❌ **NEVER use**: `admin@example.com` or other variations

### New PC Setup Problems
1. Run automated setup: `setup.bat` (Windows) or `./setup.sh` (Linux/Mac)
2. If manual setup, ensure all migrations run: `php artisan migrate`
3. Check [Cross-PC Troubleshooting Guide](CROSS_PC_TROUBLESHOOTING.md)

</details>

<details>
<summary><strong>🎨 UI/UX Issues</strong></summary>

### Mobile Display Problems
- Ensure responsive classes: `sm:`, `md:`, `lg:`, `xl:`
- Check table overflow: use `overflow-x-auto`
- Test on real devices, not just browser dev tools

### Dark Mode Issues  
- Verify all components have `dark:` classes
- Check color contrast for accessibility
- Use consistent color palette: `gray-900`, `gray-800`, `gray-700`

</details>

For comprehensive troubleshooting, see **[Setup Guide](SETUP_GUIDE.md)** and **[Cross-PC Troubleshooting](CROSS_PC_TROUBLESHOOTING.md)**.

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