from sqlalchemy import Column, Integer, String, Text, Boolean, ARRAY
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
from src.db.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String, nullable=False)

    topics = Column(ARRAY(String))
    companies = Column(ARRAY(String))

    # NEW FIELDS
    schema = Column(JSON)        # store table structure
    examples = Column(JSON)      # expected output
    hints = Column(ARRAY(String))
    solution = Column(Text)

    is_active = Column(Boolean, default=True)

    # ✅ ADD THIS
    test_cases = relationship(
        "TestCase",
        back_populates="question",
        cascade="all, delete-orphan"
    )