from .upload_controller import router as upload_router
from .health_controller import router as health_router

__all__ = ["upload_router", "health_router"]
