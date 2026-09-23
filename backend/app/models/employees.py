from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    employee_number = Column(String(50), unique=True, index=True)
    name = Column(String(150), nullable=False)
    avatar_initials = Column(String(10), default="EM")
    department_id = Column(String(50), ForeignKey("departments.id"), nullable=True)
    current_role_id = Column(String(50), ForeignKey("roles.id"), nullable=True)
    target_role_id = Column(String(50), ForeignKey("roles.id"), nullable=True)
    igot_id = Column(String(50), nullable=True)
    badge = Column(String(100), default="DEMO / TEST ACCOUNT")
    is_demo = Column(Boolean, default=True)
    station = Column(String(150), default="New Delhi")
    cadre = Column(String(150), nullable=True)
    pay_level = Column(String(50), nullable=True)
    joining_date = Column(String(50), default="12 August 2021")
    
    # Aggregated metrics for fast lookup
    overall_competency = Column(Float, default=65.0)
    competency_growth = Column(String(50), default="+8% improvement")
    learning_progress_percent = Column(Float, default=70.0)
    future_role_readiness = Column(Float, default=65.0)
    learning_streak_days = Column(Integer, default=14)
    total_learning_hours = Column(Float, default=32.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    department = relationship("Department")
    current_role = relationship("Role", foreign_keys=[current_role_id])
    target_role = relationship("Role", foreign_keys=[target_role_id])
    competencies = relationship("EmployeeCompetency", back_populates="employee")
    skill_gaps = relationship("SkillGap", back_populates="employee")

class EmployeeCompetency(Base):
    __tablename__ = "employee_competencies"

    id = Column(String(50), primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("employees.id"), nullable=False)
    competency_id = Column(String(50), ForeignKey("competencies.id"), nullable=False)
    current_level = Column(Float, default=2.5)  # 1.0 to 5.0
    score_percentage = Column(Float, default=50.0)
    proficiency_tier = Column(String(50), default="INTERMEDIATE")  # NOVICE, BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    last_assessed_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="competencies")
    competency = relationship("Competency")

class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(String(50), primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("employees.id"), nullable=False)
    competency_id = Column(String(50), ForeignKey("competencies.id"), nullable=False)
    current_level = Column(Float, default=2.0)
    required_level = Column(Float, default=4.0)
    gap_score = Column(Float, default=2.0)
    severity = Column(String(50), default="CRITICAL")  # CRITICAL, DEVELOPING, STRONG
    is_critical = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="skill_gaps")
    competency = relationship("Competency")

class DigitalPassport(Base):
    __tablename__ = "digital_passports"

    id = Column(String(50), primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("employees.id"), unique=True, nullable=False)
    passport_number = Column(String(100), unique=True, nullable=False)
    verification_hash = Column(String(255), nullable=False)
    qr_code_data = Column(Text, nullable=True)
    issued_date = Column(String(50), default="2026-01-15")
    last_verified_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="ACTIVE_VERIFIED")
