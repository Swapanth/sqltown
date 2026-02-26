from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.models.question import Question
from src.models.test_case import TestCase
from src.services.sql_engine import execute_sql_safely

router = APIRouter(prefix="/api/sql", tags=["SQL Engine"])


@router.post("/execute")
def execute_sql(
    payload: dict,
    db: Session = Depends(get_db)
):
    question_id = payload["question_id"]
    user_sql = payload["sql"]

    test_cases = db.query(TestCase).filter(
        TestCase.question_id == question_id
    ).all()

    results = []

    for index, test_case in enumerate(test_cases):
        execution = execute_sql_safely(
            test_case.setup_sql,
            user_sql,
            test_case.expected_output
        )

        if "error" in execution:
            return execution

        results.append({
            "test_case": index + 1,
            "passed": execution["passed"]
        })

    all_passed = all(r["passed"] for r in results)

    return {
        "passed": all_passed,
        "details": results
    }