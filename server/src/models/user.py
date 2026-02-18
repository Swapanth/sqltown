from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func
from src.db.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    # Primary key - Cognito sub
    id = Column(String(255), primary_key=True, index=True)
    
    # Authentication
    email = Column(String(255), unique=True, nullable=False, index=True)
    email_verified = Column(Boolean, default=False)
    cognito_username = Column(String(255))
    
    # Profile
    name = Column(String(255))
    picture_url = Column(Text)
    
    # Provider
    auth_provider = Column(String(50), nullable=False, default="Cognito", index=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), server_default=func.now())
    
    # Additional fields
    phone_number = Column(String(20))
    bio = Column(Text)
    preferences = Column(JSON, default={})
    
    # Soft delete
    is_active = Column(Boolean, default=True)
    deleted_at = Column(DateTime(timezone=True))
    
    def __repr__(self):
        return f"<User {self.email}>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "email_verified": self.email_verified,
            "auth_provider": self.auth_provider,
            "picture_url": self.picture_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_login": self.last_login.isoformat() if self.last_login else None,
        }
