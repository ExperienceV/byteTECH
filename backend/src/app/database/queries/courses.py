from sqlalchemy.orm import Session
from app.database.base import Course, Purchase
from app.utils.util_database import course_to_dict
from app.utils.util_routers import delete_file
from app.database.queries.lessons import get_lessons_by_section_id
from app.database.queries.sections import get_sections_by_course_id
from app.database.queries.user import get_user_by_id


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

    return [
        {
            "id": course.id,
            "sensei_id": course.sensei_id,
            "name": course.name,
            "description": course.description,
            "hours": course.hours,
            "miniature_id": course.miniature_id,
            "price": course.price
        }
        for course in courses
    ]


def get_course_by_id(db: Session, course_id: int) -> dict | None:
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        return None

    course_data = {
        "id": course.id,
        "sensei_id": course.sensei_id,
        "name": course.name,
        "description": course.description,
        "hours": course.hours,
        "miniature_id": course.miniature_id,
        "video_id": course.video_id,
        "price": course.price
    }
    return {
        "object": course,
        "course_data": course_data
    }


def update_course(db: Session, course_id: int, update_data: dict) -> Course | None:
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        return None
    for key, value in update_data.items():
        setattr(course, key, value)
    db.commit()
    db.refresh(course)
    return course


def save_purchase(db: Session, user_id: int, course_id: int):
    new_purchase = Purchase(user_id=user_id, course_id=course_id)
    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)
    return new_purchase


def get_courses_by_user(db: Session, user_id: int):
    courses = db.query(Course).filter(Course.sensei_id == user_id).all()
    courses = [course_to_dict(c) for c in courses]
    for course in courses:
        course.pop("video_id", None)
        sensei_id = course["sensei_id"]
        user = get_user_by_id(db, sensei_id)
        course["sensei_name"] = user.username


    return courses


def get_purchased_courses_by_user(db: Session, user_id: int) -> list[int]:
    courses = (
        db.query(Course)
        .join(Purchase, Purchase.course_id == Course.id)
        .filter(Purchase.user_id == user_id)
        .all()
    )

    courses = [course_to_dict(c) for c in courses]
    for course in courses:
        course.pop("video_id", None)
        sensei_id = course["sensei_id"]
        user = get_user_by_id(db, sensei_id)
        course["sensei_name"] = user.username


    return courses


def delete_course_and_relations(db: Session, course_id: int) -> bool:
    try:
        course_dict = get_course_by_id(db, course_id)
        course_obj = course_dict["object"] if course_dict else None
        if not course_obj:
            return False

        for file_id in [course_obj.miniature_id, course_obj.video_id]:
            if file_id:
                try:
                    delete_file(file_id)
                except Exception as e:
                    print(f"Error al eliminar archivo {file_id}: {e}")

        sections_id = get_sections_by_course_id(db, course_id)
        lessons = get_lessons_by_section_id(db, sections_id)

        for lesson in lessons:
            file_id = lesson.get("file_id")
            if file_id:
                try:
                    delete_file(file_id)
                except Exception as e:
                    print(f"Error al eliminar archivo de lección {file_id}: {e}")

        success = delete_course(db, course_id)
        if not success:
            return False

        db.commit()
        return True

    except Exception as e:
        print(f"Error al eliminar curso y relaciones: {e}")
        db.rollback()
        return False


def purchase_exists(db: Session, user_id: int, course_id: int) -> bool:
    return db.query(Purchase).filter_by(user_id=user_id, course_id=course_id).first() is not None
