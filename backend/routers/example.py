from fastapi import APIRouter, Depends
from dependencies import get_cookies
from fastapi.responses import JSONResponse
from database.queries.sections import add_section
from database.config import SessionLocal

example_router = APIRouter()

# Realizar endpoint para agregar secciones

# 1._ Realizas peticion a un endpoint (Post, Get, Delete)
# 2._ Endpoint procesa la informacion
# 3._ Retornar el resultado

from pydantic import BaseModel

class newSection(BaseModel):
    course_id: int

@example_router.post("/add_section")
async def add_section(
    mtd_section: newSection,
    user_id: dict = Depends(get_cookies)
    ):

    # add section
    section_data = {
        "course_id" : mtd_section.course_id
    }
    
    response = add_section(
        db=SessionLocal(),
        section_data=section_data
    )

    # add leccion
    ...

    return JSONResponse(
        content="Procesos realizados correctamente",
        status_code=200
    )
