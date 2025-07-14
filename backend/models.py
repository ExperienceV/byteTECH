from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    name: Optional[str] = None
    email: str
    password: str

class Thread(BaseModel):
    lesson_id: int
    topic: str

class Message(BaseModel):
    thread_id: int
    message: str


class Course(BaseModel):
    course_id: Optional[int]
    name: Optional[str]
    description: Optional[str]
    price: Optional[float]
    hours: Optional[float] 
    

class Lesson(BaseModel):
    section_id: int
    course_id: int
    title: str
    is_video: bool
