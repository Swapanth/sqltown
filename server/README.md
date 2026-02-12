# SQLTown API - FastAPI Server

Python FastAPI server for SQLTown with AWS S3 integration, following MVC architecture.


## Features

- **MVC Architecture**: Clean separation of concerns
- **FastAPI Framework**: High performance async API
- **AWS S3 Integration**: Secure file upload with presigned URLs
- **Type Safety**: Pydantic schemas for request/response validation
- **CORS Enabled**: Configurable cross-origin support
- **Docker Ready**: Full containerization support
- **Auto Documentation**: Interactive API docs at `/docs`

## Prerequisites

- Python 3.11+ (or Docker)
- AWS credentials (Access Key ID and Secret Access Key)

## Environment Variables

Create or update the `.env` file:

```env
# Server Configuration
PORT=3000
DEBUG=False

# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=ap-southeast-2
AWS_S3_BUCKET=sqltown-bucket1

# CORS Configuration (optional)
# CORS_ORIGINS=["http://localhost:3000"]
```

## Running with Docker (Recommended)

### Using Docker Compose

```bash
# Start the server in development mode with hot reload
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the server
docker-compose down

# Rebuild after changes
docker-compose up --build
```

### Using Docker directly

```bash
# Build the image
docker build -t sqltown-api .

# Run the container
docker run -d \
  --name sqltown-api \
  -p 3000:3000 \
  --env-file .env \
  sqltown-api
```

## Running without Docker

```bash
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py

# Or use uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 3000 --reload
```

## API Endpoints

### POST `/api/upload-url`
Generate a presigned URL for S3 file upload.

**Request Body:**
```json
{
  "fileName": "resume.pdf",
  "fileType": "application/pdf"
}
```

**Response:**
```json
{
  "uploadUrl": "https://sqltown-bucket1.s3.ap-southeast-2.amazonaws.com/...",
  "fileUrl": "https://sqltown-bucket1.s3.ap-southeast-2.amazonaws.com/resumes/..."
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### GET `/`
Root endpoint with API information.

**Response:**
```json
{
  "message": "SQLTown API - FastAPI Server",
  "version": "1.0.0",
  "docs": "/docs"
}
```

## Interactive API Documentation

Once the server is running:
- **Swagger UI**: http://localhost:3000/docs
- **ReDoc**: http://localhost:3000/redoc

## Architecture Overview

### MVC Pattern

- **Models** (`src/models/`): Database models (SQLAlchemy ORM)
- **Controllers** (`src/controllers/`): Handle HTTP requests and responses
- **Schemas** (`src/schemas/`): Data validation and serialization (Pydantic)

### Additional Layers

- **Services** (`src/integrations/`): Business logic and third-party integrations
- **CRUD** (`src/crud/`): Database operations
- **Config** (`src/config/`): Centralized configuration management
- **Middleware** (`src/middleware/`): Request/response processing
- **Auth** (`src/auth/`): Authentication and authorization
- **Utils** (`src/utils/`): Helper functions

## Development

The project uses hot-reload during development. Any changes to Python files will automatically restart the server.

### Adding New Endpoints

1. Create a schema in `src/schemas/`
2. Create a controller in `src/controllers/`
3. Register the router in `main.py`

Example:
```python
# src/controllers/my_controller.py
from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["MyFeature"])

@router.get("/my-endpoint")
async def my_endpoint():
    return {"message": "Hello"}

# main.py
from src.controllers import my_router
app.include_router(my_router)
```

## Testing

```bash
# Install testing dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## Production Deployment

For production:

1. Set `DEBUG=False` in `.env`
2. Update CORS origins to specific domains
3. Use multiple workers:

```yaml
# docker-compose.yml (production)
command: uvicorn main:app --host 0.0.0.0 --port 3000 --workers 4
```

Or directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 3000 --workers 4
```

## Troubleshooting

### Import Errors
Ensure you're running from the `server/` directory or the Python path is set correctly.

### AWS Credentials
Verify your AWS credentials have proper S3 permissions for the bucket.

### Port Already in Use
Change the `PORT` in `.env` or stop the conflicting service.
