from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(String(50), primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=True)
    ministry = Column(String(150), nullable=False)
    station = Column(String(150), default="New Delhi")
    created_at = Column(DateTime, default=datetime.utcnow)

    roles = relationship("Role", back_populates="department")
    domains = relationship("CompetencyDomain", back_populates="department")

class Role(Base):
    __tablename__ = "roles"

    id = Column(String(50), primary_key=True, index=True)
    department_id = Column(String(50), ForeignKey("departments.id"), nullable=False)
    title = Column(String(150), nullable=False)
    cadre = Column(String(150), nullable=True)
    pay_level = Column(String(50), nullable=True)
    is_target_role = Column(String(10), default="false")
    benchmark_overall = Column(Float, default=70.0)

    department = relationship("Department", back_populates="roles")
    role_competencies = relationship("RoleCompetency", back_populates="role")

class CompetencyDomain(Base):
    __tablename__ = "competency_domains"

    id = Column(String(50), primary_key=True, index=True)
    department_id = Column(String(50), ForeignKey("departments.id"), nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)

    department = relationship("Department", back_populates="domains")
    competencies = relationship("Competency", back_populates="domain")

class Competency(Base):
    __tablename__ = "competencies"

    id = Column(String(50), primary_key=True, index=True)
    domain_id = Column(String(50), ForeignKey("competency_domains.id"), nullable=True)
    code = Column(String(50), nullable=True)
    name = Column(String(150), nullable=False, index=True)
    description = Column(Text, nullable=True)
    benchmark_level = Column(Float, default=4.0)  # On scale of 1.0 to 5.0

    domain = relationship("CompetencyDomain", back_populates="competencies")
    role_mappings = relationship("RoleCompetency", back_populates="competency")

class RoleCompetency(Base):
    __tablename__ = "role_competencies"

    id = Column(String(50), primary_key=True, index=True)
    role_id = Column(String(50), ForeignKey("roles.id"), nullable=False)
    competency_id = Column(String(50), ForeignKey("competencies.id"), nullable=False)
    required_level = Column(Float, default=4.0)
    priority_weight = Column(Float, default=1.0)

    role = relationship("Role", back_populates="role_competencies")
    competency = relationship("Competency", back_populates="role_mappings")
