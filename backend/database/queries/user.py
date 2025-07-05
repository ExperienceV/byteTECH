# Queries especificas para la tabla User

from sqlalchemy.orm import Session
from database.base import User


def create_user(db: Session, name: str, email: str, password: str, is_sensei: bool):
    new_user = User(
        name=name, 
        email=email, 
        password=password,
        is_sensei=is_sensei
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
    return db.query(User).filter(User.email == email).first()


def get_all_users(db: Session):
    return db.query(User).all()


def update_user(db: Session, user_id: int, name: str = None, email: str = None, password: str = None):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    if name:
        user.name = name
    if email:
        user.email = email
    if password:
        user.password = password(password)
    db.commit()
    db.refresh(user)
    return user

