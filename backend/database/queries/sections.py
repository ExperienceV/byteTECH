from sqlalchemy.orm import Session
from database.base import Section


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


def get_sections_by_course_id(db: Session, course_id: int) -> list[Section]:
    setcions_data = db.query(Section).filter(Section.course_id == course_id).all()
    if not setcions_data:
        return []
    
    sections_id = []
    for section in setcions_data:
        sections_id.append(section.id)

    
    return sections_id
