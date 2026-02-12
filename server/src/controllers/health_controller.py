from fastapi import APIRouter

from src.schemas import HealthResponse

router = APIRouter(prefix="/api", tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    
    Returns the current status of the API server.
    This endpoint can be used for monitoring and load balancer health checks.
    """
    return HealthResponse(
        status="ok",
        message="Server is running"
    )
