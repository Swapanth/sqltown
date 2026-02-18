from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Dict, Optional
from src.auth.jwt_verifier import get_jwt_verifier, CognitoJWTVerifier
from src.db.database import get_db
from src.auth.user_service import UserService
from src.models.user import User

# Security scheme for Swagger UI
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    jwt_verifier: CognitoJWTVerifier = Depends(get_jwt_verifier)
) -> Dict:
    """
    Dependency to extract and verify JWT token from Authorization header.
    Returns JWT claims without database interaction.
    
    Usage:
        @app.get("/protected")
        async def protected_route(user: Dict = Depends(get_current_user)):
            return {"user_id": user["sub"]}
    
    Returns:
        Dict: Decoded JWT claims containing user information
    """
    token = credentials.credentials
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify token and return claims
    claims = jwt_verifier.verify_token(token)
    return claims

async def get_current_user_with_db(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    jwt_verifier: CognitoJWTVerifier = Depends(get_jwt_verifier),
    db: Session = Depends(get_db)
) -> User:
    """
    Enhanced dependency that:
    1. Verifies JWT token
    2. Auto-creates/updates user in database
    3. Returns User model instance
    
    This ensures every authenticated request syncs user data.
    """
    token = credentials.credentials
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify JWT and get claims
    claims = jwt_verifier.verify_token(token)
    
    # Get or create user in database
    try:
        user = UserService.get_or_create_user(db, claims)
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sync user: {str(e)}"
        )

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    jwt_verifier: CognitoJWTVerifier = Depends(get_jwt_verifier)
) -> Optional[Dict]:
    """
    Optional authentication - returns None if no token provided.
    Useful for routes that have different behavior for authenticated vs anonymous users.
    """
    if not credentials:
        return None
    
    try:
        claims = jwt_verifier.verify_token(credentials.credentials)
        return claims
    except HTTPException:
        return None

def require_verified_email(user: Dict = Depends(get_current_user)) -> Dict:
    """
    Additional dependency to ensure user has verified email.
    Chain with get_current_user.
    """
    if not user.get('email_verified', False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email verification required"
        )
    return user
