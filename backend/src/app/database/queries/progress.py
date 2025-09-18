from sqlalchemy.orm import Session
from app.database.base import Lesson
from app.database.base import LessonComplete

# Query 1: Guardar/marcar lección como completada
def mark_lesson_as_complete(db: Session, user_id: int, lesson_id: int) -> LessonComplete:
    """
    Marca una lección como completada para un usuario específico.
    Si ya existe el registro, no hace nada (evita duplicados).
    """
    # Verificar si ya existe el registro
    existing_complete = (
        db.query(LessonComplete)
        .filter(
            LessonComplete.user_id == user_id,
            LessonComplete.lesson_id == lesson_id
        )
        .first()
    )
    
    if existing_complete:
        return existing_complete
    
    # Crear nuevo registro
    lesson_complete = LessonComplete(
        user_id=user_id,
        lesson_id=lesson_id
    )
    
    db.add(lesson_complete)
    db.commit()
    db.refresh(lesson_complete)
    
    return lesson_complete


# Query 3: Verificar si una lección está completada (retorna boolean)
def is_lesson_completed(db: Session, user_id: int, lesson_id: int) -> bool:
    """
    Verifica si una lección está completada por un usuario.
    Retorna True si está completada, False si no.
    """
    return (
        db.query(LessonComplete)
        .filter(
            LessonComplete.user_id == user_id,
            LessonComplete.lesson_id == lesson_id
        )
        .first()
    ) is not None


# Query 6: Eliminar registro de lección completada (desmarcar)
def unmark_lesson_as_complete(db: Session, user_id: int, lesson_id: int) -> bool:
    """
    Desmarca una lección como completada (elimina el registro).
    Retorna True si se eliminó, False si no existía.
    """
    lesson_complete = (
        db.query(LessonComplete)
        .filter(
            LessonComplete.user_id == user_id,
            LessonComplete.lesson_id == lesson_id
        )
        .first()
    )
    
    if lesson_complete:
        db.delete(lesson_complete)
        db.commit()
        return True
    
    return False


# Query 7: Obtener progreso de un curso (lecciones completadas vs total)
def get_course_progress(db: Session, user_id: int, course_id: int) -> dict:
    """
    Obtiene el progreso de un usuario en un curso específico.
    Retorna diccionario con total_lessons, completed_lessons, y progress_percentage.
    """
    from sqlalchemy import func
    
    # Total de lecciones en el curso
    total_lessons = (
        db.query(func.count(Lesson.id))
        .filter(Lesson.course_id == course_id)
        .scalar()
    )
    
    # Lecciones completadas por el usuario en este curso
    completed_lessons = (
        db.query(func.count(LessonComplete.id))
        .join(Lesson, LessonComplete.lesson_id == Lesson.id)
        .filter(
            LessonComplete.user_id == user_id,
            Lesson.course_id == course_id
        )
        .scalar()
    )
    
    progress_percentage = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
    
    return {
        "total_lessons": total_lessons,
        "completed_lessons": completed_lessons,
        "progress_percentage": round(progress_percentage, 2)
    }
