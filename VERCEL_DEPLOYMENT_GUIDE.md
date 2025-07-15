# Frontend Deployment to Vercel

## 🎯 Current Status
- ✅ Backend deployed: https://learning-management-system-master-zcttuk.laravel.cloud/
- ⏳ Frontend ready for Vercel deployment

## 📋 Pre-Deployment Checklist

### 1. Files Already Configured ✅
- `vercel.json` - Vercel configuration with Laravel Cloud API URL
- `.env.production` - Production environment variables template
- `hooks/use-api-data-store.ts` - All function errors fixed
- API client configured to use environment variables

### 2. Test Local Connection First
```bash
# Your .env.local is already updated to use Laravel Cloud
npm run dev
# Visit http://localhost:3000 and test the connection
```

## 🚀 Deploy to Vercel

### Option 1: Quick Deploy (Recommended)
1. Go to [vercel.com](https://vercel.com) and login
2. Click "Import Project"
3. Connect your GitHub account if not already connected
4. Import this repository: `JamesNgo0710/lms-system`
5. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` = `https://learning-management-system-master-zcttuk.laravel.cloud`
   - `NEXTAUTH_URL` = `https://your-app-name.vercel.app` (you'll update this after first deploy)
   - `NEXTAUTH_SECRET` = `/3HAabppz4ppBDzZXPKJrTPQ2L4vdlEGNwhmDdGYvwU=`
6. Click "Deploy"
7. After deployment, get your actual Vercel URL and update `NEXTAUTH_URL`

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from this directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? Your account
# - Link to existing project? N
# - Project name: lms-frontend (or your choice)
# - Directory: ./ (current directory)

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://learning-management-system-master-zcttuk.laravel.cloud

vercel env add NEXTAUTH_URL  
# Enter: https://your-app-name.vercel.app (you'll get this after first deploy)

vercel env add NEXTAUTH_SECRET
# Enter: /3HAabppz4ppBDzZXPKJrTPQ2L4vdlEGNwhmDdGYvwU=

# Deploy again with environment variables
vercel --prod
```

## 🔧 Post-Deployment Configuration

### 1. Update Backend CORS Settings
After you get your Vercel URL (e.g., `https://lms-frontend-abc123.vercel.app`), update the Laravel Cloud backend:

1. Go to your Laravel Cloud dashboard
2. Update environment variables:
   ```
   FRONTEND_URL=https://your-actual-vercel-url.vercel.app
   SANCTUM_STATEFUL_DOMAINS=your-actual-vercel-url.vercel.app
   SESSION_DOMAIN=.vercel.app
   ```
3. Redeploy the backend

### 2. Update NextAuth URL
1. In Vercel dashboard, go to your project settings
2. Update `NEXTAUTH_URL` to your actual Vercel URL
3. Redeploy frontend

## 🧪 Testing Checklist

After deployment, test these features:
- [ ] Frontend loads without errors
- [ ] API connection works (check browser console)
- [ ] User registration/login works
- [ ] Dashboard displays correctly
- [ ] Topics and lessons load
- [ ] Assessment functionality works
- [ ] No CORS errors in browser console

## 🐛 Troubleshooting

### CORS Errors
- Check Laravel Cloud environment variables
- Ensure `SANCTUM_STATEFUL_DOMAINS` matches your Vercel domain
- Verify `supports_credentials: true` in Laravel CORS config

### Authentication Issues
- Check `NEXTAUTH_URL` matches your Vercel domain
- Verify `NEXTAUTH_SECRET` is set correctly
- Check browser cookies are not blocked

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` in Vercel settings
- Check Laravel Cloud app is running
- Test API endpoints directly: `https://learning-management-system-master-zcttuk.laravel.cloud/api/topics`

## 📊 Expected Result

After successful deployment:
- Frontend: `https://your-app-name.vercel.app`
- Backend: `https://learning-management-system-master-zcttuk.laravel.cloud`
- Full cross-domain functionality working
- All "is not a function" errors resolved
- Production-ready LMS system

## 💰 Cost Summary
- **Vercel**: Free tier (100GB bandwidth, 100 function executions)
- **Laravel Cloud**: Free tier (as configured)
- **Total**: $0/month with usage limits