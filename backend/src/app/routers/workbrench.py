from fastapi import (
    APIRouter, 
    UploadFile, 
    File, 
    Depends, 
    HTTPException, 
    Form,
    status
)
from app.models import Course, GiveCourseRequest
from app.dependencies import get_cookies, get_db
from app.utils.storage import save_file, get_unique_name, delete_file
from app.utils.util_routers import get_video_duration_minutes, mkv_to_mp4_bytes
from app.database.queries.preview import add_preview_file, get_preview_files_by_course, update_preview_file_by_course
from pathlib import Path
from fastapi.responses import JSONResponse
from app.utils.util_routers import (
    get_all_drive_ids, 
    delete_drive_files
)
from app.database.queries.courses import (
    add_course, 
    delete_course, 
    update_course, 
    get_course_by_id,
    save_purchase,
    get_purchased_courses_by_user
)
from app.database.queries.lessons import (
    create_lesson, 
    delete_lesson_by_id
)
from app.database.queries.sections import (
    add_section, 
    delete_section_by_id, 
    get_file_ids_by_section_id
)
from app.database.queries.user import (
    get_user_by_email
)


workbrench_router = APIRouter(tags=["workbrench"], prefix="/workbrench")


@workbrench_router.post("/new_course")
async def create_course(
    name: str = Form(...),
    description: str = Form(...),
    price: str = Form(...),
    hours: str = Form(...),
    file: UploadFile = File(...),
    user_info: dict = Depends(get_cookies),
    db=Depends(get_db)
):  
    """
    Creates a new course with metadata and miniature image
    
    Entry:
        name: str (Course name as form data)
        description: str (Course description as form data)
        price: str (Course price as form data)
        hours: str (Course duration in hours as form data)
        file: UploadFile (Course miniature image file)
        user_info: dict (User info from JWT cookies)
    
    Return:
        status_code: 200
        content: json with:
            - Message: str (Success message)
            - mtd_course: dict with:
                - course_id: int
                - sensei_id: int
                - name: str
                - description: str
                - price: str
                - hours: str
                - miniature_id: str (Google Drive file ID)
    
    Process:
        1. Uploads miniature to Google Drive
        2. Creates course record in database
        3. Returns course metadata
    
    Errors:
        400: Missing required fields or invalid file
        500: Google Drive upload or database error
    """
    is_sensei = user_info.get("is_sensei")
    if not is_sensei:
        raise HTTPException(status_code=401, detail="Unauthorized")

    from pathlib import Path
    file_extension = Path(file.filename).suffix
    file_id = get_unique_name(extension=file_extension)

    file_content = await file.read()
    save_file(
        content=file_content,
        name=file_id
    )
    
    sensei_id = user_info["user_id"]
    course_data = {
        "sensei_id" : sensei_id,
        "name" : name,
        "description" : description,
        "price" : price,
        "hours" : hours,
        "miniature_id" : file_id
    }
    
    course = add_course(db, course_data)

    course_mtd = {
        "course_id" : course.id,
        "sensei_id" : sensei_id,
        "name" : name,
        "description" : description,
        "price" : price,
        "hours" : hours,
        "miniature_id" : file_id
    }

    return JSONResponse(
        content={
            "Message":"Successfully created!",
            "mtd_course":course_mtd
        },
        status_code=200
    )
    

@workbrench_router.delete("/delete_course/{course_id}")
async def del_course(
    course_id: int,
    user_info: dict = Depends(get_cookies),
    db=Depends(get_db)
):
    """
    Deletes a course and all associated files from Google Drive
    
    Entry:
        course_id: int (Path parameter - ID of course to delete)
        user_info: dict (User info from JWT cookies)
    
    Return:
        status_code: 200
        content: json with:
            - Message: str (Success message)
            - mtd_course: dict (Deleted course metadata)
    
    Process:
        1. Gets all Google Drive file IDs associated with course
        2. Deletes files from Google Drive
        3. Deletes course record from database
    
    Errors:
        404: Course not found
        500: Google Drive deletion or database error
    """
    is_sensei = user_info.get("is_sensei")
    if not is_sensei:
        raise HTTPException(status_code=401, detail="Unauthorized")
    course = get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    files_ids = get_all_drive_ids(course=course["object"])
    delete_drive_files(file_ids=files_ids)

    success = delete_course(db, course_id)
    if not success:
        raise HTTPException(status_code=500, detail="Error deleting course")

    # Borrar video de preview
    preview = course["preview"]
    if preview:
        delete_file(preview["file_id"])

    return JSONResponse(
        content={
            "Message":"Successfully deleted!",
            "mtd_course": course["course_data"]
        },
        status_code=200
    )


