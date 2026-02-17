from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
import requests

router = APIRouter(prefix="/auth", tags=["auth"])

# ===== AWS COGNITO CONFIG =====
AWS_REGION = "ap-south-1"
USER_POOL_ID = "YOUR_USER_POOL_ID"
APP_CLIENT_ID = "YOUR_APP_CLIENT_ID"

COGNITO_ISSUER = f"https://cognito-idp.{AWS_REGION}.amazonaws.com/{USER_POOL_ID}"
JWKS_URL = f"{COGNITO_ISSUER}/.well-known/jwks.json"

security = HTTPBearer()

# ===== Fetch Cognito public keys =====
jwks = requests.get(JWKS_URL).json()


def get_public_key(token: str):
    headers = jwt.get_unverified_header(token)
    kid = headers["kid"]

    for key in jwks["keys"]:
        if key["kid"] == kid:
            return key
    raise HTTPException(status_code=401, detail="Invalid token")


def verify_cognito_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        public_key = get_public_key(token)

        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=APP_CLIENT_ID,
            issuer=COGNITO_ISSUER,
        )

        return payload

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


# ===== Protected Route =====
@router.get("/me")
def get_current_user(user=Depends(verify_cognito_token)):
    return {
        "user_id": user.get("sub"),
        "email": user.get("email"),
        "username": user.get("cognito:username"),
    }


# ===== Example login success endpoint =====
@router.post("/login-success")
def login_success(user=Depends(verify_cognito_token)):
    return {"message": "Login successful", "user": user}
