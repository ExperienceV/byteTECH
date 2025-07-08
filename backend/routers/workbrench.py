from fastapi import APIRouter, UploadFile, File, Depends
from database.queries.courses import add_course
from models import Course
from dependencies import get_cookies

workbrench_router = APIRouter()

@workbrench_router.post("/new_course")
async def create_course(
    mtd: Course,
    file: UploadFile = File(...),
    user_info: dict = Depends(get_cookies)
):
    # Guardar archivo en GD y obtener Path

    file_path = ""
    #
    
    sensei_id = user_info.user_id
    course_data = {
        "sensei_id" : sensei_id,
        "name" : mtd.name,
        "description" : mtd.description,
        "price" : mtd.price,
        "duration" : mtd.duration,
        "miniature_path" : file_path
    }
    pass


