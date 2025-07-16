@echo off
echo Deploying backend CORS configuration...
cd "E:\lms-backend"
git add config/cors.php config/sanctum.php
git commit -m "fix: Update CORS and Sanctum config for all Vercel domains

- Add all Vercel domains including lms-system-lac.vercel.app
- Update Sanctum stateful domains to include all Vercel domains
- Ensures frontend can communicate with backend API from any deployment

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin master
echo Done! Backend CORS configuration has been deployed.
pause