from fastapi import APIRouter
from database.queries.user import create_user, get_user_by_email
from fastapi.responses import JSONResponse
from models import User

auth_router = APIRouter()


@auth_router.get("/register")
async def register(user: User):
    create_user(
        name=user.name,
        email=user.email,
        password=user.password,
        is_sensei=user.is_sensei
    )

    response = JSONResponse(
        status_code=201,
        content={"message": "User created successfully", "user": user.dict()}
        )
    
    get_response = get_user_by_email(email=user.email)
    user_id = get_response["id"]

    response.set_cookie(key="user_id", value=str(user_id), httponly=True)
    response.set_cookie(key="user_name", value=user.name, httponly=True)
    response.set_cookie(key="user_email", value=user.email, httponly=True)
    response.set_cookie(key="user_password", value=user.password, httponly=True)
    response.set_cookie(key="is_sensei", value=str(user.is_sensei), httponly=True)


    return response


@auth_router.get("/login")
async def login(user: User):

    get_response = get_user_by_email(email=user.email)
    if not get_response:
        return JSONResponse(status_code=404, content={"message": "User not found"})
    
    if get_response["password"] != user.password:
        return JSONResponse(status_code=401, content={"message": "Invalid password"})
    
    response = JSONResponse(status_code=200, content={"message": "Login successful", "user": get_response})

    response.set_cookie(key="user_id", value=str(get_response["id"]), httponly=True)
    response.set_cookie(key="user_name", value=get_response["name"], httponly=True)
    response.set_cookie(key="user_email", value=get_response["email"], httponly=True)
    response.set_cookie(key="user_password", value=get_response["password"], httponly=True)
    response.set_cookie(key="is_sensei", value=str(get_response["is_sensei"]), httponly=True)

    
    #get_response = get_user_by_email(email="
    return {"message": "Login endpoint"}


@auth_router.get("/logout")
async def logout():
    return {"message": "Logout endpoint"}