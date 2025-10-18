from fastapi import APIRouter, Depends, status, Request, Form
from sqlalchemy.orm import Session
from app.database.queries.courses import (
    get_all_courses, 
    get_course_by_id, 
    save_purchase, 
    get_courses_by_user, 
    get_purchased_courses_by_user,
    purchase_exists
)
from app.database.queries.sections import get_sections_by_course_id
from app.database.queries.preview import get_preview_files_by_course
from app.database.queries.marks import update_mark_time
from app.utils.util_routers import include_threads
from app.database.queries.progress import unmark_lesson_as_complete, get_course_progress, mark_lesson_as_complete
from app.database.queries.lessons import get_lessons_by_section_id
from app.database.queries.user import get_user_by_id
from fastapi.responses import JSONResponse
from app.dependencies import get_cookies, get_cookies_optional, get_db
from app.database.session import get_db_session, retry_db_operation
from app.database.base import Course
from app.parameters import settings
import stripe
from app.database.queries.courses import get_course_by_name
from typing import Optional

stripe.api_key = settings.STRIPE_API_KEY 

courses_router = APIRouter(tags=["courses"], prefix="/courses")


@courses_router.get("/mtd_courses")
@retry_db_operation(max_retries=3, delay=0.5)
async def get_mtd_courses(
    db: Session = Depends(get_db)
):
    """
    Obtiene todos los cursos disponibles con información del sensei
    
    Return:
        status_code: 200
        content: json con lista de cursos
            - Cada curso incluye:
                - datos del curso
                - nombre del sensei ("Unknown Sensei" si no se encuentra)
    
    Notas:
        - Si no hay cursos, retorna lista vacía
    """
    mtd_courses_response = get_all_courses(db=db)
    if not mtd_courses_response:
        return {"mtd_courses": []}
    
    mtd_courses = []
    for course in mtd_courses_response:
        user_id = course["sensei_id"]
        sensei = get_user_by_id(user_id=user_id, db=db)
        if sensei:
            course["sensei_name"] = sensei.username
        else:
            course["sensei_name"] = "Unknown Sensei"
        mtd_courses.append(course)

    return JSONResponse(
        content={"mtd_courses": mtd_courses},
        status_code=200
    )


@courses_router.get("/course_content")
@retry_db_operation(max_retries=3, delay=0.5)
async def get_course_content(
    course_name: Optional[str] = None,
    course_id: Optional[int] = None, 
    user_info: Optional[dict] = Depends(get_cookies_optional),
    db: Session = Depends(get_db)
):
    """
    Obtiene el contenido completo de un curso específico
    
    Entry:
        course_id: int (query parameter)
        course_name: str (query parameter, opcional)
        user_info: dict (obtenido de cookies JWT, opcional)
    
    Return:
        status_code: 200 o 404
        content: json con:
            - is_paid: bool (si el usuario ha comprado el curso, false si no está autenticado)
            - course_content: objeto con:
                - datos del curso
                - lecciones organizadas por secciones
                - hilos de discusión incluídos
                - progreso del curso (null si no está autenticado)
    
    Errors:
        404: Curso no encontrado o sin secciones
        
    Notas:
        - Este endpoint permite acceso sin autenticación para vista previa
        - Si no hay autenticación, is_paid será false y progress será null
    """
    if course_name:
        course = get_course_by_name(name=course_name, db=db)
    else:
        course = get_course_by_id(course_id=course_id, db=db)
    if not course:
        return JSONResponse(status_code=404, content={"message": "Course not found"})
    
    is_paid = False
    print(user_info)

    # Solo verificar si el usuario está autenticado
    if user_info:
        if user_info["is_sensei"]:
            is_paid = True
        else:
            exist_response = purchase_exists(user_id=user_info["user_id"], course_id=course_id, db=db)
            if exist_response:
                is_paid = True

    
    course_data = course["course_data"]
    sensei_name = get_user_by_id(user_id=course_data["sensei_id"], db=db)
    course_data["sensei_name"] = sensei_name.username if sensei_name else "Unknown Sensei"
    
    # Añadir progreso del curso solo si el usuario está autenticado
    if user_info:
        progress = get_course_progress(
            db=db, 
            user_id=user_info["user_id"], 
            course_id=course_id
            )
        course_data["progress"] = progress
    else:
        course_data["progress"] = None

    sections = get_sections_by_course_id(course_id=course_id, db=db)

    sections_data = {}
    count = 0
    for section in sections:
        id = section["id"]
        # Solo obtener lecciones con información de usuario si está autenticado
        if user_info:
            lessons = get_lessons_by_section_id(
                sections_id=[id], 
                db=db,
                user_id=user_info["user_id"])
        else:
            lessons = get_lessons_by_section_id(
                sections_id=[id], 
                db=db,
                user_id=None)
        lessons_with_threads = include_threads(lessons=lessons, db_session=db)
        section_info = {
            "id": id,
            "title": section["title"],
            "lessons": lessons_with_threads
        }
        sections_data[count + 1] = section_info
        count += 1

    course_data["content"] = sections_data
    print("Contenido del curso:", course_data)

    # Agregar preview
    preview = get_preview_files_by_course(db, course_id)
    course_data["preview"] = preview or None

    return JSONResponse(
        content={"is_paid": is_paid, "course_content": course_data},
        status_code=200
    )


