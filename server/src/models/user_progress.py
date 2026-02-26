from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.db.database import Base

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))

    status = Column(String, default="not-started")
    is_correct = Column(Boolean)
    time_taken = Column(Integer)  # seconds

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")