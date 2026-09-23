from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(String(50), primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    provider = Column(String(100), default="iGOT Karmayogi")
    competency_id = Column(String(50), ForeignKey("competencies.id"), nullable=True)
    target_competency_name = Column(String(150), nullable=True)
    duration_hours = Column(Float, default=4.5)
    level = Column(String(50), default="Intermediate")
    rating = Column(Float, default=4.8)
    modules_count = Column(Integer, default=5)
    is_igot_integrated = Column(Boolean, default=True)
    igot_url = Column(String(255), default="https://igotkarmayogi.gov.in")
    thumbnail_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    competency = relationship("Competency")

class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"

    id = Column(String(50), primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("employees.id"), nullable=False)
    course_id = Column(String(50), ForeignKey("courses.id"), nullable=False)
    status = Column(String(30), default="IN_PROGRESS")  # NOT_STARTED, IN_PROGRESS, COMPLETED
    progress_percent = Column(Float, default=0.0)
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    course = relationship("Course")

class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(String(50), primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("employees.id"), nullable=False)
    title = Column(String(200), default="Personalized Capacity Building Path")
    status = Column(String(30), default="ACTIVE")
    overall_progress = Column(Float, default=0.0)
    generated_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("LearningPathItem", back_populates="learning_path", cascade="all, delete-orphan")

class LearningPathItem(Base):
    __tablename__ = "learning_path_items"

    id = Column(String(50), primary_key=True, index=True)
    learning_path_id = Column(String(50), ForeignKey("learning_paths.id"), nullable=False)
    course_id = Column(String(50), ForeignKey("courses.id"), nullable=False)
    sequence_order = Column(Integer, default=1)
    status = Column(String(30), default="PENDING")  # PENDING, IN_PROGRESS, COMPLETED
    reason = Column(String(255), nullable=True)
    priority = Column(String(20), default="HIGH")

    learning_path = relationship("LearningPath", back_populates="items")
    course = relationship("Course")