@workbrench_router.post("/new_section")
async def create_section(
    course_id: int = Form(...),
    section_name: str = Form(...),
    user_info: dict = Depends(get_cookies),
    db=Depends(get_db)
):
    """
    Creates a new empty section for a course
    
    Entry:
        course_id: int (Path parameter - ID of parent course)
        user_info: dict (User info from JWT cookies)
    
    Return:
        status_code: 200
        content: json with:
            - course_id: int
            - section_id: int (ID of newly created section)
    
    Process:
        1. Creates new section record linked to course
        2. Returns section metadata
    
    Errors:
        404: Parent course not found
        500: Database error
    """
    is_sensei = user_info.get("is_sensei")
    if not is_sensei:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    new_section_response = add_section(
        db=db, 
        section_data={
            "course_id": course_id,
            "title" : section_name
            }
        )

    mtd_section = {
        "title" : new_section_response.title, # STR
        "course_id" : new_section_response.course_id, # INT
        "section_id" : new_section_response.id # INT
    }

    response = {
        "Message" : "Section created successfully",
        "mtd_section" : mtd_section
    }

    return JSONResponse(content=response, status_code=200)


@workbrench_router.delete("/delete_section/{section_id}")
async def delete_section(
    section_id: int,
    user_info: dict = Depends(get_cookies),
    db=Depends(get_db)
):
    """
    Deletes a section and all associated lesson files
    
    Entry:
        section_id: int (Path parameter - ID of section to delete)
        user_info: dict (User info from JWT cookies)
    
    Return:
        status_code: 200
        content: str (Confirmation message with deleted section ID)
    
    Process:
        1. Gets all Google Drive file IDs associated with section lessons
        2. Deletes files from Google Drive
        3. Deletes section record from database
    
    Errors:
        404: Section not found
        500: Google Drive deletion or database error
    """

    is_sensei = user_info.get("is_sensei")
    if not is_sensei:
        raise HTTPException(status_code=401, detail="Unauthorized")
    file_ids = get_file_ids_by_section_id(db, section_id)
    delete_drive_files(file_ids=file_ids)

    delete_section_response = delete_section_by_id(db, section_id)


    response = {
        "Message" : "Section deleted successfully",
        "section_id" : section_id
    }

    print(response)
    return JSONResponse(content=response, status_code=200)


@workbrench_router.post("/add_lesson")
async def new_lesson(
    section_id: int = Form(...),
    course_id: int = Form(...),
    title: str = Form(...),
    file: UploadFile = File(...),
    time_validator: float = Form(...),
    user_info: dict = Depends(get_cookies),
    db=Depends(get_db)
):
    """
    Creates a new lesson with associated content file
    
    Entry:
        section_id: int (Form data - parent section ID)
        course_id: int (Form data - parent course ID)
        title: str (Form data - lesson title)
        file: UploadFile (Lesson content file)
        user_info: dict (User info from JWT cookies)
    
    Return:
        status_code: 200
        content: json with:
            - id: int (new lesson ID)
            - title: str (lesson title)
            - file_id: str (Google Drive file ID)
    
    Process:
        1. Uploads lesson file to Google Drive
        2. Creates lesson record in database
        3. Returns lesson metadata
    
    Errors:
        400: Missing required fields or invalid file
        404: Parent section/course not found
        500: File upload or database error
    """
    try:
        is_sensei = user_info.get("is_sensei")
        if not is_sensei:
            raise HTTPException(status_code=401, detail="Unauthorized")
        file_extension = Path(file.filename).suffix.lower()
        # 📌 Leer el archivo UNA SOLA VEZ
        contents = await file.read()

        mime_type = file.content_type or ""

        # Soporte MKV: convertir a MP4 si es MKV
        is_mkv = file_extension == ".mkv" or "matroska" in mime_type or mime_type == "video/x-matroska"
        if is_mkv:
            try:
                mp4_bytes = await mkv_to_mp4_bytes(contents)
                contents = mp4_bytes
                file_extension = ".mp4"
                mime_type = "video/mp4"
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"No se pudo convertir el MKV a MP4: {e}")

        file_id = get_unique_name(extension=file_extension)

        # Guardar en almacenamiento (MP4 si fue convertido)
        save_file(
            content=contents,
            name=file_id
        )

        # Calcular duración solo para MP4
        if mime_type == "video/mp4":
            duration = await get_video_duration_minutes(contents)
        else:
            duration = 0

        create_response = create_lesson(
            db=db, 
            section_id=section_id, 
            title=title, 
            file_id=file_id, 
            course_id=course_id,
            mime_type=mime_type,
            time_validator=duration
        )

        lesson = {
            "id" : create_response.id,
            "title" : create_response.title,
            "file_id" : create_response.file_id,
        }

        response = {
            "Message" : "Lesson created successfully",
            "lesson" : lesson
        }

        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=f"Error creating lesson: {e}")


