from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.streak_engine import StreakEngine

router = APIRouter(prefix="/streak", tags=["Learning Streak"])

@router.get("/{employee_id}")
def get_streak_metrics(employee_id: str, db: Session = Depends(get_db)):
    """Fetch daily learning streak metrics and milestone progression"""
    return StreakEngine.get_streak(db, employee_id)
