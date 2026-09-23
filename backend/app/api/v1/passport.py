from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.passport_engine import PassportEngine

router = APIRouter(prefix="/passport", tags=["Digital Passport"])

@router.get("/{employee_id}")
def get_digital_passport(employee_id: str, db: Session = Depends(get_db)):
    """Generates real-time authoritative digital competency passport"""
    return PassportEngine.get_or_create_passport(db, employee_id)
