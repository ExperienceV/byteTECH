from sqlalchemy.orm import Session
from app.database.base import Thread
from app.database.queries.user import get_user_by_id


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
    threads = db.query(Thread).filter(Thread.lesson_id == lesson_id).all()
    if not threads:
        return None
    thread_list = []
    for thread in threads:
        user_data = get_user_by_id(db, thread.user_id)
        thread_data = {
            "id": thread.id,
            "lesson_id": thread.lesson_id,
            "username": user_data.username if user_data else None,
            "topic": thread.topic
        }
        thread_list.append(thread_data)
    return thread_list
