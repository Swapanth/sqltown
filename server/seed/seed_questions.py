import json
import os
import sys

# Add parent directory to path to import from src
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.orm import Session
from sqlalchemy import text
from src.db.database import SessionLocal, engine, Base, ensure_database_schema
from src.models.question import Question
from src.models.test_case import TestCase

def load_questions_data():
    """Load questions from JSON file"""
    json_path = os.path.join(os.path.dirname(__file__), 'questions.json')
    with open(json_path, 'r') as f:
        return json.load(f)

def seed_questions():
    """Seed questions and test cases into the database"""
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    ensure_database_schema()
    
    # Create database session
    db: Session = SessionLocal()
    
    try:
         # 🔥 Clear old data
        db.query(TestCase).delete()
        db.query(Question).delete()
        db.commit()
        
        # Reset ID sequences to start from 1
        db.execute(text("ALTER SEQUENCE questions_id_seq RESTART WITH 1"))
        db.execute(text("ALTER SEQUENCE test_cases_id_seq RESTART WITH 1"))
        db.commit()

        # Load questions data
        questions_data = load_questions_data()
        
        print(f"📚 Loading {len(questions_data)} questions...")
        
        for q in questions_data:
            # Check if question already exists
            existing = db.query(Question).filter_by(slug=q["slug"]).first()
            
            if existing:
                print(f"⚠️  Skipping existing question: {q['slug']}")
                continue
            
            # Create question
            question = Question(
                title=q["title"],
                slug=q["slug"],
                description=q["description"],
                difficulty=q["difficulty"],
                topics=q.get("topics", []),
                companies=q.get("companies", []),
                schema=q.get("schema"),          # ✅ ADD THIS
                examples=q.get("examples", []),  # ✅ ADD THIS
                hints=q.get("hints", []),        # ✅ ADD THIS
                solution=q.get("solution"),      # ✅ ADD THIS
                is_active=True
            )
            
            db.add(question)
            db.flush()
            
            print(f"✅ Added question: {q['title']}")
            
            # Create visible test cases
            visible_test_cases = q.get("test_cases", [])
            for tc in visible_test_cases:
                test_case = TestCase(
                    question_id=question.id,
                    setup_sql=tc["setup_sql"],
                    expected_output=tc["expected_output"],
                    is_hidden=False
                )
                db.add(test_case)

            # Create hidden test cases
            hidden_test_cases = q.get("hidden_test_cases", [])
            for tc in hidden_test_cases:
                test_case = TestCase(
                    question_id=question.id,
                    setup_sql=tc["setup_sql"],
                    expected_output=tc["expected_output"],
                    is_hidden=True
                )
                db.add(test_case)
            
            print(f"   └─ Added {len(visible_test_cases)} visible and {len(hidden_test_cases)} hidden test case(s)")
        
        # Commit all changes
        db.commit()
        print(f"\n🎉 Successfully seeded {len(questions_data)} questions!")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error seeding questions: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_questions()