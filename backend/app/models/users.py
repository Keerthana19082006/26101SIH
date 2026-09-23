from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, Enum
import enum
from app.core.database import Base

class UserRole(str, enum.Enum):
    EMPLOYEE = "EMPLOYEE"
    TRAINER = "TRAINER"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default=UserRole.EMPLOYEE.value, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), nullable=True)
    action = Column(String(100), nullable=False)
    ip_address = Column(String(50), default="127.0.0.1")
    status = Column(String(20), default="SUCCESS")
    details_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
