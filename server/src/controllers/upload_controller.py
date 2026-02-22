from fastapi import APIRouter, HTTPException, UploadFile, File
from botocore.exceptions import ClientError
import os
from pathlib import Path
import shutil
import re

from src.schemas import UploadURLRequest, UploadURLResponse
from src.integrations.s3_service import s3_service

router = APIRouter(prefix="/api", tags=["Upload"])


@router.post("/upload-url", response_model=UploadURLResponse)
async def generate_upload_url(request: UploadURLRequest):
    """
    Generate a presigned URL for S3 upload
    
    This endpoint creates a temporary URL that allows clients to upload files
    directly to S3 without exposing AWS credentials.
    
    - **fileName**: Name of the file to upload
    - **fileType**: MIME type of the file (e.g., application/pdf, image/jpeg)
    """
    try:
        if not request.fileName or not request.fileType:
            raise HTTPException(
                status_code=400,
                detail="fileName and fileType are required"
            )
        
        # Generate presigned URL using S3 service
        upload_url, file_url = s3_service.generate_presigned_upload_url(
            file_name=request.fileName,
            file_type=request.fileType
        )
        
        return UploadURLResponse(
            uploadUrl=upload_url,
            fileUrl=file_url
        )
        
    except ClientError as e:
        print(f"AWS Error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate upload URL due to AWS error"
        )
    except Exception as e:
        print(f"Error generating upload URL: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate upload URL"
        )


@router.post("/upload-sql-database")
async def upload_sql_database(file: UploadFile = File(...)):
    """
    Upload SQL database file to practiceData folder
    
    This endpoint accepts SQL files and saves them to the frontend's
    public/practiceData folder for use in the practice environment.
    
    - **file**: SQL file to upload (.sql extension required)
    """
    try:
        # Validate file type
        if not file.filename or not file.filename.endswith('.sql'):
            raise HTTPException(
                status_code=400,
                detail="Only .sql files are allowed"
            )
        
        # Sanitize filename to prevent directory traversal
        filename = re.sub(r'[^a-zA-Z0-9_\-.]', '_', file.filename)
        
        # Ensure filename is unique by adding timestamp if needed
        base_name = filename.rsplit('.', 1)[0]
        extension = filename.rsplit('.', 1)[1]
        
        # Construct path to frontend's public/practiceData folder
        # Assuming server is at same level as frontend
        server_dir = Path(__file__).resolve().parent.parent.parent  # Navigate to server root
        project_root = server_dir.parent  # Navigate to project root
        practice_data_dir = project_root / "frontend" / "public" / "practiceData"
        
        # Create directory if it doesn't exist
        practice_data_dir.mkdir(parents=True, exist_ok=True)
        
        # Check if file already exists, add number suffix if needed
        file_path = practice_data_dir / filename
        counter = 1
        while file_path.exists():
            filename = f"{base_name}_{counter}.{extension}"
            file_path = practice_data_dir / filename
            counter += 1
        
        # Save the file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return {
            "success": True,
            "message": "SQL database uploaded successfully",
            "filename": filename,
            "path": f"/practiceData/{filename}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error uploading SQL database: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload SQL database: {str(e)}"
        )
