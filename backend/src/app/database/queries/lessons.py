from sqlalchemy.orm import Session
from app.database.base import Lesson
from sqlalchemy import func


def create_lesson(db: Session, section_id: int, title: str, file_id: str, course_id: int, mime_type: str, time_validator: float) -> Lesson:
    lesson = Lesson(
        section_id=section_id, 
        title=title, 
        file_id=file_id, 
        course_id=course_id,
        mime_type=mime_type,
        time_validator=time_validator
    )
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


def get_total_lessons_by_course(db, course_id: int):
    total = db.query(func.count(Lesson.id)) \
              .filter(Lesson.course_id == course_id) \
              .scalar()
    return total


def get_lessons_by_section_id(db: Session, sections_id: list, user_id: int) -> list:
    lessons_data = []
    for id in sections_id:
        lessons = db.query(Lesson).filter(Lesson.section_id == id).all()
        if lessons:
            for lesson in lessons:
                # Aquí podrías agregar lógica para verificar si el usuario ha completado la lección
                from app.database.queries.progress import is_lesson_completed
                is_completed = is_lesson_completed(db, user_id, lesson.id)


                lesson_info = {
                    "id": lesson.id,
                    "section_id": lesson.section_id,
                    "title": lesson.title,
                    "file_id": lesson.file_id,
                    "mime_type": lesson.mime_type,
                    "time_validator": lesson.time_validator,
                    "is_completed": is_completed
                }
                lessons_data.append(lesson_info)
    return lessons_data
