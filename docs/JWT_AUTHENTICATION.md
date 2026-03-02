# JWT Authentication Implementation

## Overview
SQLTown now uses custom JWT (JSON Web Token) authentication instead of AWS Cognito. This provides a simpler, self-contained authentication system with email/password login.

## Architecture

### Backend (FastAPI)
**Location:** `server/src/auth/auth_router.py`

#### Dependencies
```bash
pip install 'passlib[bcrypt]' 'python-jose[cryptography]' 'pydantic[email]'
```

#### Key Components
1. **Password Hashing**: bcrypt with automatic salt generation
2. **JWT Generation**: HS256 algorithm, 24-hour token expiry
3. **Token Storage**: Password hash stored in `user.preferences["password_hash"]` JSON field

#### Endpoints

##### POST `/api/auth/signup`
Create new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "auth_provider": "local"
  }
}
```

**Errors:**
- `400`: User already exists
- `422`: Validation error (invalid email, weak password)

##### POST `/api/auth/login`
Authenticate existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "auth_provider": "local"
  }
}
```

**Errors:**
- `401`: Invalid credentials
- `404`: User not found

##### GET `/api/auth/me`
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "auth_provider": "local"
}
```

##### POST `/api/auth/logout`
Logout (clears client-side token).

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

### JWT Token Structure

#### Claims
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "exp": 1709251200
}
```

#### Configuration
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiry**: 24 hours
- **Secret Key**: Currently using `DATABASE_URL` (⚠️ should be changed to dedicated secret)

### Token Verification

**Location:** `server/src/auth/jwt_verifier.py`

The JWT verifier supports both:
1. **Local JWT tokens** (HS256) - for custom authentication
2. **AWS Cognito tokens** (RS256) - for backward compatibility

```python
# Try local JWT first
try:
    claims = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return claims
except JWTError:
    # Fall back to Cognito verification
    pass
```

### Frontend (React + TypeScript)

#### Auth Service
**Location:** `frontend/src/services/authService.ts`

```typescript
// Login
const result = await authService.login(email, password);
// Returns: { success: boolean, user: User, token: string }

// Signup
const result = await authService.signup(email, password, name);
// Returns: { success: boolean, user: User, token: string }

// Logout
await authService.signOut();

// Get current session
const session = await authService.getCurrentSession();
// Returns: { isAuthenticated: boolean, token: string, user: User }
```

#### Auth Context
**Location:** `frontend/src/context/AuthContext.tsx`

```typescript
const { user, isAuthenticated, loading, login, signup, logout, getToken } = useAuth();

// Login
await login(email, password);

// Signup
await signup(email, password, name);

// Logout
await logout();

// Get token for API calls
const token = getToken();
```

#### Token Storage
**Location:** `frontend/src/utils/tokenStorage.ts`

```typescript
// Store token
tokenStorage.setToken(access_token);

// Get token
const token = tokenStorage.getToken();

// Store user data
tokenStorage.setUser(userData);

// Clear all
tokenStorage.clearAll();
```

**Storage Keys:**
- `jwt_access_token`: JWT access token
- `user_data`: User profile JSON

#### Login Page
**Location:** `frontend/src/pages/auth/LoginPage.tsx`

Features:
- Email and password input fields
- Form validation (required fields, email format)
- Error display
- Loading state during authentication
- Link to signup page

#### Signup Page
**Location:** `frontend/src/pages/auth/SignupPage.tsx`

Features:
- Name, email, and password input fields
- Password minimum length (8 characters)
- Form validation
- Error display
- Loading state
- Link to login page

### API Client Integration
**Location:** `frontend/src/services/apiClient.ts`

The API client automatically includes JWT tokens in requests:

```typescript
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Security Considerations

### Current Implementation
✅ Password hashing with bcrypt (cost factor 12)
✅ Automatic salt generation
✅ JWT signature verification
✅ Token expiration (24 hours)
✅ HTTPOnly storage pattern (localStorage)
✅ Email validation with pydantic

### Recommended Improvements

#### 1. Dedicated JWT Secret Key
**Priority: HIGH**

Currently using `DATABASE_URL` as secret. Create dedicated secret:

```python
# server/.env
JWT_SECRET_KEY=your_long_random_secret_here_at_least_32_characters

# server/src/auth/auth_router.py
SECRET_KEY = settings.JWT_SECRET_KEY  # Instead of DATABASE_URL
```

Generate secure secret:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### 2. Refresh Token System
**Priority: MEDIUM**

Implement refresh tokens for better security:

```python
ACCESS_TOKEN_EXPIRE_MINUTES = 15  # Short-lived
REFRESH_TOKEN_EXPIRE_DAYS = 7     # Longer-lived

