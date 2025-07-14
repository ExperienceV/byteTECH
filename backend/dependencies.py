# dependencies.py
from icecream import ic
from parameters import settings
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
from utils.signature import (
    create_access_token, 
    verify_token
    )


def get_cookies(
    request: Request,
    access_token: str = Cookie(None),
    refresh_token: str = Cookie(None)
):
    try:
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
                return {"user_name": payload["user_name"]}
            
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