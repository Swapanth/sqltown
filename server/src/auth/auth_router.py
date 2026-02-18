from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict
from src.auth.dependencies import get_current_user, get_current_user_with_db
from src.auth.user_service import UserService
from src.db.database import get_db
from src.models.user import User
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class ProfileUpdate(BaseModel):
    name: str | None = None
    bio: str | None = None
    phone_number: str | None = None

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
