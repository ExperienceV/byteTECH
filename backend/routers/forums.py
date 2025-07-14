from fastapi import APIRouter, Depends
from dependencies import get_cookies
from fastapi.responses import JSONResponse
from database.queries.threads import get_threads_by_lesson_id, create_thread, delete_thread_by_id
from database.queries.messages import create_message, get_messages_by_thread_id
from database.config import SessionLocal
from models import Message, Thread

forums_router = APIRouter(tags=["forums"], prefix="/forums")


@forums_router.post("/create_thread/")
async def create_new_thread(
    thread: Thread,
    user_info: dict = Depends(get_cookies)
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
        db=SessionLocal(),
        lesson_id=thread.lesson_id,
        user_id=user_info["user_id"],
        topic=thread.topic
    )

    if not new_thread_response:
        return JSONResponse(status_code=400, content={"message": "Error creating thread"})
    
    new_thread = {
        "id" : new_thread_response.id,
        "title" : new_thread_response.topic,
    }

    return JSONResponse(status_code=201, content={"message": "Thread created successfully", "thread": new_thread})


@forums_router.delete("/delete_thread/")
async def delete_thread(
    thread_id: int, 
    user_info: dict = Depends(get_cookies)
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
        db=SessionLocal(),
        thread_id=thread_id
    )

    if not deleted:
        return JSONResponse(status_code=400, content={"message": "Error deleting thread"})

    return JSONResponse(status_code=200, content={"message": "Thread deleted successfully"})
    

@forums_router.get("/mtd_threads/")
async def mtd_threads(
    lesson_id: int, 
    user_info: dict = Depends(get_cookies)
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
        db=SessionLocal(),
        lesson_id=lesson_id
    )

    if not threads:
        return JSONResponse(status_code=404, content={"message": "No threads found for this lesson"})
    
    return JSONResponse(status_code=200, content={
        "threads": threads, 
        "lesson_id": lesson_id,
        "user_id": user_info["user_id"]}
    )


@forums_router.post("/send_message/")
async def send_message(
    msg: Message,
    user_info: dict = Depends(get_cookies)
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
        db=SessionLocal(),
        thread_id=thread_id,
        user_id=user_id,
        message=message
    )

    new_message = {
        "id" : create_response.id,
        "name" : user_info["user_name"],
        "message" : create_response.message,
    }

    return JSONResponse(
        status_code=200, 
        content={
            "message": "Message sent", 
            "thread_id": thread_id, 
            "user_id": user_info["user_id"], 
            "message": message
        }
    )


@forums_router.get("/messages_thread/")
async def messages_thread(
    thread_id: int, 
    user_info: dict = Depends(get_cookies)
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
        db=SessionLocal(),
        thread_id=thread_id
    )
    if not messages:
        return JSONResponse(status_code=404, content={"message": "Not messages"})

    return JSONResponse(
        status_code=200, 
        content={
            "messages": messages, 
            "thread_id": thread_id,
            "user_id": user_info["user_id"]
        }
    )
    
