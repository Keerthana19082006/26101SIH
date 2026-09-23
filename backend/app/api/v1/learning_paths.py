from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.recommendation_engine import RecommendationEngine

router = APIRouter(prefix="/learning-paths", tags=["Learning Paths & Recommendations"])

@router.get("/recommendations/{employee_id}")
def get_personalized_recommendations(employee_id: str, db: Session = Depends(get_db)):
    """Closed loop: Returns courses tailored to remediate employee's specific skill gaps"""
    return RecommendationEngine.get_recommendations(db, employee_id)

@router.get("/employee/{employee_id}")
def get_employee_learning_path(employee_id: str, db: Session = Depends(get_db)):
    """Returns or regenerates dynamic learning path"""
    return RecommendationEngine.refresh_learning_path(db, employee_id)

@router.post("/employee/{employee_id}/refresh")
def force_refresh_learning_path(employee_id: str, db: Session = Depends(get_db)):
    return RecommendationEngine.refresh_learning_path(db, employee_id)
