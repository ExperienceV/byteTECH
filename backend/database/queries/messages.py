from sqlalchemy.orm import Session
from database.base import Message

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
    return db.query(Message).filter(Message.thread_id == thread_id).all()
