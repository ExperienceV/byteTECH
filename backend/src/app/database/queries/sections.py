from sqlalchemy.inspection import inspect
from sqlalchemy.orm import Session
from app.database.base import Section
from app.database.queries.lessons import get_lessons_by_section_id


def add_section(db: Session, section_data: dict) -> Section:
    section = Section(**section_data)
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


def delete_section_by_id(db: Session, section_id: int) -> bool:
    section = db.query(Section).filter(Section.id == section_id).first()
    if section:
        db.delete(section)
        db.commit()
        return True
    return False


def get_sections_by_course_id(db: Session, course_id: int) -> list[int]:
    sections_data = db.query(Section).filter(Section.course_id == course_id).all()
    if not sections_data:
        return []
    data = [sqlalchemy_to_dict(section) for section in sections_data]
    print(f"Sections for course {course_id}: {data}")
    return data


def get_file_ids_by_section_id(db: Session, section_id: int) -> list[int]:
    lessons = get_lessons_by_section_id(db, [section_id])
    return [lesson['file_id'] for lesson in lessons if lesson.get('file_id')]



def sqlalchemy_to_dict(obj):
    return {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs}
