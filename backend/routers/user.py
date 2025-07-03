from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.utils.util_database import get_db
from backend.services import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/")
def create_user(name: str, email: str, password: str, db: Session = Depends(get_db)):
    return user_service.create_user(db, name, email, password)


@router.get("/")
def list_users(db: Session = Depends(get_db)):
    return user_service.get_all_users(db)


@router.get("/{user_id}")
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = user_service.get_user_by_id(db, user_id)
    if user:
        return user
    raise HTTPException(status_code=404, detail="Usuario no encontrado")


@router.get("/by-email/")
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = user_service.get_user_by_email(db, email)
    if user:
        return user
    raise HTTPException(status_code=404, detail="Usuario no encontrado")


@router.put("/{user_id}")
def update_user(
    user_id: int,
    name: str = None,
    email: str = None,
    password: str = None,
    db: Session = Depends(get_db)
):
    user = user_service.update_user(db, user_id, name, email, password)
    if user:
        return user
    raise HTTPException(status_code=404, detail="Usuario no encontrado")


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    success = user_service.delete_user(db, user_id)
    if success:
        return {"detail": "Usuario eliminado"}
    raise HTTPException(status_code=404, detail="Usuario no encontrado")
