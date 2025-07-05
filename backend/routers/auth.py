from fastapi import APIRouter, Cookie
from database.queries.user import create_user, get_user_by_email, get_all_users 
from utils.security import hash_password, verify_password
from fastapi.responses import JSONResponse
from models import User
from database.config import SessionLocal

auth_router = APIRouter()


@auth_router.post("/register")
async def register(user: User):

    hashed_password = hash_password(user.password)
    create_user(
        db=SessionLocal(),
        name=user.name,
        email=user.email,
        password=hashed_password,
        is_sensei=user.is_sensei
    )

    get_response = get_user_by_email(
        db=SessionLocal(),
        email=user.email
        )
    
    get_response["password"] = "末日臨近"
    user_id = get_response["id"]

    response = JSONResponse(
        status_code=201,
        content={"message": "User created successfully", "user": get_response}
        )
    
    # Implementar generacion de token JWT

    response.set_cookie(key="user_id", value=str(user_id), httponly=True, max_age=3600 * 24 * 7) 
    response.set_cookie(key="user_name", value=get_response["name"], httponly=True, max_age=3600 * 24 * 7)  
    response.set_cookie(key="user_email", value=get_response["email"], httponly=True, max_age=3600 * 24 * 7)  
    response.set_cookie(key="is_sensei", value=str(get_response["is_sensei"]), httponly=True, max_age=3600 * 24 * 7)  

    return response


@auth_router.post("/login")
async def login(user: User):

    get_response = get_user_by_email(
        db=SessionLocal(),
        email=user.email
        )
    if not get_response:
        return JSONResponse(status_code=404, content={"message": "User not found"})
    
    verify_pswd_result = verify_password(user.password, get_response["password"])
    if not verify_pswd_result:
        return JSONResponse(status_code=401, content={"message": "Invalid password"})
    
    response = JSONResponse(status_code=200, content={"message": "Login successful", "user": get_response})

    # Implementar generacion de token JWT
    
    response.set_cookie(key="user_id", value=str(get_response["id"]), httponly=True, max_age=3600 * 24 * 7) 
    response.set_cookie(key="user_name", value=get_response["name"], httponly=True, max_age=3600 * 24 * 7)  
    response.set_cookie(key="user_email", value=get_response["email"], httponly=True, max_age=3600 * 24 * 7)  
    response.set_cookie(key="is_sensei", value=str(get_response["is_sensei"]), httponly=True, max_age=3600 * 24 * 7)  

    return response


@auth_router.post("/logout")
async def logout():
    
    response = JSONResponse(status_code=200, content={"message": "Logout successful"})
    response.delete_cookie("user_id")
    response.delete_cookie("user_name")
    response.delete_cookie("user_email")
    response.delete_cookie("is_sensei")

    return response


@auth_router.get("/get_users")
async def get_users():
    users = get_all_users(db=SessionLocal())
    if not users:
        return JSONResponse(status_code=404, content={"message": "No users found"})
    
    return JSONResponse(status_code=200, content=users)

