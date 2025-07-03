from sqlalchemy.orm import Session
from backend.database.models.user import User
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_user(db: Session, name: str, email: str, password: str):
    hashed_password = hash_password(password)
    new_user = User(name=name, email=email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_all_users(db: Session):
    return db.query(User).all()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def update_user(db: Session, user_id: int, name: str = None, email: str = None, password: str = None):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    if name:
        user.name = name
    if email:
        user.email = email
    if password:
        user.password = hash_password(password)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return True
    return False
