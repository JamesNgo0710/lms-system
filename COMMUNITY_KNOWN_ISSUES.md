# Community Forum - Known Issues

## 🚨 Current Issues to Fix

### 1. Double API Prefix Issue
**Problem**: API requests are hitting `/api/api/community/posts` instead of `/api/community/posts`

**Evidence**: 
- Laravel server logs show: `2025-07-09 21:33:03 /api/api/community/posts`
- Should be: `/api/community/posts`

**Likely Cause**: 
- `apiClient` baseURL is set to `${API_URL}/api` 
- Community service is calling `/api/community/posts`
- Results in double prefix: `/api` + `/api/community/posts`

**Fix Required**: Update community service to use relative paths without `/api` prefix

### 2. CSRF Token Issues for POST Requests
**Problem**: Creating posts fails with CSRF token errors

**Evidence**: Console shows 419 errors when submitting forms

**Likely Cause**: 
- CSRF token not being properly included in POST requests
- Token might be expired or not refreshed correctly

**Fix Required**: 
- Ensure CSRF token is obtained before POST requests
- Handle token refresh on 419 errors
- Verify Sanctum CSRF configuration

### 3. Authentication Token Transmission
**Problem**: POST requests may not be sending auth tokens properly

**Evidence**: 
- GET requests work (public routes)
- POST requests fail (authenticated routes)

**Fix Required**:
- Verify NextAuth session token is being included in headers
- Check if token format matches Laravel Sanctum expectations

## 📋 Next Steps

1. **Fix API URL construction** in community service
2. **Debug CSRF token handling** for authenticated requests  
3. **Verify authentication flow** for POST operations
4. **Test all forum functionality** after fixes

## 📁 Files to Modify

- `lib/services/community.service.ts` - Fix API URL construction
- `lib/api-client.ts` - Improve CSRF and auth token handling
- Test POST endpoints after fixes

## ✅ What's Working

- ✅ Database migrations completed
- ✅ Laravel models and relationships created
- ✅ API routes properly configured (public GET, authenticated POST)
- ✅ Frontend pages and components built
- ✅ Navigation updated
- ✅ GET requests working (viewing posts/comments)

## 🎯 Goal

Once the above issues are fixed, the community forum will be fully functional with:
- Post creation and editing
- Comment threading and replies
- Upvote/downvote system
- Admin moderation tools 