from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy import UniqueConstraint

Base = declarative_base()


# ---------------------------------------------- PostgeSQL Models ----------------------------------------------
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True)
    password = Column(String)
    is_sensei = Column(Boolean, default=False)

    purchases = relationship("Purchase", back_populates="user", cascade="all, delete")
    uploads = relationship("UploadedCourse", back_populates="user", cascade="all, delete")


class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sensei_id = Column(Integer)
    name = Column(String)
    description = Column(String)
    hours = Column(Float)
    miniature_id = Column(String)
    video_id = Column(String)
    price = Column(Float)

    sections = relationship("Section", back_populates="course", cascade="all, delete")
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete")
    uploaded_by = relationship("UploadedCourse", back_populates="course", cascade="all, delete")
    purchased_by = relationship("Purchase", back_populates="course", cascade="all, delete")


class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))

    course = relationship("Course", back_populates="sections")
    lessons = relationship("Lesson", back_populates="section", cascade="all, delete")


class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    section_id = Column(Integer, ForeignKey("sections.id", ondelete="CASCADE"))
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))
    title = Column(String)
    file_id = Column(String)

    section = relationship("Section", back_populates="lessons")
    course = relationship("Course", back_populates="lessons")
    threads = relationship("Thread", back_populates="lesson", cascade="all, delete")


class Thread(Base):
    __tablename__ = "threads"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"))
    user_id = Column(Integer)
    topic = Column(String)

    lesson = relationship("Lesson", back_populates="threads")
    messages = relationship("Message", back_populates="thread", cascade="all, delete")


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    thread_id = Column(Integer, ForeignKey("threads.id", ondelete="CASCADE"))
    user_id = Column(Integer)
    message = Column(String)

    thread = relationship("Thread", back_populates="messages")


class Purchase(Base):
    __tablename__ = "my_byd_courses"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))

    user = relationship("User", back_populates="purchases")
    course = relationship("Course", back_populates="purchased_by")


class UploadedCourse(Base):
    __tablename__ = "my_upldd_courses"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))

    user = relationship("User", back_populates="uploads")
    course = relationship("Course", back_populates="uploaded_by")

    __table_args__ = (UniqueConstraint('user_id', 'course_id'),)
# ------------------------------
