from database.queries.courses import delete_course, get_course_by_id
from database.queries.sections import get_sections_by_course_id
from database.queries.lessons import get_lessons_by_section_id
from services.services_google import delete_file
from database.config import SessionLocal

def delete_course_and_relations(course_id: int):
    db = SessionLocal()
    try:
        # Obtener el curso para acceder a miniature_id y video_id
        course = get_course_by_id(
            db=SessionLocal(),
            course_id=course_id
        )

        # Eliminar archivos del curso en Google Drive
        for file_id in [course.miniature_id, course.video_id]:
            if file_id:
                try:
                    delete_file(file_id)
                except Exception as e:
                    print(f"Error al eliminar archivo {file_id}: {e}")

        # Obtener el ID de todas las secciones disponibles en el curso
        sections_id = get_sections_by_course_id(
            db=SessionLocal(),
            course_id=course_id
        )

        # Obtenemos todas las lecciones de cada seccion
        lessons = get_lessons_by_section_id(
            db=SessionLocal(),
            sections_id=sections_id
        )

        for lesson in lessons:
            file_id = lesson

        # Eliminar el curso (cascada manejará sections, lessons, threads, purchases, uploaded_courses)
        success = delete_course(db, course_id)
        if not success:
            return False

        db.commit()
        return True

    except Exception as e:
        print(f"Error al eliminar curso y relaciones: {e}")
        db.rollback()
        return False

    finally:
        db.close()


