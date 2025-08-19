from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.database.queries.stats import get_stats
from app.database.queries.lessons import get_total_lessons_by_course
from app.dependencies import get_db

stats_router = APIRouter(tags=["stats"])


@stats_router.get("/lessons_course")
async def get_lessons(
    course_id: int,
    db: dict = Depends(get_db)
):
    """
    Endpoint to retrieve statistics about lessons.
    This is a placeholder implementation.
    """
    total_lessons = get_total_lessons_by_course(
        db=db,
        course_id=course_id
    )
    
    return JSONResponse(
        content=total_lessons,
        status_code=200
    )


@stats_router.get("/stats")
async def stats(
    db: dict = Depends(get_db)
):
    """
    Endpoint to retrieve statistics.
    This is a placeholder implementation.
    """
    sales = get_stats(
        db=db
    )
    
    return JSONResponse(
        content=sales,
        status_code=200)