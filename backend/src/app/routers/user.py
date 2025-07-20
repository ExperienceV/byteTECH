from fastapi import APIRouter, Form, Depends
from fastapi.responses import JSONResponse
from app.dependencies import get_cookies, get_db
from app.database.config import Session
from app.database.queries.user import update_user

user_router = APIRouter()

@user_router.get("/modify_credentials")
async def modify_credentials(
    username: str = Form(...),
    email: str = Form(...),
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)

):

    reponse = update_user(
        db=db,
        user_id=user_info["id"],
        name=username,
        email=email
    )

    return JSONResponse(
        content={
            "message": "User credentials updated successfully",
            "name": reponse.username,
            "email": reponse.email
        },
        status_code=200
    )

