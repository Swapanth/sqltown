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
    
    def upload_file(self, file_content: bytes, file_name: str, content_type: str = 'application/sql') -> str:
        """
        Upload a file directly to S3
        
        Args:
            file_content: File content as bytes
            file_name: Name of the file
            content_type: MIME type of the file
            
        Returns:
            Public URL of the uploaded file
            
        Raises:
            ClientError: If AWS S3 operation fails
        """
        # Generate unique key with timestamp in datasets folder
        key = f"datasets/{int(time() * 1000)}-{file_name}"
        
        try:
            # Upload file to S3 (public access controlled by bucket policy)
            self.client.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=file_content,
                ContentType=content_type
            )
            
            # Return public URL
            file_url = f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{key}"
            return file_url
        except ClientError as e:
            raise e
    
    def list_database_files(self) -> list:
        """
        List all SQL database files from S3
        
        Returns:
            List of database file objects with metadata
        """
        try:
            response = self.client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix="datasets"
            )
            
            files = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    # Get file name from key
                    file_name = obj['Key'].split('/')[-1]
                    
                    # Generate presigned URL for downloading
                    file_url = f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{obj['Key']}"
                    
                    files.append({
                        'key': obj['Key'],
                        'filename': file_name,
                        'url': file_url,
                        'size': obj['Size'],
                        'last_modified': obj['LastModified'].isoformat()
                    })
            
            return files
        except ClientError as e:
            print(f"Error listing S3 files: {e}")
            return []
    
    def generate_presigned_download_url(self, key: str, expiration: int = 3600) -> str:
        """
        Generate a presigned URL for downloading a file from S3
        
        Args:
            key: S3 object key
            expiration: URL expiration time in seconds (default: 1 hour)
            
        Returns:
            Presigned download URL
        """
        try:
            url = self.client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': key
                },
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            raise e


# Singleton instance
s3_service = S3Service()
