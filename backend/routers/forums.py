from fastapi import APIRouter, Depends
from dependencies import get_cookies
from fastapi.responses import JSONResponse
from database.queries.threads import get_threads_by_lesson_id, create_thread, delete_thread_by_id
from database.queries.messages import create_message, get_messages_by_thread_id
from database.config import SessionLocal
from models import Message

forums_router = APIRouter(tags=["Forums"], prefix="/forums")


@forums_router.post("/create_thread/")
async def create_new_thread(
    lesson_id: int, 
    topic: str, 
    user_info: dict = Depends(get_cookies)
    ):

    """ Endpoint to create a new thread in a forum. """
    new_thread = create_thread(
        db=SessionLocal(),
        lesson_id=lesson_id,
        user_id=user_info["user_id"],
        topic=topic
    )

    if not new_thread:
        return JSONResponse(status_code=400, content={"message": "Error creating thread"})

    return JSONResponse(status_code=201, content={"message": "Thread created successfully", "thread": new_thread})


@forums_router.delete("/delete_thread/")
async def delete_thread(
    thread_id: int, 
    user_info: dict = Depends(get_cookies)
    ):

    """ Endpoint to delete a thread by its ID. """
    deleted = delete_thread_by_id(
        db=SessionLocal(),
        thread_id=thread_id,
        user_id=user_info["user_id"]
    )

    if not deleted:
        return JSONResponse(status_code=400, content={"message": "Error deleting thread"})

    return JSONResponse(status_code=200, content={"message": "Thread deleted successfully"})
    

@forums_router.get("/mtd_threads/")
async def mtd_threads(
    lesson_id: int, 
    user_info: dict = Depends(get_cookies)
    ):

    """ Endpoint to get threads of a forum by lesson ID. """
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

    """ Endpoint to send a message in a specific thread. """
    message = msg.message
    thread_id = msg.thread_id   
    user_id = user_info["user_id"]

    if not message or not thread_id:
        return JSONResponse(status_code=400, content={"message": "Message and thread ID are required"})
    
    create_message(
        db=SessionLocal(),
        thread_id=thread_id,
        user_id=user_id,
        message=message
    )

    return JSONResponse(status_code=200, content={"message": "Message sent", "thread_id": thread_id, "user_id": user_info["user_id"], "message": message})


@forums_router.get("/messages_thread/")
async def messages_thread(
    thread_id: int, 
    user_info: dict = Depends(get_cookies)
    ):

    """ Endpoint to get the content of a specific thread by its ID. """
    messages = get_messages_by_thread_id(
        db=SessionLocal(),
        thread_id=thread_id
    )
    if not messages:
        return JSONResponse(status_code=404, content={"message": "Thread not found"})

    return JSONResponse(status_code=200, content={
        "messages": messages, 
        "thread_id": thread_id,
        "user_id": user_info["user_id"]}
        )
    

    

    