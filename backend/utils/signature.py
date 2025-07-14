from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer
from parameters import settings

# Authentication security scheme
security = HTTPBearer()

def create_access_token(data: dict):
    """
    Create an access token JWT.
    - data: Data to include in the token (e.g., user name).
    - exp: Expiration time of the token (15 minutes by default).
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_MAX_AGE)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict):
    """
    Create a refresh token JWT.
    - data: Data to include in the token (e.g., user name).
    - exp: Expiration time of the token (15 days by default).   
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_MAX_AGE)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_token(token: str):
    """
    verify_token: Verify a token JWT.
    - token: Token to verify.
    - If token is valid: Return a payload decode.
    - If token is invalid: Raise a exception.       
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token, please login again.",
        )