@workbrench_router.post("/delete_lesson/{file_id}/{lesson_id}")
async def delete_lesson(
    file_id: str,
    lesson_id: int,
    user_info: dict = Depends(get_cookies),
    db=Depends(get_db)
):
    """
    Deletes a lesson and its associated content file
    
    Entry:
        file_id: str (Path parameter - Google Drive file ID)
        lesson_id: int (Path parameter - lesson ID)
        user_info: dict (User info from JWT cookies)
    
    Return:
        status_code: 200
        content: str (Success message)
    
    Process:
        1. Deletes file from Google Drive
        2. Deletes lesson record from database
    
    Errors:
        404: Lesson or file not found
        500: File deletion or database error
    """

    is_sensei = user_info.get("is_sensei")
    if not is_sensei:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    delete_file(name=file_id)
    delete_lesson_by_id(db, lesson_id)
    return JSONResponse(content="Lesson deleted successfully!", status_code=200)


@workbrench_router.post("/edit_metadata")
async def edit_metadata(
    mtd: Course,
    user_info: dict = Depends(get_cookies),
    db=Depends(get_db),
):
    """
    Updates course metadata
    
    Entry:
        mtd: Course (JSON body with course data)
            - course_id: int (required)
            - name: str (optional)
            - description: str (optional)
            - preludio: str (optional)
            - requirements: str (optional)
            - price: float (optional)
            - hours: int (optional)
        user_info: dict (User info from JWT cookies)
    
    Return:
        status_code: 200
        content: json with:
            - detail: str (Success message)
            - course: dict (Updated course data)
    
    Errors:
        400: Missing course ID
        404: Course not found
    """
    if not mtd.course_id:
        raise HTTPException(status_code=400, detail="Course ID is required")

    updated = update_course(db, mtd.course_id, mtd.model_dump(exclude_unset=True, exclude={"id"}))

    if not updated:
        raise HTTPException(status_code=404, detail="Course not found")

    return {
        "detail": "Course metadata updated successfully",
        "course": {
            "id": updated.id,
            "name": updated.name,
            "description": updated.description,
            "preludio": updated.preludio,
            "requirements": updated.requirements,
            "price": updated.price,
            "duration": updated.hours
        }
    }


@workbrench_router.post("/give_course")
async def give_course(
    payload: GiveCourseRequest,
    user_info: dict = Depends(get_cookies),
    db=Depends(get_db)
):

    is_sensei = user_info["is_sensei"]
    if not is_sensei:
        raise HTTPException(status_code=403, detail="User is not a sensei")
    
    user_to_give = get_user_by_email(db, payload.user_email_to_give)
    if not user_to_give:
        raise HTTPException(status_code=404, detail="User not found")

    # Validar contra los cursos del destinatario, no del sensei autenticado
    recipient_id = user_to_give["id"]
    purchased = get_purchased_courses_by_user(user_id=recipient_id, db=db) or []
    # Algunos listados pueden usar 'id' o 'course_id' como llave
    if any((c.get("id") == payload.course_id) or (c.get("course_id") == payload.course_id) for c in purchased):
        return JSONResponse(
            content={"message": "Ya posee este curso"},
            status_code=status.HTTP_409_CONFLICT
        )

    save_response = save_purchase(db, recipient_id, payload.course_id)

    return JSONResponse(
        content={"message": f"El curso con el ID {payload.course_id} fue transferido correctamente"},
        status_code=200
    )


@workbrench_router.post("/upload_preview")
async def upload_preview(
    course_id: int,
    file: UploadFile = File(...),
    user_info: dict = Depends(get_cookies),
    db=Depends(get_db)
):

    is_sensei = user_info.get("is_sensei")
    if not is_sensei:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    file_extension = Path(file.filename).suffix.lower()
    file_content = await file.read()

    mime_type = file.content_type or ""

    # Soporte MKV para preview: convertir a MP4
    is_mkv = file_extension == ".mkv" or "matroska" in mime_type or mime_type == "video/x-matroska"
    if is_mkv:
        try:
            mp4_bytes = await mkv_to_mp4_bytes(file_content)
            file_content = mp4_bytes
            file_extension = ".mp4"
            mime_type = "video/mp4"
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"No se pudo convertir el MKV a MP4: {e}")

    file_id = get_unique_name(extension=file_extension)

    save_file(
        content=file_content,
        name=file_id
    )

    file_preview = get_preview_files_by_course(db, course_id)
    
    if file_preview:
        print("File already exists, updating...")
        delete_file(file_preview["file_id"])
        response = update_preview_file_by_course(db, course_id, file_id)
    else:
        print("File does not exist, adding...") 
        response = add_preview_file(db, course_id, file_id)
    

    return JSONResponse(content=response, status_code=200)
