from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.models.user_progress import UserProgress
from src.auth.dependencies import get_current_user_with_db
from src.models.user import User

router = APIRouter(prefix="/api/progress", tags=["Progress"])

@router.post("/submit")
def submit_progress(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_with_db)
):
    progress = UserProgress(
        user_id=current_user.id,
        question_id=payload.get("question_id"),
        status="completed",
        is_correct=True,
        time_taken=payload.get("time_taken", 0)
    )

    db.add(progress)
    db.commit()

    return {"message": "Submission recorded successfully"}