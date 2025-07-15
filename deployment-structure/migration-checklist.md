# Migration Checklist

## ✅ Issues Fixed
- [x] Fixed `getRecentAssessmentHistory` function error
- [x] Fixed `addAssessment` vs `createAssessment` mismatch
- [x] Fixed `isLessonCompleted` missing function
- [x] Fixed `canTakeAssessment` missing function  
- [x] Fixed `getAssessmentByTopicId` alias
- [x] Added missing assessment attempt functions
- [x] Updated API client to use environment variables
- [x] Created deployment configuration files

## 🚀 Next Steps

### 1. Immediate Actions
- [ ] Test the current localhost:3000 setup to verify all functions work
- [ ] Run type checking: `npm run type-check`
- [ ] Run linting: `npm run lint`

### 2. Backend Repository Setup
- [ ] Create new GitHub repository: `lms-backend`
- [ ] Copy Laravel backend files to repository root
- [ ] Update CORS configuration for Vercel domain
- [ ] Deploy to Laravel Cloud

### 3. Frontend Repository Setup  
- [ ] Create new GitHub repository: `lms-frontend`
- [ ] Copy all files except Laravel backend
- [ ] Update package.json to frontend version
- [ ] Configure environment variables
- [ ] Deploy to Vercel

### 4. Final Configuration
- [ ] Update Laravel Cloud environment variables
- [ ] Update Vercel environment variables
- [ ] Test cross-domain authentication
- [ ] Verify all API endpoints work
- [ ] Test user registration/login flow
- [ ] Test assessment creation/taking
- [ ] Test lesson completion tracking

## 🔧 Environment Variables to Set

### Vercel (Frontend)
```
NEXT_PUBLIC_API_URL=https://your-laravel-cloud-app.dev
NEXTAUTH_URL=https://your-frontend-app.vercel.app
NEXTAUTH_SECRET=your-secure-secret
```

### Laravel Cloud (Backend)
```
FRONTEND_URL=https://your-frontend-app.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-frontend-app.vercel.app
SESSION_DOMAIN=.vercel.app
APP_KEY=base64:your-generated-key
```

## 📋 Testing Checklist
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads correctly
- [ ] Topics display properly
- [ ] Lessons can be viewed/completed
- [ ] Assessments can be created/taken
- [ ] Assessment history shows correctly
- [ ] User management works (admin)
- [ ] Profile updates work
- [ ] File uploads work (if applicable)

## 🐛 Common Issues & Solutions

### CORS Errors
- Check `FRONTEND_URL` in Laravel backend
- Verify `SANCTUM_STATEFUL_DOMAINS` matches Vercel domain
- Ensure `withCredentials: true` in API client

### Authentication Issues
- Verify `NEXTAUTH_URL` matches actual Vercel URL
- Check `NEXTAUTH_SECRET` is set and consistent
- Ensure session configuration is correct

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` points to correct Laravel Cloud URL
- Check Laravel Cloud app is running and accessible
- Test API endpoints directly with curl/Postman

### Function Errors
All localStorage-related function errors should now be fixed:
- `getRecentAssessmentHistory` ✅
- `addAssessment` ✅
- `isLessonCompleted` ✅ 
- `canTakeAssessment` ✅
- `getAssessmentByTopicId` ✅