from pydantic import BaseModel, Field


class UploadURLRequest(BaseModel):
    """
    Request schema for generating presigned upload URL
    """
    fileName: str = Field(..., description="Name of the file to upload", min_length=1)
    fileType: str = Field(..., description="MIME type of the file", min_length=1)
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "fileName": "resume.pdf",
                    "fileType": "application/pdf"
                }
            ]
        }
    }


class UploadURLResponse(BaseModel):
    """
    Response schema containing presigned URL and file URL
    """
    uploadUrl: str = Field(..., description="Presigned URL for uploading the file")
    fileUrl: str = Field(..., description="Final URL where the file will be accessible")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "uploadUrl": "https://sqltown-bucket1.s3.ap-southeast-2.amazonaws.com/...",
                    "fileUrl": "https://sqltown-bucket1.s3.ap-southeast-2.amazonaws.com/resumes/..."
                }
            ]
        }
    }
