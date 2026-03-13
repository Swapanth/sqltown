from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from src.config import settings
from src.middleware import setup_cors
from src.controllers import upload_router, health_router
from src.auth.auth_router import router as auth_router
from src.controllers.question_router import router as question_router
from src.routes.progress import router as progress_router
from src.routes.sql_executor import router as sql_router
from src.routes.interview import router as interview_router
from src.db.database import engine, Base, ensure_database_schema

# Load environment variables
load_dotenv()

import src.models  # This loads all models


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create database tables
    Base.metadata.create_all(bind=engine)
    ensure_database_schema()
    print("✅ Database tables created")
    yield
    # Shutdown: Add cleanup code here if needed
    print("👋 Shutting down...")


# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Server for SQLTown - A SQL query playground",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Setup middleware
setup_cors(app)

# Include routers
app.include_router(upload_router)
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(question_router)
app.include_router(progress_router)
app.include_router(sql_router)
app.include_router(interview_router)


@app.get("/")
async def root():
    return {
        "message": "SQLTown API - FastAPI Server",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True
    )