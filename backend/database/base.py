from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy import UniqueConstraint

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
    section_id = Column(Integer, ForeignKey("sections.id", ondelete="CASCADE"))
    title = Column(String)
    is_video = Column(Boolean)
    file_path = Column(String)

    section = relationship("Section", back_populates="lessons")
    threads = relationship("Thread", back_populates="lesson", cascade="all, delete")

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
class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sensei_id = Column(Integer)  # ID del usuario que subió el curso
    name = Column(String)
    description = Column(String)
    section_count = Column(Integer)  # ✅ Evita conflicto con relación
    hours = Column(float)
    miniature_path = Column(String)
    video_path = Column(String)
    price = Column(float)

    # Relaciones
    sections = relationship("Section", back_populates="course", cascade="all, delete")
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete")
    uploaded_by = relationship("UploadedCourse", backref="course", cascade="all, delete")
    purchased_by = relationship("Purchase", backref="course", cascade="all, delete")


class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))

    course = relationship("Course", back_populates="sections")
    lessons = relationship("Lesson", back_populates="section", cascade="all, delete")


class Purchase(Base):
    __tablename__ = "my_byd_courses"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))


class UploadedCourse(Base):
    __tablename__ = "my_upldd_courses"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))
    uploaded_at = Column(datetime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint('user_id', 'course_id'),)
# ------------------------------