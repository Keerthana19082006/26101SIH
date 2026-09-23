from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.recommendation_engine import RecommendationEngine

router = APIRouter(prefix="/future-roles", tags=["Future Role Readiness"])

class SimulateWhatIfRequest(BaseModel):
    currentReadiness: float
    competencyName: str
    currentLevel: float
    targetLevel: float

@router.post("/simulate")
def simulate_career_readiness(req: SimulateWhatIfRequest):
    """What-If career readiness simulator without modifying actual employee record"""
    return RecommendationEngine.simulate_what_if(
        current_readiness=req.currentReadiness,
        competency_name=req.competencyName,
        current_level=req.currentLevel,
        target_level=req.targetLevel
    )
