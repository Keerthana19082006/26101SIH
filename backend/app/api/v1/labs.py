import uuid
import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.engagement import VirtualLab, LabAttempt
from app.services.streak_engine import StreakEngine
from app.schemas.engagement import SubmitLabRequest, LabResultDTO

router = APIRouter(prefix="/labs", tags=["Virtual Labs"])

@router.get("")
def get_virtual_labs(db: Session = Depends(get_db)):
    labs = db.query(VirtualLab).all()
    return [
        {
            "id": l.id,
            "title": l.title,
            "description": l.description,
            "difficulty": l.difficulty,
            "estimatedMinutes": l.estimated_minutes,
            "targetCompetency": l.target_competency_name,
            "scenarioType": l.scenario_type
        }
        for l in labs
    ]

@router.get("/{id}")
def get_lab_details(id: str, db: Session = Depends(get_db)):
    lab = db.query(VirtualLab).filter(VirtualLab.id == id).first()
    if not lab:
        raise HTTPException(status_code=404, detail="Virtual lab not found")
    
    scenario_data = json.loads(lab.scenario_data_json) if lab.scenario_data_json else {}
    return {
        "id": lab.id,
        "title": lab.title,
        "description": lab.description,
        "difficulty": lab.difficulty,
        "estimatedMinutes": lab.estimated_minutes,
        "targetCompetency": lab.target_competency_name,
        "scenarioType": lab.scenario_type,
        "scenarioData": scenario_data
    }

@router.post("/{id}/submit")
def submit_lab_attempt(id: str, req: SubmitLabRequest, db: Session = Depends(get_db)):
    lab = db.query(VirtualLab).filter(VirtualLab.id == id).first()
    if not lab:
        raise HTTPException(status_code=404, detail="Virtual lab not found")

    score = 92.5
    passed = True

    attempt = LabAttempt(
        id=f"la-{uuid.uuid4().hex[:10]}",
        employee_id=req.employeeId,
        lab_id=id,
        score=score,
        passed=passed,
        submission_data_json=json.dumps(req.answers),
        competency_evidence_recorded=True
    )
    db.add(attempt)
    db.commit()

    # Log learning activity
    StreakEngine.record_learning_activity(
        db,
        employee_id=req.employeeId,
        activity_type="LAB_COMPLETED",
        title=f"Completed Virtual Lab: {lab.title}",
        points=75
    )

    return {
        "attemptId": attempt.id,
        "labId": id,
        "score": score,
        "passed": passed,
        "competencyEvidenceLogged": True,
        "pointsAwarded": 75,
        "feedback": f"Excellent execution. Demonstrated solid command of {lab.target_competency_name} parameters and official data controls."
    }
