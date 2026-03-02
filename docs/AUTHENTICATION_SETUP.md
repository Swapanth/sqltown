# 🔐 Authentication Setup Guide

**Status:** ✅ Authentication is now **optional** - the application works without AWS Cognito

---

## Current Configuration

The application is configured to work **with or without** AWS Cognito authentication:

- **✅ Without Auth:** Users can explore all features freely
- **🔒 With Auth:** Set up AWS Cognito for user management, progress tracking, and OAuth

---

## Option 1: Run Without Authentication (Quick Start)

**No setup needed!** The application is already configured to work without authentication.

### What Works:
- ✅ SQL Interview Questions
- ✅ Code Execution & Testing
- ✅ Schema Visualization
- ✅ Documentation
- ✅ Playground Features

### What's Disabled:
- ❌ User Login/Signup
- ❌ Progress Tracking
- ❌ Personalized Features
- ❌ OAuth with Google

### Error Handling:
When users try to sign up/login without Cognito configured, they see:
```
⚠️ Authentication is currently disabled. 
You can still explore the application without signing in.
→ Continue to application
```

---

## Option 2: Enable Full Authentication (Production)

### Prerequisites:
1. AWS Account
2. AWS Cognito User Pool
3. Cognito App Client configured
4. Hosted UI domain set up

### Setup Steps:

#### 1. Create AWS Cognito User Pool

```bash
# Go to AWS Console → Cognito → User Pools → Create User Pool
```

**Configuration:**
- Sign-in options: Email
- Password requirements: Default
- MFA: Optional
- Email provider: Amazon SES or Cognito
- App client: Create new (type: Public client)
- Hosted UI: Enable domain (e.g., `sqltown.auth.us-east-1.amazoncognito.com`)

#### 2. Configure OAuth

In your Cognito User Pool → App Integration → App Client:

**Callback URLs:**
```
http://localhost:5173/callback
https://yourdomain.com/callback
```

**Sign-out URLs:**
```
http://localhost:5173
https://yourdomain.com
```

**OAuth Flows:**
- ✅ Authorization code grant
- ✅ Implicit grant (for testing)

**OAuth Scopes:**
- ✅ openid
- ✅ email  
- ✅ profile

#### 3. (Optional) Configure Google OAuth

In Cognito → Identity Providers:
1. Add Google as identity provider
2. Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
3. Configure client ID and secret
4. Add scopes: `profile`, `email`, `openid`

#### 4. Update Frontend Environment Variables

Edit `/frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000

# AWS Cognito Configuration
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_DOMAIN=sqltown.auth.us-east-1.amazoncognito.com
VITE_REDIRECT_URI=http://localhost:5173/callback
```

**Where to find these values:**
- `VITE_COGNITO_USER_POOL_ID`: Cognito → User Pools → Your Pool → Pool ID
- `VITE_COGNITO_CLIENT_ID`: User Pool → App Integration → App Client → Client ID
- `VITE_COGNITO_DOMAIN`: User Pool → App Integration → Domain → Domain prefix
- `VITE_REDIRECT_URI`: Must match callback URL configured in Cognito

#### 5. Update Backend Environment Variables

Edit `/server/.env`:

```env
# AWS Cognito Configuration
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
COGNITO_JWKS_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX/.well-known/jwks.json
COGNITO_ISSUER=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX
```

#### 6. Restart Both Servers

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd server
source venv/bin/activate  # or: venv\Scripts\activate on Windows
uvicorn main:app --host 0.0.0.0 --port 3000 --reload
```

#### 7. Test Authentication

1. Go to `http://localhost:5173/signup`
2. Click "Sign Up with Email" → Should redirect to Cognito Hosted UI
3. Create account and verify email
4. Login should work and redirect back with token

---

## Code Changes Made

### 1. **Frontend - Optional Cognito Configuration**

`src/config/aws-config.ts`:
```typescript
// Only configures Amplify if Cognito credentials exist
const isCognitoConfigured = userPoolId && userPoolClientId && cognitoDomain;
if (isCognitoConfigured) {
  Amplify.configure(awsConfig);
}
```

