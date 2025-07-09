from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    name: Optional[str] = None
    email: str
    password: str
    is_sensei: Optional[bool] = False


class Message(BaseModel):
    thread_id: int
    user_id: int
    message: str


class Course(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    price: float
    hours: float 
    

class Lesson(BaseModel):
    section_id: int
    course_id: int
    title: str
    is_video: bool
