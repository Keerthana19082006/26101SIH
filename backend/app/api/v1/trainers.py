from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.employees import Employee, SkillGap
from app.models.organization import Department

router = APIRouter(prefix="/trainers", tags=["Trainer Portal"])

@router.get("/trainees")
def get_trainees_overview(db: Session = Depends(get_db)):
    """Fetch cohort analytics and employee skill gaps for trainer view"""
    employees = db.query(Employee).all()
    result = []
    for emp in employees:
        dept = db.query(Department).filter(Department.id == emp.department_id).first() if emp.department_id else None
        critical_count = db.query(SkillGap).filter(
            SkillGap.employee_id == emp.id,
            SkillGap.severity == "CRITICAL"
        ).count()

        result.append({
            "id": emp.id,
            "name": emp.name,
            "department": dept.name if dept else "National Statistical Office",
            "currentRole": emp.current_role.title if emp.current_role else "Statistical Officer",
            "overallCompetency": emp.overall_competency,
            "criticalGapsCount": critical_count,
            "futureRoleReadiness": emp.future_role_readiness,
            "learningProgress": emp.learning_progress_percent
        })
    return result
