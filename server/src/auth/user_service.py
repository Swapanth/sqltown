from sqlalchemy.orm import Session
from src.models.user import User
from typing import Dict, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class UserService:
    @staticmethod
    def get_or_create_user(db: Session, jwt_claims: Dict) -> User:
        """
        Get existing user or create new user from JWT claims.
        This is idempotent - safe to call on every request.
        
        Args:
            db: Database session
            jwt_claims: Decoded JWT token claims from Cognito
        
        Returns:
            User: User object (existing or newly created)
        """
        user_id = jwt_claims.get("sub")
        email = jwt_claims.get("email")
        
        if not user_id or not email:
            raise ValueError("JWT claims missing required fields: sub or email")
        
        # Try to find existing user
        user = db.query(User).filter(User.id == user_id).first()
        
        if user:
            # Update last login and potentially other fields
            user.last_login = datetime.utcnow()
            
            # Update email if changed (rare but possible)
            if user.email != email:
                user.email = email
            
            # Update email verification status
            user.email_verified = jwt_claims.get("email_verified", False)
            
            # Update name if provided and changed
            name = jwt_claims.get("name")
            if name and user.name != name:
                user.name = name
            
            db.commit()
            db.refresh(user)
            logger.info(f"Updated existing user: {user_id}")
            return user
        
        # Create new user
        provider = "Cognito"
        identities = jwt_claims.get("identities", [])
        if identities and len(identities) > 0:
            provider = identities[0].get("providerName", "Cognito")
        
        new_user = User(
            id=user_id,
            email=email,
            email_verified=jwt_claims.get("email_verified", False),
            cognito_username=jwt_claims.get("cognito:username", ""),
            name=jwt_claims.get("name"),
            auth_provider=provider,
            picture_url=jwt_claims.get("picture"),
            last_login=datetime.utcnow()
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"Created new user: {user_id} via {provider}")
        return new_user
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
        """Get user by Cognito sub"""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def update_user_profile(
        db: Session,
        user_id: str,
        name: Optional[str] = None,
        bio: Optional[str] = None,
        phone_number: Optional[str] = None,
        picture_url: Optional[str] = None
    ) -> Optional[User]:
        """Update user profile fields"""
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return None
        
        if name is not None:
            user.name = name
        if bio is not None:
            user.bio = bio
        if phone_number is not None:
            user.phone_number = phone_number
        if picture_url is not None:
            user.picture_url = picture_url
        
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def soft_delete_user(db: Session, user_id: str) -> bool:
        """Soft delete user (set is_active=False)"""
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return False
        
        user.is_active = False
        user.deleted_at = datetime.utcnow()
        db.commit()
        return True
