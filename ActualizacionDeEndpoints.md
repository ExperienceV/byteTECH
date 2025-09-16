# Integracion para el sistema de progreso.

# Endpoints Actualizados
```go
// Todos los endpoints que tienen la dependencia a get_cookies deben tener incluidas las credenciales

// Endpoint para la obtencion del CONTENIDO de un curso
@courses_router.get("/courses/course_content")
async def get_course_content(
    course_id: int, 
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):

Respuestas:

CODIGO DE ESTADO 200:
{
    "is_paid": None,  # bool
    "course_content": {
        "id": None,  # int
        "sensei_id": None,  # int
        "name": None,  # str
        "description": None,  # str
        "hours": None,  # int
        "miniature_id": None,  # str
        "video_id": None,  # str | None
        "price": None,  # int | float
        "sensei_name": None,  # str
        "progress": {
            "total_lessons": None,  # int
            "completed_lessons": None,  # int
            "progress_percentage": None  # int | float
        },
        "content": {
            "<section_number>": {  # str (clave dinámica: "1", "2", etc.)
                "id": None,  # int
                "title": None,  # str
                "lessons": [
                    {
                        "id": None,  # int
                        "section_id": None,  # int
                        "title": None,  # str
                        "file_id": None,  # str
                        "mime_type": None,  # str
                        "time_validator": None,  # float
                        "is_completed": None,  # bool
                        "threads": [
                            {
                                "id": None,  # int
                                "lesson_id": None,  # int
                                "username": None,  # str | None
                                "topic": None  # str
                            }
                        ]  # list | None
                    }
                ]
            }
        }
    }
}


CODIGO DE ESTADO 404:
{
  "message": "Course not found"
}


// Endpoint para la obtencion de los METADATOS de un curso; Este va en HOME
// SOLO NECESITA LAS CREDENCIALES INCLUIDAS
@courses_router.get("/courses/my_courses")
async def my_courses(
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):

RESPUESTAS:
Estado 200:
{
    "is_sensei": None,  # bool
    "courses": [  # list
        {
            "id": None,  # int
            "sensei_id": None,  # int
            "name": None,  # str
            "description": None,  # str
            "hours": None,  # int
            "miniature_id": None,  # str
            "price": None,  # int | float
            "sensei_name": None,  # str
            "lessons_count": None,  # int
            "progress": None  # int | float
        }
    ]
}



// Endpoint para crear una nueva seccion
@workbrench_router.post("/workbrench/new_section/{course_id}")
async def create_section(
    course_id: int,
    section_name: str,
    user_info: dict = Depends(get_cookies),
    db=Depends(get_db)
):

Respuestas:
200
"Todo bien papito"


// Enpoint para marcar una leccion como finalizada
@courses_router.post("/courses/mark_progress")
async def mark_progress(
    lesson_id: int,
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):

Respuestas:
200:
"Todo bien papito"

404:
"La leccion no existe papito"


// NOTAS
//Cuando un usuario pasa "time_validator" tiempo en una leccion debe realizarse una peticion al endpoint de 
// mark_progress enviando el id de la leccion para marcarla como finalizada y actualizar el diseño.
// Las lecciones tiene un parametro "is_complete" el cual debe usarse para indicarle al usuario cuando una leccion fue finalizada



```