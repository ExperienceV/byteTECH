# dependencies.py
from fastapi import Cookie, HTTPException
from database.config import SessionLocal as Session
from database.queries.user import get_user_by_email

def get_cookies(
    user_email: str = Cookie(default=None),
    user_name: str = Cookie(default=None),
    user_id: str = Cookie(default=None),
    is_sensei: str = Cookie(default=None)
):
    if not user_email or not user_id or not user_name or not is_sensei:
        raise HTTPException(status_code=401, detail="Faltan cookies")

    usuario = get_user_by_email(
        db=Session(),
        email=user_email    
    )
    
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuario no encontrado en la base de datos")

    return {
        "user_email": user_email,
        "user_name": user_name,
        "user_id": user_id,
        "is_sensei": is_sensei
    }