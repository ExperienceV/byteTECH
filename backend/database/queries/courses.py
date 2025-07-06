from sqlalchemy.orm import Session
from database.base import Course, Purchase



def add_course(db: Session, course_data: dict) -> Course:
    course = Course(**course_data)
    db.add(course)
    db.commit()
    db.refresh(course)
    return course



def delete_course(db: Session, course_id: int) -> bool:
    course = db.query(Course).filter(Course.id == course_id).first()
    if course:
        db.delete(course)
        db.commit()
        return True
    return False



def get_all_courses(db: Session) -> list[Course]:
    return db.query(Course).all()



def get_course_by_id(db: Session, course_id: int) -> Course | None:
    return db.query(Course).filter(Course.id == course_id).first()



def update_course(db: Session, course_id: int, update_data: dict) -> Course | None:
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        return None
    for key, value in update_data.items():
        setattr(course, key, value)
    db.commit()
    db.refresh(course)
    return course


def get_uploaded_courses_by_user(db: Session, user_id: int) -> list[Course]:
    return db.query(Course).filter(Course.sensei_id == user_id).all()

def get_purchased_courses_by_user(db: Session, user_id: int) -> list[Course]:
    return (
        db.query(Course)
        .join(Purchase, Purchase.course_id == Course.id)
        .filter(Purchase.user_id == user_id)
        .all()
    )

