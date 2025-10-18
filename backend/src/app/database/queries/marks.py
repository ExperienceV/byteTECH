from sqlalchemy.orm import Session
from app.database.base import LessonMarkTime


def get_mark_by_lesson_and_user(db: Session, lesson_id: int, user_id: int):
    # Si no hay usuario autenticado, retornar None
    if user_id is None:
        return None
        
    mark = db.query(LessonMarkTime).filter(
        LessonMarkTime.lesson_id == lesson_id,
        LessonMarkTime.user_id == user_id
    ).first()

    if not mark:
        add_response = create_mark(db, lesson_id, user_id, 0)
        return add_response
    return mark


def create_mark(db: Session, lesson_id: int, user_id: int, mark_time: int):
    mark = LessonMarkTime(lesson_id=lesson_id, user_id=user_id, mark_time=mark_time)
    db.add(mark)
    db.commit()
    db.refresh(mark)
    return mark


def update_mark_time(db: Session, mark_id: int, new_time: int):
    mark = db.query(LessonMarkTime).filter(LessonMarkTime.id == mark_id).first()
    if mark:
        mark.mark_time = new_time
        db.commit()
        db.refresh(mark)
    return mark
