from jose import jwt
import requests
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict
from src.config import settings

# Use settings from configuration
COGNITO_REGION = settings.AWS_REGION
COGNITO_USERPOOL_ID = settings.COGNITO_USER_POOL_ID
COGNITO_APP_CLIENT_ID = settings.COGNITO_CLIENT_ID

# Use JWKS URL from settings if provided, otherwise construct it
JWKS_URL = settings.COGNITO_JWKS_URL or f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USERPOOL_ID}/.well-known/jwks.json"

security = HTTPBearer()

# Lazy load JWKS to avoid startup errors
_jwks_cache = None

def get_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        try:
            _jwks_cache = requests.get(JWKS_URL).json()
        except Exception as e:
            print(f"Warning: Failed to fetch JWKS: {e}")
            _jwks_cache = {"keys": []}
    return _jwks_cache


def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> Dict:
    token = credentials.credentials

    try:
        jwks = get_jwks()
        header = jwt.get_unverified_header(token)
        key = next(k for k in jwks["keys"] if k["kid"] == header["kid"])

        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=COGNITO_APP_CLIENT_ID
        )

        return payload

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")