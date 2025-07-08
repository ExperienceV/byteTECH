from database.queries.lessons import get_lessons_of_course
from database.queries.threads import get_threads_by_lesson_id
from database.config import SessionLocal


def include_threads(lessons: list) -> list:
    new_list = []
    for lesson in lessons:
        lesson_id = lesson["id"]
        get_threads = get_threads_by_lesson_id(
            db=SessionLocal(),
            lesson_id=lesson_id
        )
    
        lesson["threads"] = get_threads
        new_list.append(lesson)

    return new_list


