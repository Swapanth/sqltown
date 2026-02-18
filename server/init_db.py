"""
Database initialization script
Creates all tables defined in models
"""
from src.db.database import engine, Base
from src.models.user import User

def init_db():
    """Create all tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")

if __name__ == "__main__":
    init_db()