@courses_router.get("/my_courses")
@retry_db_operation(max_retries=3, delay=0.5)
async def my_courses(
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):
    """
    Obtiene los cursos del usuario actual
    
    Entry:
        user_info: dict (obtenido de cookies JWT)
    
    Return:
        status_code: 200
        content: json con:
            - Para senseis: lista de cursos que ha creado
            - Para estudiantes: lista de cursos comprados
    
    Notas:
        - El tipo de respuesta varía según is_sensei en user_info
    """
    is_sensei = bool(user_info["is_sensei"])
    if is_sensei:
        print("Buscando cursos subidos por el sensei:", user_info)
        courses = get_courses_by_user(user_id=user_info["user_id"], db=db)
        print("Cusros del sensei:", courses)
    else:
        print(f"Buscando cursos comprados para: {user_info}")
        courses = get_purchased_courses_by_user(user_id=user_info["user_id"], db=db)
        print("Cusros del estudiante:", courses)
    
    response = {
        "is_sensei": is_sensei,
        "courses": courses
        }
    return JSONResponse(content=response, status_code=200)


@courses_router.post("/buy_course")
async def buy_course(
    course_id: int, 
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):
    """
    Inicia el proceso de compra de un curso mediante Stripe
    
    Entry:
        course_id: int (ID del curso a comprar)
        user_info: dict (obtenido de cookies JWT - REQUERIDO)
    
    Return:
        status_code: 200, 401, 404 o 409
        content: 
            - 200: URL de checkout de Stripe
            - 401: Usuario no autenticado
            - 404: Curso no encontrado
            - 409: Usuario ya posee el curso
            - 500: Error de Stripe
    
    Errors:
        401: Usuario no autenticado (debe iniciar sesión)
        404: Curso no encontrado
        409: Usuario ya posee el curso
        500: Error en Stripe Checkout
    """
    get_response = get_purchased_courses_by_user(user_id=user_info["user_id"], db=db)
    # get_response es una lista de diccionarios de cursos; validar por id
    if any(c.get("id") == course_id for c in get_response):
        return JSONResponse(
            content="Ya posees este curso",
            status_code=status.HTTP_409_CONFLICT
        )

    course = db.query(Course).filter_by(id=course_id).first()
    if not course:
        return JSONResponse(
            content="Curso no encontrado",
            status_code=404
        )

    try:
        # Construir URLs de retorno para Stripe (evitar tuplas accidentales)
        success_url = f"{settings.FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{settings.FRONTEND_URL}/cancel"

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": course.name,
                        "description": course.description
                    },
                    "unit_amount": int(course.price * 100),
                },
                "quantity": 1,
            }],
            mode="payment",
            customer_email=user_info["email"],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "user_id": str(user_info["user_id"]),
                "course_id": str(course_id),
            }
        )

        return JSONResponse(content={"checkout_url": session.url}, status_code=200)

    except Exception as e:
        # Reenviar el error real para depurar más fácil (idealmente loggear y no exponer en prod)
        return JSONResponse(content={"message": f"Stripe error: {str(e)}"}, status_code=500)


@courses_router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Webhook para recibir eventos de Stripe (pagos completados)
    
    Entry:
        request: Request (evento de Stripe)
    
    Return:
        status_code: 200 o 400
        content: 
            - 200: Confirmación de recepción
            - 400: Error al procesar el webhook
    
    Notas:
        - Procesa pagos completados para registrar compras
        - Requiere firma válida de Stripe
        - Secreto del webhook en configuración
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = settings.STRIPE_WEBHOOK

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            user_id = int(session["metadata"]["user_id"])
            course_id = int(session["metadata"]["course_id"])

            save_purchase(
                db=db,
                user_id=user_id, 
                course_id=course_id
                )

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

    return JSONResponse(content={"received": True})


@courses_router.post("/mark_progress")
async def mark_progress(
    lesson_id: int = Form(),
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):
    response = mark_lesson_as_complete(
        db=db,
        user_id=user_info["user_id"],
        lesson_id=lesson_id
    )
    
    if not response:
        return JSONResponse(status_code=404, content={"message": "Lesson not found"})
    
    # ✅ Esta línea debe estar al mismo nivel que el 'if', no indentada dentro
    return JSONResponse(status_code=200, content={"message": "Lesson progress marked successfully"})


@courses_router.delete("/unmark_progress")
async def unmark_progress(
    lesson_id: int,
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):
    """
    Elimina el progreso de una leccion para el usuario actual
    
    Entry:
        lesson_id: int (ID del curso)
        user_info: dict (obtenido de cookies JWT)
    
    Return:
        status_code: 200 o 404
        content: 
            - 200: Progreso eliminado exitosamente
            - 404: Curso no encontrado
    
    Notas:
        - Elimina el progreso del curso para el usuario actual
    """
    response = unmark_lesson_as_complete(
        db=db, 
        user_id=user_info["user_id"], 
        lesson_id=lesson_id
    )
    if not response:
        return JSONResponse(status_code=404, content={"message": "Lesson not found"})
    

    return JSONResponse(status_code=200, content={"message": "Lesson progress unmarked successfully"})


@courses_router.post("/update_mark_time")
async def mark_time(
    mark_id: int = Form(),
    mark_time: int = Form(),
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):
    response = update_mark_time(
        db=db,
        mark_id=mark_id,
        new_time=mark_time
    )
    
    if not response:
        return JSONResponse(status_code=404, content={"message": "Mark not found"})
    
    return JSONResponse(status_code=200, content={"message": "Lesson time marked successfully"})

