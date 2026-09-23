from datetime import datetime, date
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from app.core.database import Base

class VirtualLab(Base):
    __tablename__ = "virtual_labs"

    id = Column(String(50), primary_key=True, index=True)
    department_id = Column(String(50), ForeignKey("departments.id"), nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(String(50), default="Intermediate")
    estimated_minutes = Column(Integer, default=30)
    competency_id = Column(String(50), ForeignKey("competencies.id"), nullable=True)
    target_competency_name = Column(String(150), nullable=True)
    scenario_type = Column(String(50), default="SURVEY_SAMPLING")
    scenario_data_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class LabAttempt(Base):
    __tablename__ = "lab_attempts"

    id = Column(String(50), primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("employees.id"), nullable=False)
    lab_id = Column(String(50), ForeignKey("virtual_labs.id"), nullable=False)
    score = Column(Float, default=0.0)
    passed = Column(Boolean, default=True)
    submission_data_json = Column(Text, nullable=True)
    competency_evidence_recorded = Column(Boolean, default=True)
    completed_at = Column(DateTime, default=datetime.utcnow)

    lab = relationship("VirtualLab")

class LearningActivity(Base):
    __tablename__ = "learning_activities"

    id = Column(String(50), primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("employees.id"), nullable=False)
    activity_type = Column(String(50), nullable=False)  # ASSESSMENT_COMPLETED, LAB_COMPLETED, COURSE_COMPLETED, STREAK_MILESTONE
    title = Column(String(200), nullable=False)
    description = Column(String(255), nullable=True)
    points_awarded = Column(Integer, default=10)
    activity_date = Column(Date, default=date.today)
    created_at = Column(DateTime, default=datetime.utcnow)

class LearningStreak(Base):
    __tablename__ = "learning_streaks"

    id = Column(String(50), primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("employees.id"), unique=True, nullable=False)
    current_streak = Column(Integer, default=1)
    longest_streak = Column(Integer, default=1)
    total_active_days = Column(Integer, default=1)
    last_activity_date = Column(Date, default=date.today)
    updated_at = Column(DateTime, default=datetime.utcnow)

class LeaderboardEntry(Base):
    __tablename__ = "leaderboard_entries"

    id = Column(String(50), primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("employees.id"), unique=True, nullable=False)
    employee_name = Column(String(150), nullable=False)
    department_name = Column(String(150), nullable=False)
    designation = Column(String(150), nullable=True)
    total_points = Column(Integer, default=500)
    rank = Column(Integer, default=1)
    badges_count = Column(Integer, default=3)
    assessments_completed = Column(Integer, default=1)
    labs_completed = Column(Integer, default=1)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String(50), primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("employees.id"), nullable=False)
    title = Column(String(150), nullable=False)
    category = Column(String(50), default="Competency")
    description = Column(String(255), nullable=True)
    icon_name = Column(String(50), default="Award")
    unlocked_at = Column(DateTime, default=datetime.utcnow)
