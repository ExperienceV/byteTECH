from database.queries.threads import get_threads_by_lesson_id
from database.config import SessionLocal
from database.base import Course
from services.services_google import delete_file


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


def get_all_drive_ids(course: Course):
    # Inicializar lista con los archivos del propio curso
    drive_ids = []
    if course.miniature_id:
        drive_ids.append(course.miniature_id)
    if course.video_id:
        drive_ids.append(course.video_id)

    # Agregar los archivos de cada lección del curso
    for lesson in course.lessons:
        if lesson.file_id:
            drive_ids.append(lesson.file_id)

    return drive_ids


def delete_drive_files(file_ids: list[str]):
    for fid in file_ids:
        try:
            delete_file(fid) 
        except Exception as e:
            print(f"Error deleting {fid}: {e}")



