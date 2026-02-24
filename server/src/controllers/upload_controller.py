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
    Upload SQL database file to AWS S3
    
    This endpoint accepts SQL files and saves them to AWS S3
    for use in the practice environment.
    
    - **file**: SQL file to upload (.sql extension required)
    """
    try:
        # Validate file type
        if not file.filename or not file.filename.endswith('.sql'):
            raise HTTPException(
                status_code=400,
                detail="Only .sql files are allowed"
            )
        
        # Sanitize filename to prevent issues
        filename = re.sub(r'[^a-zA-Z0-9_\-.]', '_', file.filename)
        
        # Read file content
        file_content = await file.read()
        
        # Upload to S3
        try:
            file_url = s3_service.upload_file(
                file_content=file_content,
                file_name=filename,
                content_type='application/sql'
            )
            
            return {
                "success": True,
                "message": "SQL database uploaded successfully to S3",
                "filename": filename,
                "url": file_url
            }
        except ClientError as e:
            print(f"AWS S3 Error: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to upload to S3. Please check AWS credentials."
            )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error uploading SQL database: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload SQL database: {str(e)}"
        )


@router.get("/list-databases")
async def list_databases():
    """
    List all SQL database files from AWS S3
    
    Returns a list of all available database files stored in S3
    with their metadata (filename, URL, size, last modified date).
    """
    try:
        files = s3_service.list_database_files()
        
        return {
            "success": True,
            "databases": files,
            "count": len(files)
        }
    except ClientError as e:
        print(f"AWS S3 Error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to list databases from S3"
        )
    except Exception as e:
        print(f"Error listing databases: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list databases: {str(e)}"
        )
