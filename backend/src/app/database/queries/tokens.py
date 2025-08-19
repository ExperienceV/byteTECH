from sqlalchemy.orm import Session
from app.database.base import ResetPassword
from datetime import datetime, timezone, timedelta

def save_token(db: Session, user_id: int, token: str) -> ResetPassword:
    # Verificar que no exista ya en la base
    exists = db.query(ResetPassword).filter(ResetPassword.token == token).first()
    if not exists:
        new_token = ResetPassword(
            user_id=user_id,
            token=token,
            created_at=datetime.now(timezone.utc),
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=15)
        )
        db.add(new_token)
        db.commit()
        db.refresh(new_token)
        return new_token

    raise ValueError("No se pudo generar un código único tras varios intentos")


def delete_expired_tokens(db: Session):
    db.query(ResetPassword).filter(
        ResetPassword.expires_at <= datetime.now(timezone.utc)
    ).delete()
    db.commit()
