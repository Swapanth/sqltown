from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.db.database import get_db
from src.models.question import Question
from src.schemas.question import QuestionResponse
from sqlalchemy.orm import joinedload

router = APIRouter(prefix="/api/questions", tags=["Questions"])


@router.get("/", response_model=List[QuestionResponse])
def get_questions(db: Session = Depends(get_db)):
    """Get all questions"""
    try:
        questions = db.query(Question).filter(Question.is_active == True).all()
        return questions
    except Exception as e:
        print(f"Error fetching questions: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    """Get a single question by ID"""
    try:
        question = (
            db.query(Question)
            .options(joinedload(Question.test_cases))  # 🔥 ADD THIS
            .filter(
                Question.id == question_id,
                Question.is_active == True
            )
            .first()
        )
        
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        
        return question

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching question {question_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))