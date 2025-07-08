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

def get_lessons_by_sectionid(db: Session, sections_id: list):

    for id in sections_id:
        lessons = db.query(Lesson).filter(Lesson.section_id == id).all()

        lessons_data = []
        if lessons:
            for lesson in lessons:
                lesson_info = {
                    "id": lesson.id,
                    "section_id": lesson.section_id,
                    "title": lesson.title,
                    "is_video": lesson.is_video,
                    "file_path": lesson.file_path
                }
                lessons_data.append(lesson_info)

    return lessons_data

