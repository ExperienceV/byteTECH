from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.models import User
from app.database.queries.user import (
    create_user, 
    get_user_by_email, 
    get_all_users
) 
from app.utils.security import (
    hash_password, 
    verify_password
)
from app.utils.signature import (
    create_access_token,
    create_refresh_token
)
from app.parameters import settings
from app.dependencies import get_db


auth_router = APIRouter(tags=["auth"], prefix="/auth")


@auth_router.post("/register")
async def register(user: User, db: Session = Depends(get_db)):
    """
    Entry:
        name: str
        email: str
        password: str
        is_sensei: bool or null
    
    Return:
        status_code: 200
        content: json
    """
    hashed_password = hash_password(user.password)
    create_user(
        name=user.name,
        email=user.email,
        password=hashed_password,
        is_sensei=False,
        db=db
    )

    get_response = get_user_by_email(
        email=user.email,
        db=db
    )
    
    user_id = get_response["id"]

    response = JSONResponse(
        status_code=201,
        content={"message": "User created successfully", "user": get_response}
    )

    user_mtd = {
        "user_id": user_id,
        "user_name": user.name,
        "email": user.email,
        "is_sensei": get_response["is_sensei"]
    }
    access_token = create_access_token(data=user_mtd)
    refresh_token = create_refresh_token(data=user_mtd)

    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True, 
        max_age=settings.ACCESS_TOKEN_MAX_AGE
    ) 
    
    response.set_cookie(
        key="refresh_token", 
        value=refresh_token, 
        httponly=True, 
        max_age=settings.REFRESH_TOKEN_MAX_AGE
    )  

    return response


@auth_router.post("/login")
async def login(user: User, db: Session = Depends(get_db)):
    """
    Entry:
        name: null
        email: str
        password: str
    
    Return:
        status_code: 200, 401 or 404
        content: json
        cookies:
            access_token: JWT token
            refresh_token: JWT refresh token
    
    Errors:
        404: User not found
        401: Invalid password
    """
    get_response = get_user_by_email(
        email=user.email,
        db=db
    )
    if not get_response:
        return JSONResponse(status_code=404, content={"message": "User not found"})
    
    verify_pswd_result = verify_password(user.password, get_response["password"])
    if not verify_pswd_result:
        return JSONResponse(status_code=401, content={"message": "Invalid password"})
    
    response = JSONResponse(status_code=200, content={"message": "Login successful", "user": get_response})

    user_id = get_response["id"]
    user_name = get_response["name"]
    user_mtd = {
        "user_id": user_id,
        "user_name": user_name,
        "email": user.email,
        "is_sensei": get_response["is_sensei"]
    }
    access_token = create_access_token(data=user_mtd)
    refresh_token = create_refresh_token(data=user_mtd)

    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True, 
        max_age=settings.ACCESS_TOKEN_MAX_AGE
    ) 
    
    response.set_cookie(
        key="refresh_token", 
        value=refresh_token, 
        httponly=True, 
        max_age=settings.REFRESH_TOKEN_MAX_AGE
    )  

    return response


@auth_router.post("/logout")
async def logout():
    """
    Clears authentication cookies
    
    Return:
        status_code: 200
        content: json
    """
    response = JSONResponse(status_code=200, content={"message": "Logout successful"})
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return response


@auth_router.get("/get_users")
async def get_users(db: Session = Depends(get_db)):
    """
    Gets all registered users
    
    Return:
        status_code: 200 or 404
        content: json list of users
    
    Errors:
        404: No users found
    """
    users = get_all_users(db=db)
    if not users:
        return JSONResponse(status_code=404, content={"message": "No users found"})
    
    return JSONResponse(status_code=200, content=users)
