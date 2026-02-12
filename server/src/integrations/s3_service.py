import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from typing import Tuple
from time import time

from src.config import settings


class S3Service:
    """
    Service class for AWS S3 operations
    """
    
    def __init__(self):
        """
        Initialize S3 client with AWS credentials from settings
        """
        self.client = boto3.client(
            's3',
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            config=Config(
                signature_version='s3v4',
                s3={'use_accelerate_endpoint': False}
            )
        )
        self.bucket_name = settings.AWS_S3_BUCKET
        self.region = settings.AWS_REGION
    
    def generate_presigned_upload_url(
        self, 
        file_name: str, 
        file_type: str
    ) -> Tuple[str, str]:
        """
        Generate a presigned URL for uploading a file to S3
        
        Args:
            file_name: Name of the file to upload
            file_type: MIME type of the file
            
        Returns:
            Tuple of (presigned_upload_url, final_file_url)
            
        Raises:
            ClientError: If AWS S3 operation fails
        """
        # Generate unique key with timestamp
        key = f"{settings.S3_UPLOAD_PREFIX}/{int(time() * 1000)}-{file_name}"
        
        # Generate presigned URL for PUT operation
        presigned_url = self.client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': self.bucket_name,
                'Key': key,
                'ContentType': file_type,
            },
            ExpiresIn=settings.S3_PRESIGNED_URL_EXPIRATION,
            HttpMethod='PUT'
        )
        
        # Construct the final file URL
        file_url = f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{key}"
        
        return presigned_url, file_url
    
    def delete_file(self, key: str) -> bool:
        """
        Delete a file from S3
        
        Args:
            key: S3 object key
            
        Returns:
            True if deletion was successful
            
        Raises:
            ClientError: If AWS S3 operation fails
        """
        try:
            self.client.delete_object(Bucket=self.bucket_name, Key=key)
            return True
        except ClientError as e:
            raise e
    
    def check_file_exists(self, key: str) -> bool:
        """
        Check if a file exists in S3
        
        Args:
            key: S3 object key
            
        Returns:
            True if file exists, False otherwise
        """
        try:
            self.client.head_object(Bucket=self.bucket_name, Key=key)
            return True
        except ClientError:
            return False


# Singleton instance
s3_service = S3Service()
