from sqlalchemy.orm import Session
from app.database.base import VerifyUser
from datetime import datetime, timezone, timedelta
import secrets
import string


def generate_code(length=6):
    chars = string.ascii_uppercase + string.digits  # letras y números
    return ''.join(secrets.choice(chars) for _ in range(length))


def create_verification_code(db: Session, user_id: int, max_retries=5) -> VerifyUser:
    for _ in range(max_retries):
        code = generate_code(6)

        # Verificar que no exista ya en la base
        exists = db.query(VerifyUser).filter(VerifyUser.code == code).first()
        if not exists:
            new_code = VerifyUser(
                user_id=user_id,
                code=code,
                created_at=datetime.now(timezone.utc),
                expires_at=datetime.now(timezone.utc) + timedelta(minutes=15)
            )
            db.add(new_code)
            db.commit()
            db.refresh(new_code)
            return new_code

    raise ValueError("No se pudo generar un código único tras varios intentos")


def get_valid_code(db: Session, code: str, user_id: int):
    record = db.query(VerifyUser).filter(
        VerifyUser.code == code,
        VerifyUser.user_id == user_id
    ).first()

    if not record:
        return {"status": "invalid", "message": "El código no existe o no pertenece a este usuario."}

    if record.expires_at <= datetime.now(timezone.utc):
        return {"status": "expired", "message": "El código ha expirado."}

    return {"status": "valid", "message": "Código válido.", "record": record}


def delete_expired_codes(db: Session):
    db.query(VerifyUser).filter(
        VerifyUser.expires_at <= datetime.now(timezone.utc)
    ).delete()
    db.commit()


def delete_verification_code(db, code: str):
    record = db.query(VerifyUser).filter(
        VerifyUser.code == code
    ).first()

    if record:
        db.delete(record)
        db.commit()
        return True
    return False
