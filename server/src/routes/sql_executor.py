from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.models.question import Question
from src.models.test_case import TestCase
from src.services.sql_engine import execute_sql_query, execute_sql_safely, validate_sql_syntax

router = APIRouter(prefix="/api/sql", tags=["SQL Engine"])


@router.post("/execute")
def execute_sql(
    payload: dict,
    db: Session = Depends(get_db)
):
    question_id = payload["question_id"]
    user_sql = payload["sql"]
    custom_test_cases = payload.get("custom_test_cases") or []
    reference_sql = payload.get("reference_sql")
    include_hidden = bool(payload.get("include_hidden", False))
    submission_mode = bool(payload.get("submission_mode", False))

    # Validate user SQL syntax early
    is_valid, error_msg = validate_sql_syntax(user_sql)
    if not is_valid:
        return {"error": error_msg}

    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        return {"error": "Question not found."}

    results = []
    passed_cases = 0
    total_cases = 0
    visible_cases = 0
    hidden_cases = 0
    visible_passed_cases = 0
    hidden_passed_cases = 0

    if custom_test_cases:
        expected_sql = reference_sql or question.solution

        if not expected_sql:
            return {"error": "Reference solution is not available for custom test cases."}

        for index, test_case in enumerate(custom_test_cases):
            setup_sql = (test_case.get("setup_sql") or "").strip()
            if not setup_sql:
                return {"error": f"Test Case {index + 1} has no input data."}

            expected_execution = execute_sql_query(setup_sql, expected_sql)
            if "error" in expected_execution:
                return {"error": f"Reference solution failed for Test Case {index + 1}: {expected_execution['error']}"}

            execution = execute_sql_safely(
                setup_sql,
                user_sql,
                expected_execution["result"]
            )

            if "error" in execution:
                return execution

            total_cases += 1
            visible_cases += 1
            if execution["passed"]:
                passed_cases += 1
                visible_passed_cases += 1

            results.append({
                "test_case": index + 1,
                "label": test_case.get("label") or f"Case {index + 1}",
                "passed": execution["passed"],
                "actual_output": execution["result"],
                "expected_output": expected_execution["result"],
            })
    else:
        test_case_query = db.query(TestCase).filter(TestCase.question_id == question_id)

        if not include_hidden:
            test_case_query = test_case_query.filter(TestCase.is_hidden == False)

        test_cases = test_case_query.all()

        for index, test_case in enumerate(test_cases):
            execution = execute_sql_safely(
                test_case.setup_sql,
                user_sql,
                test_case.expected_output
            )

            if "error" in execution:
                return execution

            total_cases += 1
            if test_case.is_hidden:
                hidden_cases += 1
            else:
                visible_cases += 1

            if execution["passed"]:
                passed_cases += 1
                if test_case.is_hidden:
                    hidden_passed_cases += 1
                else:
                    visible_passed_cases += 1

            if submission_mode and test_case.is_hidden:
                continue

            results.append({
                "test_case": index + 1,
                "label": f"Case {index + 1}",
                "passed": execution["passed"],
                "actual_output": execution["result"],
                "expected_output": test_case.expected_output,
            })

    all_passed = total_cases > 0 and passed_cases == total_cases

    return {
        "passed": all_passed,
        "details": results,
        "summary": {
            "passed_count": passed_cases,
            "total_count": total_cases,
            "visible_count": visible_cases,
            "hidden_count": hidden_cases,
            "visible_passed_count": visible_passed_cases,
            "hidden_passed_count": hidden_passed_cases,
        }
    }