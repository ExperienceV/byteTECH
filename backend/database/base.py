from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

Base = declarative_base()


# ---------------------------------------------- Define Models ----------------------------------------------

# Panda
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True)
    password = Column(String)
    is_sensei = Column(Boolean, default=False)  

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    section_id = Column(Integer, index=True)
    title = Column(String)
    is_video = Column(Boolean)
    file_path = Column(String)

    threads = relationship("Thread", back_populates="lesson")

class Thread(Base):
    __tablename__ = "threads"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    user_id = Column(Integer)
    topic = Column(String)

    lesson = relationship("Lesson", back_populates="threads")
    messages = relationship("Message", back_populates="thread")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    thread_id = Column(Integer, ForeignKey("threads.id"))
    user_id = Column(Integer)
    message = Column(String)

    thread = relationship("Thread", back_populates="messages")

# ------------------------------

# Liba



# ------------------------------