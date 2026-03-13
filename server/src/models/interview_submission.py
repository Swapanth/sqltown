from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from src.db.database import Base


class InterviewSubmission(Base):
    __tablename__ = "interview_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), ForeignKey("users.id"), index=True, nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), index=True, nullable=False)

    status = Column(String(20), nullable=False, default="Rejected")
    language = Column(String(50), nullable=False, default="MySQL")
    code = Column(Text, nullable=False)

    runtime_ms = Column(Integer)
    tests_passed = Column(Integer, default=0)
    tests_total = Column(Integer, default=0)
    visible_tests_passed = Column(Integer, default=0)
    visible_tests_total = Column(Integer, default=0)
    hidden_tests_passed = Column(Integer, default=0)
    hidden_tests_total = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User")
    question = relationship("Question")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "question_id": self.question_id,
            "status": self.status,
            "language": self.language,
            "code": self.code,
            "runtime_ms": self.runtime_ms,
            "tests_passed": self.tests_passed,
            "tests_total": self.tests_total,
            "visible_tests_passed": self.visible_tests_passed,
            "visible_tests_total": self.visible_tests_total,
            "hidden_tests_passed": self.hidden_tests_passed,
            "hidden_tests_total": self.hidden_tests_total,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
