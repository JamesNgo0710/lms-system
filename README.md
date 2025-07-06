# Learning Management System (LMS)

A comprehensive, configurable Learning Management System built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Configurable Branding**: Easy customization of app name, logo, and theme colors
- **Demo Mode**: Built-in demo data for testing and development
- **Role-Based Access**: Support for admin, teacher, and student roles
- **Topic Management**: Create and manage learning topics with lessons and assessments
- **Community Features**: Discussion forums with threaded replies
- **Assessment System**: Timed assessments with automatic grading
- **Progress Tracking**: Detailed analytics and reporting
- **Responsive Design**: Works on desktop and mobile devices
- **Theme Support**: Light and dark mode support

## 📋 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Application Configuration
NEXT_PUBLIC_APP_NAME="Your LMS Name"
NEXT_PUBLIC_APP_SHORT_NAME="LMS"
NEXT_PUBLIC_APP_DESCRIPTION="Your custom description"
NEXT_PUBLIC_APP_THEME_COLOR="#f97316"
NEXT_PUBLIC_APP_LOGO_URL="/your-logo.png"

# Demo Mode (set to "false" for production)
NEXT_PUBLIC_DEMO_MODE="true"
DEMO_ADMIN_EMAIL="admin@yourdomain.com"
DEMO_ADMIN_PASSWORD="your_admin_password"
DEMO_STUDENT_EMAIL="student@yourdomain.com"
DEMO_STUDENT_PASSWORD="your_student_password"

# Authentication
NEXTAUTH_SECRET="your-secret-key-for-production"
NEXTAUTH_URL="https://yourdomain.com"

# External Services
NEXT_PUBLIC_DEFAULT_AVATAR_URL="https://ui-avatars.com/api/?name={name}&background=f97316&color=fff"
NEXT_PUBLIC_PLACEHOLDER_IMAGE_URL="https://via.placeholder.com/400x225/f97316/ffffff?text=LMS+Content"

# Storage Configuration
NEXT_PUBLIC_STORAGE_PREFIX="your-app-data"
```

### Customization

#### 1. **Branding**
- Update `NEXT_PUBLIC_APP_NAME` and `NEXT_PUBLIC_APP_SHORT_NAME`
- Replace `/public/nft-logo.png` with your logo
- Modify `NEXT_PUBLIC_APP_THEME_COLOR` for your brand colors

#### 2. **Demo Data**
- Edit `lib/demo-data.ts` to customize demo content
- Update subject areas in `lib/constants.ts` under `SUBJECT_AREAS`
- Modify default user profiles and external courses

#### 3. **Content Areas**
- Update `SUBJECT_AREAS.categories` for your specific topics
- Modify `POST_CATEGORIES` for discussion forum categories
- Customize `DEFAULT_VALUES` for user profiles and topics

#### 4. **Social Media Links**
- Update social media URLs in environment variables
- Modify `SOCIAL_MEDIA` constants for your organization

## 🛠️ Development

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lms-system
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create your `.env.local` file (see Configuration section)

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Accounts

When `NEXT_PUBLIC_DEMO_MODE="true"`, you can use these default accounts:

- **Admin**: Use the email/password from `DEMO_ADMIN_EMAIL`/`DEMO_ADMIN_PASSWORD`
- **Student**: Use the email/password from `DEMO_STUDENT_EMAIL`/`DEMO_STUDENT_PASSWORD`
- **Learner**: learner@lms.com / learner123

## 🏗️ Architecture

### File Structure

```
lms-system/
├── app/                    # Next.js app router pages
├── components/            # React components
├── lib/                   # Utilities and configuration
│   ├── constants.ts       # App constants and configuration
│   ├── demo-data.ts       # Demo data configuration
│   ├── config.ts          # Environment configuration
│   └── data-store.ts      # Data management
├── hooks/                 # Custom React hooks
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

### Key Configuration Files

- **`lib/constants.ts`**: Main configuration file for app constants
- **`lib/demo-data.ts`**: Demo data and content templates
- **`lib/config.ts`**: Environment-specific configuration
- **`lib/data-store.ts`**: Data management and storage

## 📊 Data Management

The system uses localStorage for data persistence in development. For production, consider integrating with:

- **Database**: PostgreSQL, MySQL, or MongoDB
- **Authentication**: Auth0, Firebase Auth, or custom backend
- **File Storage**: AWS S3, Cloudinary, or similar
- **API**: REST or GraphQL backend

## 🔧 Customization Examples

### Adding New Subject Areas

1. Update `lib/constants.ts`:
```typescript
export const SUBJECT_AREAS = {
  default: "Your Default Subject",
  categories: [
    "Mathematics",
    "Science",
    "History",
    "Languages",
    // Add your subjects here
  ],
}
```

2. Update demo data in `lib/demo-data.ts`:
```typescript
export const getDemoTopics = () => [
  {
    id: 1,
    title: "Introduction to Mathematics",
    category: "Mathematics",
    // ... other properties
  },
  // Add more topics
]
```

### Customizing User Profiles

Update `lib/constants.ts`:
```typescript
export const DEFAULT_VALUES = {
  user: {
    firstName: "Your Default",
    lastName: "User Name",
    email: "user@yourdomain.com",
    bio: "Your default bio",
    website: "https://yourdomain.com",
    location: "Your City, Country",
    phone: "+1 (555) 000-0000",
  },
  // ... other defaults
}
```

### Adding Custom Themes

1. Update theme colors in `tailwind.config.ts`
2. Modify `NEXT_PUBLIC_APP_THEME_COLOR` in environment variables
3. Update color classes in components as needed

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

- **Netlify**: Add environment variables in site settings
- **AWS**: Use Amplify or EC2 with proper environment configuration
- **Docker**: Create `.env` file and mount as volume

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the configuration files

## 🔄 Data Migration

To migrate from demo data to production:

1. Set `NEXT_PUBLIC_DEMO_MODE="false"`
2. Implement backend API integration
3. Replace localStorage with database calls
4. Update authentication to use your provider
5. Configure file upload and storage

## 🧪 Testing

Run tests with:
```bash
npm test
# or
yarn test
# or
pnpm test
```

## 📈 Analytics

To add analytics:

1. Add `NEXT_PUBLIC_GA_ID` to environment variables
2. Implement tracking in `lib/config.ts`
3. Add tracking calls to components as needed 