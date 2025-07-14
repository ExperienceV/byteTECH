from fastapi import APIRouter, Depends, status
from database.queries.courses import (
    get_all_courses, 
    get_course_by_id, 
    save_purchase, 
    get_courses_by_user, 
    get_purchased_courses_by_user,
    purchase_exists
    )
from database.queries.sections import get_sections_by_course_id
from utils.util_routers import include_threads
from database.queries.lessons import get_lessons_by_section_id
from database.queries.user import get_user_by_id
from fastapi.responses import JSONResponse
from dependencies import get_cookies
from database.config import SessionLocal
from fastapi import Request
from database.base import Course
from parameters import settings
import stripe

stripe.api_key = settings.STRIPE_API_KEY 

courses_router = APIRouter(tags=["courses"], prefix="/courses")


@courses_router.get("/mtd_courses")
async def get_mtd_courses():
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
    mtd_courses_response = get_all_courses(db=SessionLocal())
    if not mtd_courses_response:
        return {"mtd_courses": []}
    
    mtd_courses = []
    for course in mtd_courses_response:
        user_id = course["sensei_id"]
        sensei = get_user_by_id(
            db=SessionLocal(),
            user_id=user_id
        )
        if sensei:
            course["sensei_name"] = sensei.username
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
    """
    Obtiene el contenido completo de un curso específico
    
    Entry:
        course_id: int (query parameter)
        user_info: dict (obtenido de cookies JWT)
    
    Return:
        status_code: 200 o 404
        content: json con:
            - is_paid: bool (si el usuario ha comprado el curso)
            - course_content: objeto con:
                - datos del curso
                - lecciones organizadas por secciones
                - hilos de discusión incluídos
    
    Errors:
        404: Curso no encontrado o sin secciones
    """
    course = get_course_by_id(
        db=SessionLocal(),
        course_id=course_id
        )
    if not course:
        return JSONResponse(status_code=404, content={"message": "Course not found"})
    
    # Verify if user pay the course
    is_paid = False

    if user_info:
        exist_response = purchase_exists(
            db=SessionLocal(),
            user_id=user_info["user_id"],
            course_id=course_id
        )

        if exist_response:
            is_paid = True

    course_data = course["course_data"]

    # Get section course
    sections_id = get_sections_by_course_id(
        db=SessionLocal(),
        course_id=course_id
        )

    if not sections_id:
        return JSONResponse(status_code=404, content={"message": "No sections found for this course"})
    
    # Get lessons of course
    lessons = get_lessons_by_section_id(
        db=SessionLocal(),
        sections_id=sections_id
        )
    
    lessons_with_threads = include_threads(lessons=lessons)

    course_data["content"] = lessons_with_threads

    return JSONResponse(
        content={
            "is_paid" : is_paid,
            "course_content": course_data
        },
        status_code=200
    )


@courses_router.get("/my_courses")
async def my_courses(
    user_info: dict = Depends(get_cookies)
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
    # Validar el tipo de usuario
    is_sensei = bool(user_info["is_sensei"])
    courses = []

    if is_sensei:
        get_response = get_courses_by_user(
            db=SessionLocal(),
            user_id=user_info["user_id"]
        )
        courses = get_response
    else:
        get_response = get_purchased_courses_by_user(
            db=SessionLocal(),
            user_id=user_info["user_id"]
        )
        courses = get_response
    
    return JSONResponse(
        content=courses,
        status_code=200
    )


@courses_router.post("/buy_course")
async def buy_course(
    course_id: int,
    user_info: dict = Depends(get_cookies)
):
    """
    Inicia el proceso de compra de un curso mediante Stripe
    
    Entry:
        course_id: int (ID del curso a comprar)
        user_info: dict (obtenido de cookies JWT)
    
    Return:
        status_code: 200, 404 o 409
        content: 
            - 200: URL de checkout de Stripe
            - 404: Curso no encontrado
            - 409: Usuario ya posee el curso
            - 500: Error de Stripe
    
    Errors:
        404: Curso no encontrado
        409: Usuario ya posee el curso
        500: Error en Stripe Checkout
    """
    db=SessionLocal()
    # Verificar si el usuario ya posee el curso
    get_response = get_purchased_courses_by_user(
        db=db,
        user_id=user_info["user_id"]
    )

    if course_id in get_response:
        return JSONResponse(
            content="Ya posees este curso",
            status_code=status.HTTP_409_CONFLICT
        )

   # Obtener info del curso desde la base
    course = db.query(Course).filter_by(id=course_id).first()
    if not course:
        return JSONResponse(
            content="Curso no encontrado",
            status_code=404
        )

    # Crear sesión de Stripe
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": course.name,
                            "description": course.description
                        },
                        "unit_amount": int(course.price * 100),
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            customer_email=user_info["user_email"],
            success_url=f"https://bytetechedu.com/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url="https://bytetechedu.com/cancel",
            metadata={
                "user_id": str(user_info["user_id"]),
                "course_id": str(course_id),
            }
        )

        return JSONResponse(
            content={"checkout_url": session.url},
            status_code=200
        )

    except Exception as e:
        return JSONResponse(content=str(e), status_code=500)


@courses_router.post("/webhook")
async def stripe_webhook(request: Request):
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
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            user_id = int(session["metadata"]["user_id"])
            course_id = int(session["metadata"]["course_id"])

            db = SessionLocal()
            save_purchase(db=db, user_id=user_id, course_id=course_id)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

    return JSONResponse(content={"received": True})