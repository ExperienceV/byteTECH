from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_cookies, get_db
from fastapi.responses import JSONResponse
from app.database.queries.threads import get_threads_by_lesson_id, create_thread, delete_thread_by_id
from app.database.queries.messages import create_message, get_messages_by_thread_id
from app.models import Message, Thread

forums_router = APIRouter(tags=["forums"], prefix="/forums")


@forums_router.post("/create_thread/")
async def create_new_thread(
    thread: Thread,
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):
    """
    Crea un nuevo hilo de discusión en un foro de lección
    
    Entry:
        thread: Thread object con:
            - lesson_id: int (ID de la lección)
            - topic: str (Título del hilo)
        user_info: dict (obtenido de cookies JWT)
    
    Return:
        status_code: 201 o 400
        content: json con:
            - message: str
            - thread: dict con id y título del nuevo hilo
    
    Errors:
        400: Error al crear el hilo
    """
    new_thread_response = create_thread(
        lesson_id=thread.lesson_id,
        user_id=user_info["user_id"],
        topic=thread.topic,
        db=db
    )

    if not new_thread_response:
        return JSONResponse(status_code=400, content={"message": "Error creating thread"})
    
    new_thread = {
        "id": new_thread_response.id,
        "title": new_thread_response.topic,
    }

    return JSONResponse(status_code=201, content={"message": "Thread created successfully", "thread": new_thread})


@forums_router.delete("/delete_thread/")
async def delete_thread(
    thread_id: int, 
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):
    """
    Elimina un hilo de discusión por su ID
    
    Entry:
        thread_id: int (ID del hilo a eliminar)
        user_info: dict (obtenido de cookies JWT)
    
    Return:
        status_code: 200 o 400
        content: json con mensaje de estado
    
    Errors:
        400: Error al eliminar el hilo
    """
    deleted = delete_thread_by_id(
        thread_id=thread_id,
        db=db
    )

    if not deleted:
        return JSONResponse(status_code=400, content={"message": "Error deleting thread"})

    return JSONResponse(status_code=200, content={"message": "Thread deleted successfully"})
    

@forums_router.get("/mtd_threads/")
async def mtd_threads(
    lesson_id: int, 
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):
    """
    Obtiene todos los hilos de discusión de una lección específica
    
    Entry:
        lesson_id: int (ID de la lección)
        user_info: dict (obtenido de cookies JWT)
    
    Return:
        status_code: 200 o 404
        content: json con:
            - threads: lista de hilos
            - lesson_id: ID de la lección
            - user_id: ID del usuario
    
    Errors:
        404: No se encontraron hilos para esta lección
    """
    threads = get_threads_by_lesson_id(
        lesson_id=lesson_id,
        db=db
    )

    if not threads:
        return JSONResponse(status_code=404, content={})
    
    return JSONResponse(
        status_code=200,
        content={
            "threads": threads,
            "lesson_id": lesson_id,
            "user_id": user_info["user_id"]
        }
    )


@forums_router.post("/send_message/")
async def send_message(
    msg: Message,
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):
    """
    Envía un mensaje en un hilo de discusión específico
    
    Entry:
        msg: Message object con:
            - thread_id: int (ID del hilo)
            - message: str (Contenido del mensaje)
        user_info: dict (obtenido de cookies JWT)
    
    Return:
        status_code: 200 o 400
        content: json con:
            - message: str (confirmación)
            - thread_id: ID del hilo
            - user_id: ID del usuario
            - message: contenido del mensaje
    
    Errors:
        400: Faltan campos obligatorios (mensaje o thread_id)
    """
    message = msg.message
    thread_id = msg.thread_id   
    user_id = user_info["user_id"]

    if not message or not thread_id:
        return JSONResponse(status_code=400, content={"message": "Message and thread ID are required"})
    
    create_response = create_message(
        thread_id=thread_id,
        user_id=user_id,
        message=message,
        db=db
    )

    return JSONResponse(
        status_code=200, 
        content={
            "message": "Message sent", 
            "thread_id": thread_id, 
            "user_id": user_id, 
            "message": message
        }
    )


@forums_router.get("/messages_thread/")
async def messages_thread(
    thread_id: int, 
    user_info: dict = Depends(get_cookies),
    db: Session = Depends(get_db)
):
    """
    Obtiene todos los mensajes de un hilo de discusión específico
    
    Entry:
        thread_id: int (ID del hilo)
        user_info: dict (obtenido de cookies JWT)
    
    Return:
        status_code: 200 o 404
        content: json con:
            - messages: lista de mensajes
            - thread_id: ID del hilo
            - user_id: ID del usuario
    
    Errors:
        404: No se encontraron mensajes en el hilo
    """
    messages = get_messages_by_thread_id(
        thread_id=thread_id,
        db=db
    )

    if not messages:
        return JSONResponse(status_code=404, content={"message": []})

    return JSONResponse(
        status_code=200, 
        content={
            "messages": messages, 
            "thread_id": thread_id,
            "user_id": user_info["user_id"]
        }
    )