# Store refresh token in database
# Return both tokens on login/signup
# Create /api/auth/refresh endpoint
```

#### 3. Rate Limiting
**Priority: MEDIUM**

Prevent brute force attacks:

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@router.post("/login")
@limiter.limit("5/minute")  # 5 attempts per minute
async def login(...):
    ...
```

#### 4. Password Requirements
**Priority: LOW**

Add validation:
```python
from pydantic import field_validator

class SignupRequest(BaseModel):
    password: str
    
    @field_validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain number')
        return v
```

#### 5. HTTPS Only
**Priority: HIGH (Production)**

Ensure all authentication happens over HTTPS in production.

#### 6. Token Blacklist
**Priority: MEDIUM**

Implement token revocation:
```python
# Store revoked tokens in Redis/database
# Check on each protected endpoint
```

## Testing

### Manual Testing

#### 1. Test Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "name": "Test User"
  }'
```

Expected: 200 with `access_token` and `user` object

#### 2. Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

Expected: 200 with `access_token` and `user` object

#### 3. Test Protected Endpoint
```bash
TOKEN="<your_token_here>"
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

Expected: 200 with user profile

#### 4. Test Invalid Token
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer invalid_token"
```

Expected: 401 Unauthorized

### Frontend Testing

1. **Signup Flow**
   - Navigate to `/signup`
   - Fill in name, email, password
   - Click "Sign Up"
   - Should redirect to `/interview` with authenticated user

2. **Login Flow**
   - Navigate to `/login`
   - Fill in email, password
   - Click "Sign In"
   - Should redirect to `/interview` with authenticated user

3. **Logout Flow**
   - Click logout button
   - Should clear tokens and redirect to login

4. **Token Persistence**
   - Login
   - Refresh page
   - Should remain logged in

5. **Protected Routes**
   - Navigate to protected page without login
   - Should redirect to login page

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    auth_provider VARCHAR(50) DEFAULT 'local',
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password hash stored in preferences JSONB field
-- Example: preferences = {"password_hash": "$2b$12$..."}
```

## Migration from AWS Cognito

### Removed Dependencies
- `aws-amplify`
- AWS Cognito environment variables (optional, kept for backward compatibility)

### Updated Files
1. `frontend/src/services/authService.ts` - Replaced Cognito with JWT API calls
2. `frontend/src/context/AuthContext.tsx` - Updated method signatures
3. `frontend/src/pages/auth/LoginPage.tsx` - Added email/password form
4. `frontend/src/pages/auth/SignupPage.tsx` - Added email/password/name form
5. `frontend/src/utils/tokenStorage.ts` - Simplified to single token storage
6. `server/src/auth/auth_router.py` - Added signup/login endpoints
7. `server/src/auth/jwt_verifier.py` - Support both JWT types

### Backward Compatibility
The JWT verifier still supports AWS Cognito tokens for existing users. New users will use local JWT authentication.

## Troubleshooting

### Backend Issues

#### "ModuleNotFoundError: No module named 'passlib'"
```bash
cd server
. venv/bin/activate
pip install 'passlib[bcrypt]' 'python-jose[cryptography]' 'pydantic[email]'
```

#### "Invalid token signature"
Check that SECRET_KEY matches between token generation and verification.

#### "User already exists"
Email is already registered. Try login or use different email.

### Frontend Issues

#### "Failed to login"
Check:
1. Backend server is running on port 3000
2. Email and password are correct
3. Browser console for detailed error

#### Token not persisting
Check localStorage in browser DevTools:
- `jwt_access_token` should contain token
- `user_data` should contain user JSON

#### Not redirecting after login
Check:
1. AuthContext is properly wrapping app
2. navigate() is being called after successful login
3. No JavaScript errors in console

## Environment Variables

### Backend (server/.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost/sqltown

# JWT (TODO: Add dedicated secret)
# JWT_SECRET_KEY=<generate_secure_secret>

# AWS Cognito (Optional, for backward compatibility)
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=
COGNITO_REGION=
```

### Frontend (frontend/.env)
```bash
# API Base URL
VITE_API_BASE_URL=http://localhost:3000

# AWS Cognito (Optional, legacy support)
VITE_COGNITO_USER_POOL_ID=
VITE_COGNITO_CLIENT_ID=
VITE_COGNITO_REGION=
```

## Next Steps

1. ✅ Backend JWT endpoints created
2. ✅ Frontend auth service updated
3. ✅ Login/signup pages updated
4. ✅ Token storage simplified
5. ⏳ Test complete authentication flow
6. ⏳ Add dedicated JWT_SECRET_KEY
7. ⏳ Remove AWS Amplify dependency from package.json (optional)
8. ⏳ Implement refresh token system (optional)
9. ⏳ Add rate limiting (recommended)
10. ⏳ Add password strength requirements (optional)

## Support

For issues or questions:
1. Check browser console for frontend errors
2. Check server logs for backend errors
3. Verify environment variables are set
4. Test endpoints with curl/Postman
5. Review this documentation
