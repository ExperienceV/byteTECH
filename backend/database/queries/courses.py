from sqlalchemy.orm import Session
from database.base import Course, Purchase, UploadedCourse


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
    courses = db.query(Course).all()
    if not courses:
        return []
    
    mtd_courses = []

    for course in courses:
        mtd_course = {
            "id": course.id,
            "sensei_id": course.sensei_id,
            "name": course.name,
            "description": course.description,
            "section_count": course.section_count,
            "hours": course.hours,
            "miniature_path": course.miniature_path,
            "price": course.price
        }
        mtd_courses.append(mtd_course)

    return mtd_courses


def get_course_by_id(db: Session, course_id: int) -> Course | None:
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        return None

    course_data = {
        "id": course.id,
        "sensei_id": course.sensei_id,
        "name": course.name,
        "description": course.description,
        "section_count": course.section_count,
        "hours": course.hours,
        "miniature_path": course.miniature_path,
        "video_path": course.video_path,
        "price": course.price
        }
    return course_data


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
    return (
        db.query(Course)
        .join(UploadedCourse, UploadedCourse.course_id == Course.id)
        .filter(UploadedCourse.user_id == user_id)
        .all()
    )


def get_purchased_courses_by_user(db: Session, user_id: int) -> list[Course]:
    return (
        db.query(Course)
        .join(Purchase, Purchase.course_id == Course.id)
        .filter(Purchase.user_id == user_id)
        .all()
    )

