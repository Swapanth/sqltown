from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict
from datetime import datetime, timedelta
import uuid
import bcrypt
from jose import jwt
from src.auth.dependencies import get_current_user, get_current_user_with_db
from src.auth.user_service import UserService
from src.db.database import get_db
from src.models.discussion_post import DiscussionPost
from src.models.interview_submission import InterviewSubmission
from src.models.user import User
from src.config.settings import settings
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# JWT Settings
SECRET_KEY = settings.DATABASE_URL  # Use a proper secret in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict

class ProfileUpdate(BaseModel):
    name: str | None = None
    bio: str | None = None
    phone_number: str | None = None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hashed password"""
    # Truncate password to 72 bytes if necessary (bcrypt limit)
    password_bytes = plain_password.encode('utf-8')[:72]
    return bcrypt.checkpw(password_bytes, hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt"""
    # Truncate password to 72 bytes if necessary (bcrypt limit)
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/signup", response_model=TokenResponse)
async def signup(signup_data: SignupRequest, db: Session = Depends(get_db)):
    """Register a new user with email and password"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == signup_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(signup_data.password)
    new_user = User(
        id=str(uuid.uuid4()),  # Generate UUID for local users
        email=signup_data.email,
        name=signup_data.name or signup_data.email.split('@')[0],
        auth_provider="local",
        email_verified=False,
        preferences={"password_hash": hashed_password}
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(new_user.id), "email": new_user.email, "name": new_user.name}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user.to_dict()
    }

@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login with email and password"""
    # Find user by email
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    stored_password_hash = user.preferences.get("password_hash") if user.preferences else None
    if not stored_password_hash or not verify_password(login_data.password, stored_password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "name": user.name}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.to_dict()
    }

@router.get("/health")
async def health_check():
    """Public health check endpoint"""
    return {"status": "healthy", "service": "auth-api"}

@router.get("/me")
async def get_user_profile(current_user: User = Depends(get_current_user_with_db)):
    """
    Get current user profile from database.
    User is auto-created/updated on first request after login.
    """
    return current_user.to_dict()

@router.put("/me")
async def update_user_profile(
    profile_update: ProfileUpdate,
    current_user: User = Depends(get_current_user_with_db),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    updated_user = UserService.update_user_profile(
        db,
        current_user.id,
        name=profile_update.name,
        bio=profile_update.bio,
        phone_number=profile_update.phone_number
    )
    
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return updated_user.to_dict()

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user_with_db)):
    """
    Backend logout handler.
    Frontend should clear tokens and redirect.
    """
    return {"message": "Logged out successfully", "user_id": current_user.id}

@router.get("/public")
async def public_endpoint(user: Dict | None = Depends(get_current_user)):
    """
    Example public endpoint that shows different content for authenticated users.
    """
    if user:
        return {
            "message": f"Hello, {user.get('name', 'User')}!",
            "authenticated": True,
            "user_id": user.get("sub")
        }
    else:
        return {
            "message": "Hello, Guest!",
            "authenticated": False
        }


@router.get("/activity")
async def get_auth_activity(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_with_db),
):
    total_submissions = (
        db.query(InterviewSubmission)
        .filter(InterviewSubmission.user_id == current_user.id)
        .count()
    )
    accepted_submissions = (
        db.query(InterviewSubmission)
        .filter(
            InterviewSubmission.user_id == current_user.id,
            InterviewSubmission.status == "Accepted",
        )
        .count()
    )

    discussion_posts = (
        db.query(DiscussionPost)
        .filter(
            DiscussionPost.user_id == current_user.id,
            DiscussionPost.parent_id.is_(None),
        )
        .count()
    )
    discussion_replies = (
        db.query(DiscussionPost)
        .filter(
            DiscussionPost.user_id == current_user.id,
            DiscussionPost.parent_id.isnot(None),
        )
        .count()
    )

    return {
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "auth_provider": current_user.auth_provider,
            "last_login": current_user.last_login.isoformat() if current_user.last_login else None,
        },
        "metrics": {
            "total_submissions": total_submissions,
            "accepted_submissions": accepted_submissions,
            "discussion_posts": discussion_posts,
            "discussion_replies": discussion_replies,
        },
    }
