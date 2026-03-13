from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user_with_db
from src.db.database import get_db
from src.models.discussion_post import DiscussionPost
from src.models.interview_submission import InterviewSubmission
from src.models.question import Question
from src.models.user import User
from src.models.user_progress import UserProgress


router = APIRouter(prefix="/api/interview", tags=["Interview"])


@router.get("/submissions")
def get_user_submissions(
    question_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_with_db),
):
    query = db.query(InterviewSubmission).filter(InterviewSubmission.user_id == current_user.id)

    if question_id is not None:
        query = query.filter(InterviewSubmission.question_id == question_id)

    submissions = query.order_by(InterviewSubmission.created_at.desc()).all()
    return [submission.to_dict() for submission in submissions]


@router.get("/submissions/summary")
def get_user_submission_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_with_db),
):
    submissions = (
        db.query(InterviewSubmission)
        .filter(InterviewSubmission.user_id == current_user.id)
        .order_by(InterviewSubmission.created_at.desc())
        .all()
    )

    attempted_question_ids = sorted({submission.question_id for submission in submissions})
    completed_question_ids = sorted({
        submission.question_id for submission in submissions if submission.status == "Accepted"
    })

    latest_status_by_question: Dict[str, str] = {}
    for submission in submissions:
        key = str(submission.question_id)
        if key not in latest_status_by_question:
            latest_status_by_question[key] = submission.status

    return {
        "attempted_question_ids": attempted_question_ids,
        "completed_question_ids": completed_question_ids,
        "latest_status_by_question": latest_status_by_question,
        "total_submissions": len(submissions),
    }


@router.post("/submissions")
def create_submission(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_with_db),
):
    question_id = payload.get("question_id")
    if not question_id:
        raise HTTPException(status_code=400, detail="question_id is required")

    question_exists = db.query(Question.id).filter(Question.id == question_id).first()
    if not question_exists:
        raise HTTPException(status_code=404, detail="Question not found")

    submission = InterviewSubmission(
        user_id=current_user.id,
        question_id=question_id,
        status=payload.get("status", "Rejected"),
        language=payload.get("language", "MySQL"),
        code=payload.get("code", ""),
        runtime_ms=payload.get("runtime_ms"),
        tests_passed=payload.get("tests_passed", 0),
        tests_total=payload.get("tests_total", 0),
        visible_tests_passed=payload.get("visible_tests_passed", 0),
        visible_tests_total=payload.get("visible_tests_total", 0),
        hidden_tests_passed=payload.get("hidden_tests_passed", 0),
        hidden_tests_total=payload.get("hidden_tests_total", 0),
    )

    db.add(submission)

    progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == current_user.id,
            UserProgress.question_id == question_id,
        )
        .first()
    )

    is_accepted = submission.status == "Accepted"
    next_status = "completed" if is_accepted else "in-progress"

    if progress is None:
        progress = UserProgress(
            user_id=current_user.id,
            question_id=question_id,
            status=next_status,
            is_correct=is_accepted,
            time_taken=payload.get("runtime_ms") or 0,
        )
        db.add(progress)
    else:
        progress.status = "completed" if is_accepted else (progress.status or "in-progress")
        progress.is_correct = bool(progress.is_correct or is_accepted)
        progress.time_taken = payload.get("runtime_ms") or progress.time_taken

    db.commit()
    db.refresh(submission)

    return submission.to_dict()


@router.get("/discussions/{question_id}")
def list_discussions(question_id: int, db: Session = Depends(get_db)):
    posts = (
        db.query(DiscussionPost)
        .filter(DiscussionPost.question_id == question_id)
        .order_by(DiscussionPost.created_at.asc())
        .all()
    )

    root_posts: List[dict] = []
    post_map: Dict[int, dict] = {}

    for post in posts:
        serialized = {
            **post.to_dict(),
            "replies": [],
        }
        post_map[post.id] = serialized

    for post in posts:
        serialized = post_map[post.id]
        if post.parent_id and post.parent_id in post_map:
            post_map[post.parent_id]["replies"].append(serialized)
        else:
            root_posts.append(serialized)

    return root_posts


@router.post("/discussions/{question_id}")
def create_discussion_post(
    question_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_with_db),
):
    content = (payload.get("content") or "").strip()
    if not content:
        raise HTTPException(status_code=400, detail="content is required")

    post = DiscussionPost(
        question_id=question_id,
        user_id=current_user.id,
        post_type=payload.get("post_type") or "General",
        title=(payload.get("title") or "").strip() or None,
        content=content,
        votes=0,
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        **post.to_dict(),
        "replies": [],
    }


@router.post("/discussions/{question_id}/{post_id}/reply")
def create_discussion_reply(
    question_id: int,
    post_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_with_db),
):
    parent_post = (
        db.query(DiscussionPost)
        .filter(
            DiscussionPost.id == post_id,
            DiscussionPost.question_id == question_id,
            DiscussionPost.parent_id.is_(None),
        )
        .first()
    )

    if not parent_post:
        raise HTTPException(status_code=404, detail="Discussion post not found")

    content = (payload.get("content") or "").strip()
    if not content:
        raise HTTPException(status_code=400, detail="content is required")

    reply = DiscussionPost(
        question_id=question_id,
        user_id=current_user.id,
        parent_id=post_id,
        post_type="Reply",
        title=None,
        content=content,
        votes=0,
    )

    db.add(reply)
    db.commit()
    db.refresh(reply)

    return {
        **reply.to_dict(),
        "replies": [],
    }
