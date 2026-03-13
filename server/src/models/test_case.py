from sqlalchemy import Boolean, Column, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from src.db.database import Base

class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    setup_sql = Column(Text)
    expected_output = Column(JSONB)
    is_hidden = Column(Boolean, default=False, nullable=False)

    question = relationship("Question", back_populates="test_cases")