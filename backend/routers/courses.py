from fastapi import APIRouter

courses_router = APIRouter()

@courses_router.get("/mtd_courses")
async def get_mtd_courses():
    