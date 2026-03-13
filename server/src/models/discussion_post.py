from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from src.db.database import Base


class DiscussionPost(Base):
    __tablename__ = "discussion_posts"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), index=True, nullable=False)
    user_id = Column(String(255), ForeignKey("users.id"), index=True, nullable=False)
    parent_id = Column(Integer, ForeignKey("discussion_posts.id"), index=True)

    post_type = Column(String(20), nullable=False, default="General")
    title = Column(String(255))
    content = Column(Text, nullable=False)
    votes = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User")
    question = relationship("Question")
    parent = relationship("DiscussionPost", remote_side=[id], backref="children")

    def to_dict(self):
        return {
            "id": self.id,
            "question_id": self.question_id,
            "user_id": self.user_id,
            "parent_id": self.parent_id,
            "post_type": self.post_type,
            "title": self.title,
            "content": self.content,
            "votes": self.votes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "author": {
                "id": self.user.id,
                "name": self.user.name,
                "email": self.user.email,
            } if self.user else None,
        }