### 2. **Frontend - Auth Service Guards**

`src/services/authService.ts`:
```typescript
const isCognitoConfigured = () => {
    return !!(import.meta.env.VITE_COGNITO_USER_POOL_ID);
};

signInWithHostedUI: async () => {
    if (!isCognitoConfigured()) {
        throw new Error('Authentication is not configured...');
    }
    // ... rest of the code
}
```

### 3. **Frontend - User-Friendly Error Messages**

`src/pages/auth/LoginPage.tsx` & `SignupPage.tsx`:
```typescript
if (errorMessage.includes('not configured')) {
    setError('Authentication is currently disabled. You can explore without signing in.');
}
```

### 4. **Backend - Optional Authentication**

Endpoints like `/api/sql/execute` work without authentication:
```python
@router.post("/execute")
def execute_sql(
    payload: dict,
    db: Session = Depends(get_db)
    # No current_user dependency - public access
):
```

---

## Environment Variables Reference

### Frontend (frontend/.env)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | ✅ Yes | `http://localhost:3000` | Backend API URL |
| `VITE_COGNITO_USER_POOL_ID` | ⚠️ Optional | `us-east-1_ABC123` | Cognito User Pool ID |
| `VITE_COGNITO_CLIENT_ID` | ⚠️ Optional | `1a2b3c4d5e6f7g8h9i` | Cognito App Client ID |
| `VITE_COGNITO_DOMAIN` | ⚠️ Optional | `app.auth.region.amazoncognito.com` | Hosted UI Domain |
| `VITE_REDIRECT_URI` | ⚠️ Optional | `http://localhost:5173/callback` | OAuth Callback URL |

### Backend (server/.env)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | `postgresql://user:pass@localhost/db` | PostgreSQL connection |
| `PORT` | ✅ Yes | `3000` | Server port |
| `AWS_REGION` | ⚠️ Optional | `us-east-1` | AWS Region |
| `COGNITO_USER_POOL_ID` | ⚠️ Optional | `us-east-1_ABC123` | For JWT verification |
| `COGNITO_CLIENT_ID` | ⚠️ Optional | `1a2b3c4d5e6f7g8h9i` | For JWT verification |
| `COGNITO_JWKS_URL` | ⚠️ Optional | `https://cognito-idp.../.well-known/jwks.json` | JWT key verification |

---

## Troubleshooting

### Issue: "Auth UserPool not configured"

**Solution:** This is expected when running without Cognito. Users can click "Continue to application" to proceed.

### Issue: "Invalid redirect_uri"

**Solution:** 
1. Check that `VITE_REDIRECT_URI` matches callback URL in Cognito
2. Ensure callback URL includes `/callback` path
3. Add both `http://localhost:5173/callback` and production URL

### Issue: "Invalid client_id"

**Solution:**
1. Verify `VITE_COGNITO_CLIENT_ID` matches App Client ID in Cognito
2. Check that App Client type is "Public client"

### Issue: JWT verification fails on backend

**Solution:**
1. Ensure backend `COGNITO_USER_POOL_ID` matches frontend
2. Verify `COGNITO_JWKS_URL` is accessible
3. Check AWS region matches

---

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use HTTPS in production** - Required for OAuth
3. **Rotate credentials regularly** - Especially App Client secrets
4. **Enable MFA** - For production user accounts
5. **Monitor Cognito logs** - Check for suspicious activity
6. **Set session timeouts** - Configure in Cognito settings

---

## Next Steps

### For Development (No Auth):
✅ You're all set! Just run the servers and start coding.

### For Production (With Auth):
1. ⬜ Create AWS Cognito User Pool
2. ⬜ Configure Hosted UI domain
3. ⬜ Set up Google OAuth (optional)
4. ⬜ Update environment variables
5. ⬜ Test authentication flow
6. ⬜ Deploy with HTTPS

---

**Questions?** Check the main [README](../README.md) or create an issue.
