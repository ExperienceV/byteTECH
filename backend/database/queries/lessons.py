from sqlalchemy.orm import Session
from database.base import Lesson

def create_lesson(db: Session, section_id: int, title: str, is_video: bool, file_path: str):
    lesson = Lesson(section_id=section_id, title=title, is_video=is_video, file_path=file_path)
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson

def delete_lesson_by_id(db: Session, lesson_id: int):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if lesson:
        db.delete(lesson)
        db.commit()
    return lesson

def get_lessons_by_section(db: Session, section_id: int):
    return db.query(Lesson).filter(Lesson.section_id == section_id).all()
