from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from database.queries.courses import add_course, delete_course, get_course_by_id, update_course
from database.queries.lessons import create_lesson, delete_lesson_by_id
from database.queries.sections import add_section, delete_section_by_id
from models import Course
from dependencies import get_cookies
from services.services_google import upload_file
from fastapi.responses import JSONResponse
from database.config import SessionLocal
from utils.util_routers import get_all_drive_ids, delete_drive_files
from models import Lesson


workbrench_router = APIRouter()


@workbrench_router.post("/new_course")
async def create_course(
    mtd: Course,
    file: UploadFile = File(...),
    user_info: dict = Depends(get_cookies)
):
    # Save file in Google Drive and get File ID
    file_id = upload_file(file=file)
    
    # Build metadata
    sensei_id = user_info.user_id
    course_data = {
        "sensei_id" : sensei_id,
        "name" : mtd.name,
        "description" : mtd.description,
        "price" : mtd.price,
        "duration" : mtd.duration,
        "miniature_id" : file_id
    }
    
    # Save course in DB
    course = add_course(
        db=SessionLocal(),
        course_data=course_data
    )

    return JSONResponse(
        content={
            "Message":"Succefully create!",
            "mtd_course":course
            },
        status_code=200
    )
    

@workbrench_router.post("/new_section/{course_id}")
async def create_section(
    course_id: int,
    user_info: dict = Depends(get_cookies)
):
    
    new_section_response = add_section(
        db=SessionLocal(),
        section_data={
            "course_id": course_id
        }
    )

    print(f"Nueva seccion: {new_section_response}")
    
    return JSONResponse(
        content=f"Nueva seccion creada: {new_section_response}"
    )


@workbrench_router.delete("/delete_section/{section_id}")
async def delete_section(
    section_id: int,
    user_info: dict = Depends(get_cookies)
):
    delete_section_response = delete_section_by_id(
        db=SessionLocal,
        section_id=section_id
    )

    return JSONResponse(
        content=f"Succesfully delete: {delete_section_response}"
    )


# --------------------------------------------------- DANILO ---------------------------------------------------


@workbrench_router.delete("/delete_course/{course_id}")
async def del_course(
    course_id: int,
    user_info: dict = Depends(get_cookies)
):

    sensei_id = user_info.user_id
    course_data = {
        "sensei_id" : sensei_id,
        "id" : course.id
    }

    # Borrar archivos de cada leccion
    course = get_course_by_id(
        db=SessionLocal(),
        course_id=course_id
    )

    files_ids = get_all_drive_ids(course=course)
    delete_drive_files(file_ids=files_ids)

    # Borrar el curso
    course = delete_course(
        db=SessionLocal(),
        course_id=course_id
    )

    return JSONResponse(
        content={
            "Message":"Succefully delete!",
            "mtd_course":course
            },
        status_code=200
    )

    
@workbrench_router.post("/add_lesson")
async def new_lesson(
    mtd: Lesson,
    file: UploadFile = File(...),
    user_info: dict = Depends(get_cookies)
):
    
    # Upload file to Google Drive
    file_id = upload_file(file=file)

    # Lesson create
    sensei_id = user_info.user_id
    create_response = create_lesson(
        db=SessionLocal(),
        section_id=mtd.section_id,
        title=mtd.title,
        is_video=mtd.is_video,
        course_id=mtd.course_id
    )

    return JSONResponse(
        content=f"New lesson: {create_response}",
        status_code=200
    )


@workbrench_router.post("/delete_lesson/{lesson_id}")
async def hell(
    lesson_id: int,
    user_info: dict = Depends(get_cookies)
):
    
    delete_lesson_by_id(lesson_id=lesson_id)


@workbrench_router.post("/edit_metadata")
async def edit_metadata(
    mtd: Course,
    user_info: dict = Depends(get_cookies),
):
    db=SessionLocal()

    if not mtd.id:
        raise HTTPException(status_code=400, detail="Course ID is required")

    updated = update_course(db, mtd.id, mtd.dict(exclude_unset=True, exclude={"id"}))

    if not updated:
        raise HTTPException(status_code=404, detail="Course not found")

    return {
        "detail": "Course metadata updated successfully",
        "course": {
            "id": updated.id,
            "name": updated.name,
            "description": updated.description,
            "price": updated.price,
            "duration": updated.hours
        }
    }

