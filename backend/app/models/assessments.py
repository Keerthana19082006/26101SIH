from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(String(50), primary_key=True, index=True)
    role_id = Column(String(50), ForeignKey("roles.id"), nullable=True)
    competency_id = Column(String(50), ForeignKey("competencies.id"), nullable=False)
    competency_name = Column(String(150), nullable=True)
    question_text = Column(Text, nullable=False)
    difficulty = Column(String(20), default="MEDIUM")  # EASY, MEDIUM, HARD
    status = Column(String(30), default="APPROVED")   # DRAFT, REVIEW_REQUIRED, APPROVED, REJECTED, PUBLISHED
    explanation = Column(Text, nullable=True)
    source_document_id = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan")

class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(String(50), primary_key=True, index=True)
    question_id = Column(String(50), ForeignKey("questions.id"), nullable=False)
    option_key = Column(String(10), nullable=False)  # A, B, C, D
    text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)

    question = relationship("Question", back_populates="options")

class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(String(50), primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("employees.id"), nullable=False, index=True)
    attempt_type = Column(String(50), default="INITIAL_DIAGNOSTIC")  # INITIAL_DIAGNOSTIC, PERIODIC, POST_MODULE
    attempt_index = Column(Integer, default=1)
    status = Column(String(30), default="IN_PROGRESS")  # IN_PROGRESS, COMPLETED, ABANDONED
    total_questions = Column(Integer, default=10)
    answered_count = Column(Integer, default=0)
    score_percentage = Column(Float, default=0.0)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    responses = relationship("AssessmentResponse", back_populates="attempt", cascade="all, delete-orphan")

class AssessmentResponse(Base):
    __tablename__ = "assessment_responses"

    id = Column(String(50), primary_key=True, index=True)
    attempt_id = Column(String(50), ForeignKey("assessment_attempts.id"), nullable=False)
    question_id = Column(String(50), ForeignKey("questions.id"), nullable=False)
    selected_option_id = Column(String(50), nullable=True)
    is_correct = Column(Boolean, default=False)
    difficulty_encountered = Column(String(20), default="MEDIUM")
    response_time_seconds = Column(Integer, default=0)
    answered_at = Column(DateTime, default=datetime.utcnow)

    attempt = relationship("AssessmentAttempt", back_populates="responses")
