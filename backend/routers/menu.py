from fastapi import APIRouter
from dependencies import get_cookies
from fastapi import Depends

menu_router = APIRouter(tags=["Menu"], prefix="/menu")

@menu_router.get("/home")
async def home(user_info: dict = Depends(get_cookies)):
    return {"message": "Welcome to the home page!"}