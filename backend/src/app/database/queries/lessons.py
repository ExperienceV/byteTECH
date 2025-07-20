from sqlalchemy.orm import Session
from app.database.base import Lesson


def create_lesson(db: Session, section_id: int, title: str, file_id: str, course_id: int) -> Lesson:
    lesson = Lesson(section_id=section_id, title=title, file_id=file_id, course_id=course_id)
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


def delete_lesson_by_id(db: Session, lesson_id: int) -> Lesson:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if lesson:
        db.delete(lesson)
        db.commit()
    return lesson


def get_lessons_by_section_id(db: Session, sections_id: list) -> list:
    lessons_data = []
    for id in sections_id:
        lessons = db.query(Lesson).filter(Lesson.section_id == id).all()
        if lessons:
            for lesson in lessons:
                lesson_info = {
                    "id": lesson.id,
                    "section_id": lesson.section_id,
                    "title": lesson.title,
                    "file_id": lesson.file_id
                }
                lessons_data.append(lesson_info)
    return lessons_data
