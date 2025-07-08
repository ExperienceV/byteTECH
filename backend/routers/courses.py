from fastapi import APIRouter, Depends
from database.queries.courses import get_all_courses, get_course_by_id
from database.queries.sections import get_sections_by_course_id
from utils.util_routers import include_threads
from database.queries.lessons import get_lessons_of_course
from database.queries.user import get_user_by_id
from fastapi.responses import JSONResponse
from dependencies import get_cookies


courses_router = APIRouter()


@courses_router.get("/mtd_courses")
async def get_mtd_courses(user_id: dict = Depends(get_cookies)):
    mtd_courses_response = get_all_courses()
    if not mtd_courses_response:
        return {"mtd_courses": []}
    
    mtd_courses = []
    for course in mtd_courses_response:
        sensei = get_user_by_id(course["sensei_id"])
        if sensei:
            course["sensei_name"] = sensei['name']
            mtd_courses.append(course)
        else:
            course["sensei_name"] = "Unknown Sensei"


    return JSONResponse(
        content={
            "mtd_courses": mtd_courses
        },
        status_code=200
    )


@courses_router.get("/course_content")
async def get_course_content(
    course_id: int, 
    user_info: dict = Depends(get_cookies)
    ):
    """ Endpoint to get the content of a course by its ID. """
    course = get_course_by_id(course_id)
    if not course:
        return JSONResponse(status_code=404, content={"message": "Course not found"})
    
    # Get section course
    sections_id = get_sections_by_course_id(course_id)
    if not sections_id:
        return JSONResponse(status_code=404, content={"message": "No sections found for this course"})
    
    # Get lessons of course
    lessons = get_lessons_of_course(sections_id)
    if not lessons:
        return JSONResponse(status_code=404, content={"message": "No lessons found for this course"})
    
    # Include threads in lessons
    lessons_with_threads = include_threads(lessons=lessons)

    course["content"] = lessons_with_threads

    return JSONResponse(
        content={
            "course_content": course
        },
        status_code=200
    )

