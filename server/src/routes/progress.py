from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.models.user_progress import UserProgress
from src.core.dependencies import get_current_user
from src.models.user import User

router = APIRouter(prefix="/api/progress", tags=["Progress"])

@router.post("/submit")
def submit_progress(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    progress = UserProgress(
        user_id=current_user.id,
        question_id=payload["question_id"],
        status="completed",
        is_correct=True,
        time_taken=payload["time_taken"]
    )

    db.add(progress)
    db.commit()

    return {"message": "Submission recorded successfully"}