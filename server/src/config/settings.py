from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )
    
    # Server Configuration
    APP_NAME: str = "SQLTown API"
    PORT: int = 3000
    DEBUG: bool = False
    
    # AWS Configuration (Optional for local development)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "ap-southeast-2"
    AWS_S3_BUCKET: str = "sqltown-bucket1"
    
    # AWS Cognito Configuration
    COGNITO_USER_POOL_ID: str = ""
    COGNITO_CLIENT_ID: str = ""
    COGNITO_JWKS_URL: str = ""
    COGNITO_ISSUER: str = ""
    
    # Database Configuration
    DATABASE_URL: str
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]    # S3 Upload Configuration
    S3_PRESIGNED_URL_EXPIRATION: int = 300  # 5 minutes in seconds
    S3_UPLOAD_PREFIX: str = "resumes"


settings = Settings()
