# dependencies.py
from icecream import ic
from app.parameters import settings
from jose.exceptions import ExpiredSignatureError
from fastapi import (
    Cookie, 
    HTTPException, 
    status, 
    Request
    )
from jose import (
    JWTError, 
    jwt
    )
from app.utils.signature import (
    create_access_token, 
    verify_token
    )


def get_cookies(
    request: Request,
    access_token: str = Cookie(None),
    refresh_token: str = Cookie(None)
):
    try:
        #ic("headers", request.headers)
        #ic("cookies", request.cookies)
        
        ic("Token check started")

        # 1. first check if tokens are provided
        if not access_token and not refresh_token:
            ic("No tokens provided")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unathorize, login."
            )

        # 2. Next, check if access token is provided
        try:
            if not access_token:
                ic("Access token missing, using refresh token")
                payload = jwt.decode(refresh_token.replace("Bearer ", ""), 
                                  settings.SECRET_KEY, 
                                  algorithms=[settings.ALGORITHM])
                new_access_token = create_access_token(data=payload)
                request.state.new_token = new_access_token
                return payload
            
            clean_token = access_token.replace("Bearer ", "")
            payload = verify_token(clean_token)
            return payload

        except ExpiredSignatureError:
            ic("Token expired error")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Expired token, please login again."
            )
        except JWTError:
            ic("Invalid token error")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid token, please login again."
            )

    except HTTPException:
        # Re-raise the HTTPException to be handled by FastAPI
        raise
    except Exception as e:
        ic("Unexpected error", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error, please try again later."
        )
    

# Legacy get_db function - replaced by get_db_session in session.py
# Keeping for backward compatibility but recommend using get_db_session
from app.database.session import get_db_session

def get_cookies_optional(
    request: Request,
    access_token: str = Cookie(None),
    refresh_token: str = Cookie(None)
):
    """
    Optional authentication dependency - returns None if no valid token is found
    instead of raising an exception. Useful for endpoints that work with or without auth.
    """
    try:
        # If no tokens provided, return None (no authentication)
        if not access_token and not refresh_token:
            return None

        # Try to verify access token first
        try:
            if not access_token:
                # Use refresh token if access token is missing
                payload = jwt.decode(refresh_token.replace("Bearer ", ""), 
                                  settings.SECRET_KEY, 
                                  algorithms=[settings.ALGORITHM])
                new_access_token = create_access_token(data=payload)
                request.state.new_token = new_access_token
                return payload
            
            clean_token = access_token.replace("Bearer ", "")
            payload = verify_token(clean_token)
            return payload

        except (ExpiredSignatureError, JWTError):
            # If token is invalid or expired, return None instead of raising exception
            return None

    except Exception as e:
        # For any other error, return None
        ic("Optional auth error", e)
        return None


def get_db():
    """
    Legacy database dependency - use get_db_session for better error handling
    """
    with get_db_session() as session:
        yield session