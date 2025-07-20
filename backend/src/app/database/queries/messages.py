from sqlalchemy.orm import Session
from app.database.base import Message
from app.database.queries.user import get_user_by_id


def create_message(db: Session, thread_id: int, user_id: str, message: str):
    msg = Message(thread_id=thread_id, user_id=user_id, message=message)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def delete_message_by_id(db: Session, message_id: int):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if msg:
        db.delete(msg)
        db.commit()
    return msg


def get_messages_by_thread_id(db: Session, thread_id: int):
    messages = db.query(Message).filter(Message.thread_id == thread_id).all()
    if not messages:
        return None

    message_list = []
    for msg in messages:
        user_data = get_user_by_id(db, msg.user_id)
        message_data = {
            "id": msg.id,
            "thread_id": msg.thread_id,
            "username": user_data.username if user_data else None,
            "message": msg.message
        }
        message_list.append(message_data)

    return message_list
