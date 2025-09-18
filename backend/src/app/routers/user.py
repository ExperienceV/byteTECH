from fastapi import APIRouter, Form, Depends
from fastapi.responses import JSONResponse
from app.dependencies import get_cookies, get_db
from sqlalchemy.orm import Session
from app.database.queries.user import update_user

user_router = APIRouter(tags=["user"], prefix="/user")

@user_router.post("/modify_credentials")
async def modify_credentials(
    username: str = Form(...),
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):
    print("usuer_info", user_info)

    email = user_info["email"]
    # Keep existing email from the authenticated user info
    reponse = update_user(
        db=db,
        user_id=user_info["user_id"],
        name=username,
        email=email
    )

    # 

    return JSONResponse(
        content={
            "message": "User credentials updated successfully",
            "name": reponse.username,
            "email": reponse.email
        },
        status_code=200
    )

