from fastapi import Depends
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.models.user import User
from src.core.security import verify_token

def get_current_user(
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user_id = token_data["sub"]

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        user = User(
            id=user_id,
            email=token_data.get("email"),
            name=token_data.get("name"),
            auth_provider="Cognito"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user