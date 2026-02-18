import requests
from jose import jwt, jwk
from jose.utils import base64url_decode
from typing import Dict, Optional
from functools import lru_cache
from fastapi import HTTPException, status
from src.config import settings
import time

class CognitoJWTVerifier:
    def __init__(self):
        self.jwks_url = settings.COGNITO_JWKS_URL
        self.issuer = settings.COGNITO_ISSUER
        self.client_id = settings.COGNITO_CLIENT_ID
        self._jwks_cache = None
        self._cache_timestamp = 0
        self._cache_ttl = 3600  # 1 hour
    
    def _get_jwks(self) -> Dict:
        """Fetch JWKS from Cognito with caching"""
        current_time = time.time()
        
        # Return cached JWKS if still valid
        if self._jwks_cache and (current_time - self._cache_timestamp) < self._cache_ttl:
            return self._jwks_cache
        
        # Fetch fresh JWKS
        try:
            response = requests.get(self.jwks_url, timeout=10)
            response.raise_for_status()
            self._jwks_cache = response.json()
            self._cache_timestamp = current_time
            return self._jwks_cache
        except requests.RequestException as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Failed to fetch JWKS: {str(e)}"
            )
    
    def _get_signing_key(self, token: str) -> Optional[Dict]:
        """Extract the signing key from JWKS based on token's kid"""
        try:
            # Decode header without verification
            headers = jwt.get_unverified_header(token)
            kid = headers.get('kid')
            
            if not kid:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token missing 'kid' in header"
                )
            
            # Get JWKS
            jwks = self._get_jwks()
            
            # Find matching key
            for key in jwks.get('keys', []):
                if key.get('kid') == kid:
                    return key
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to find matching signing key"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Error extracting signing key: {str(e)}"
            )
    
    def verify_token(self, token: str) -> Dict:
        """
        Verify Cognito JWT token
        
        Returns:
            Dict: Decoded token claims
        
        Raises:
            HTTPException: If token is invalid
        """
        try:
            # Get signing key
            signing_key = self._get_signing_key(token)
            
            # Construct public key
            public_key = jwk.construct(signing_key)
            
            # Get message and signature from token
            message, encoded_signature = token.rsplit('.', 1)
            decoded_signature = base64url_decode(encoded_signature.encode())
            
            # Verify signature
            if not public_key.verify(message.encode(), decoded_signature):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token signature"
                )
            
            # Decode and validate claims
            claims = jwt.decode(
                token,
                signing_key,
                algorithms=['RS256'],
                audience=self.client_id,
                issuer=self.issuer,
                options={
                    'verify_signature': True,
                    'verify_aud': True,
                    'verify_iss': True,
                    'verify_exp': True,
                }
            )
            
            # Validate token_use claim
            if claims.get('token_use') != 'id':
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token is not an ID token"
                )
            
            return claims
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.JWTClaimsError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token claims: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token verification failed: {str(e)}"
            )

@lru_cache()
def get_jwt_verifier() -> CognitoJWTVerifier:
    return CognitoJWTVerifier()
