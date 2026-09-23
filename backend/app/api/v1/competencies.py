from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.employees import EmployeeCompetency, SkillGap, Employee
from app.models.organization import Competency, CompetencyDomain

router = APIRouter(prefix="/competencies", tags=["Competencies"])

@router.get("/employee/{employee_id}")
def get_employee_competencies(employee_id: str, db: Session = Depends(get_db)):
    """Fetch complete competency profile for an employee"""
    emp_comps = db.query(EmployeeCompetency).filter(
        EmployeeCompetency.employee_id == employee_id
    ).all()

    items = []
    for ec in emp_comps:
        comp = db.query(Competency).filter(Competency.id == ec.competency_id).first()
        domain = db.query(CompetencyDomain).filter(CompetencyDomain.id == comp.domain_id).first() if comp and comp.domain_id else None
        
        # Check skill gap for this competency
        gap = db.query(SkillGap).filter(
            SkillGap.employee_id == employee_id,
            SkillGap.competency_id == ec.competency_id
        ).first()

        items.append({
            "id": ec.competency_id,
            "name": comp.name if comp else "Statistical Analysis",
            "domain": domain.name if domain else "Official Statistics",
            "currentLevel": ec.current_level,
            "benchmarkLevel": comp.benchmark_level if comp else 4.0,
            "scorePercentage": ec.score_percentage,
            "proficiencyTier": ec.proficiency_tier,
            "gapScore": gap.gap_score if gap else 0.0,
            "severity": gap.severity if gap else "STRONG"
        })

    return items

@router.get("/gaps/{employee_id}")
def get_employee_skill_gaps(employee_id: str, db: Session = Depends(get_db)):
    """Fetch categorized skill gaps (Critical, Developing, Strong)"""
    gaps = db.query(SkillGap).filter(SkillGap.employee_id == employee_id).all()
    
    result = {
        "critical": [],
        "developing": [],
        "strong": []
    }

    for g in gaps:
        comp = db.query(Competency).filter(Competency.id == g.competency_id).first()
        item = {
            "competencyId": g.competency_id,
            "competencyName": comp.name if comp else "Domain Skill",
            "currentLevel": g.current_level,
            "requiredLevel": g.required_level,
            "gap": g.gap_score,
            "severity": g.severity
        }
        if g.severity == "CRITICAL":
            result["critical"].append(item)
        elif g.severity == "DEVELOPING":
            result["developing"].append(item)
        else:
            result["strong"].append(item)

    return result
