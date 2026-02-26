from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Any

class TestCaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    setup_sql: str
    expected_output: Any

class QuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    description: str
    difficulty: str
    topics: List[str]
    companies: Optional[List[str]] = []
    schema_data: Optional[Any] = Field(None, alias="schema")
    examples: Optional[Any] = None
    hints: Optional[List[str]] = []
    solution: Optional[str] = None
    test_cases: List[TestCaseResponse] = []

