from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from src.config import settings

# Create engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=settings.DEBUG
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def ensure_database_schema():
    """Apply lightweight schema updates for environments without migrations."""
    with engine.begin() as connection:
        inspector = inspect(connection)
        table_names = set(inspector.get_table_names())

        if "test_cases" not in table_names:
            return

        existing_columns = {column["name"] for column in inspector.get_columns("test_cases")}

        if "is_hidden" not in existing_columns:
            connection.execute(text("ALTER TABLE test_cases ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE"))
            connection.execute(text("UPDATE test_cases SET is_hidden = FALSE WHERE is_hidden IS NULL"))

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
