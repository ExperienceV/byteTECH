from sqlalchemy.orm import Session
from app.database.base import PreviewFile   
from sqlalchemy import select, delete, update

# Crear un nuevo registro
def add_preview_file(db: Session, course_id: int, file_id: str) -> dict:
    new_file = PreviewFile(course_id=course_id, file_id=file_id)
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    return {
        "id": new_file.id,
        "course_id": new_file.course_id,
        "file_id": new_file.file_id,
    }

# Obtener UN archivo por course_id (el primero que coincida)
def get_preview_files_by_course(db: Session, course_id: int) -> dict | None:
    stmt = select(PreviewFile).where(PreviewFile.course_id == course_id)
    result = db.scalars(stmt).first()
    if result:
        return {
            "id": result.id,
            "course_id": result.course_id,
            "file_id": result.file_id,
        }
    return None

# Borrar archivos por course_id
def delete_preview_files_by_course(db: Session, course_id: int) -> dict:
    stmt = delete(PreviewFile).where(PreviewFile.course_id == course_id)
    result = db.execute(stmt)
    db.commit()
    return {"deleted": result.rowcount}  # cantidad de filas borradas


# Actualizar el file_id según el course_id
def update_preview_file_by_course(db: Session, course_id: int, new_file_id: str) -> dict | None:
    stmt = (
        update(PreviewFile)
        .where(PreviewFile.course_id == course_id)
        .values(file_id=new_file_id)
        .returning(PreviewFile.id, PreviewFile.course_id, PreviewFile.file_id)
    )
    result = db.execute(stmt)
    db.commit()
    row = result.fetchone()
    if row:
        return {"id": row.id, "course_id": row.course_id, "file_id": row.file_id}
    return None
