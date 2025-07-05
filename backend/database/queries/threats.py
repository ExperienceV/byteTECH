from sqlalchemy.orm import Session
from database.base import Thread

def create_thread(db: Session, lesson_id: int, user_id: str, topic: str):
    thread = Thread(lesson_id=lesson_id, user_id=user_id, topic=topic)
    db.add(thread)
    db.commit()
    db.refresh(thread)
    return thread

def delete_thread_by_id(db: Session, thread_id: int):
    thread = db.query(Thread).filter(Thread.id == thread_id).first()
    if thread:
        db.delete(thread)
        db.commit()
    return thread

def get_threads_by_lesson_id(db: Session, lesson_id: int):
    return db.query(Thread).filter(Thread.lesson_id == lesson_id).all()
