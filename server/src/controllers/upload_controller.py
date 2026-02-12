from fastapi import APIRouter, HTTPException
from botocore.exceptions import ClientError

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
