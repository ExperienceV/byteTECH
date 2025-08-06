# Queries especificas para la tabla User

from sqlalchemy.orm import Session
from app.database.base import User

def create_user(db: Session, name: str, email: str, password: str, is_sensei: bool, is_verify: bool = False):
    new_user = User(
        username=name,
        email=email,
        password=password,
        is_sensei=is_sensei,
        is_verify=is_verify
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return True
    return False


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()
    return {
        "id": user.id,
        "name": user.username,
        "email": user.email,
        "password": user.password,
        "is_sensei": user.is_sensei,
        "is_verify": user.is_verify
    } if user else None


def get_all_users(db: Session):
    users = db.query(User).all()
    if not users:
        return None

    return [
        {
            "id": user.id,
            "name": user.username,
            "email": user.email,
            "is_sensei": user.is_sensei
        } for user in users
    ]


def update_user(
        db: Session, 
        user_id: int, 
        name: str = None, 
        email: str = None, 
        password: str = None,
        verify: bool = None,
        is_sensei: bool = None
        ):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    if name:
        user.username = name
    if email:
        user.email = email
    if password:
        user.password = password
    if verify:
        user.is_verify = verify
    if is_sensei:
        user.is_sensei = is_sensei
    db.commit()
    db.refresh(user)
    return user



