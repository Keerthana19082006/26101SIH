from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.employees import Employee, EmployeeCompetency, SkillGap
from app.models.organization import Department, Competency
from app.schemas.employee import EmployeeProfileResponse, DashboardSummaryResponse

router = APIRouter(prefix="/employees", tags=["Employees"])

def map_employee_dto(emp: Employee, db: Session) -> Dict[str, Any]:
    dept = db.query(Department).filter(Department.id == emp.department_id).first() if emp.department_id else None
    
    # Competency names focus
    comp_names = []
    emp_comps = db.query(EmployeeCompetency).filter(EmployeeCompetency.employee_id == emp.id).all()
    for ec in emp_comps:
        comp = db.query(Competency).filter(Competency.id == ec.competency_id).first()
        if comp:
            comp_names.append(comp.name)
            
    if not comp_names:
        comp_names = ["Survey Sampling", "Statistical Methods", "Data Analysis", "Survey Operations"]

    return {
        "id": emp.id,
        "employeeNumber": emp.employee_number,
        "name": emp.name,
        "avatarInitials": emp.avatar_initials,
        "department": dept.name if dept else "MoSPI / National Statistical Office",
        "departmentCode": dept.code if dept else "MoSPI-NSO",
        "ministry": dept.ministry if dept else "Ministry of Statistics & Programme Implementation",
        "station": emp.station,
        "cadre": emp.cadre,
        "payLevel": emp.pay_level,
        "currentRole": emp.current_role.title if emp.current_role else "Statistical Investigator",
        "targetRole": emp.target_role.title if emp.target_role else "Senior Statistical Officer",
        "igotId": emp.igot_id,
        "badge": emp.badge,
        "overallCompetency": emp.overall_competency,
        "competencyGrowth": emp.competencyGrowth if hasattr(emp, "competencyGrowth") else "+8% improvement",
        "learningProgressPercent": emp.learning_progress_percent,
        "futureRoleReadiness": emp.future_role_readiness,
        "learningStreakDays": emp.learning_streak_days,
        "totalLearningHours": emp.total_learning_hours,
        "prioritySkillGapsCount": emp.priority_skill_gaps_count if hasattr(emp, "priority_skill_gaps_count") else 2,
        "criticalGapsCount": emp.critical_gaps_count if hasattr(emp, "critical_gaps_count") else 1,
        "competencies": comp_names
    }

@router.get("/demo", response_model=List[Dict[str, Any]])
def get_demo_employees(db: Session = Depends(get_db)):
    """Fetch 5 seeded demo employee accounts"""
    employees = db.query(Employee).filter(Employee.is_demo == True).all()
    return [map_employee_dto(e, db) for e in employees]

@router.get("/{id}")
def get_employee_by_id(id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == id).first()
    if not emp:
        # Fallback to first demo employee
        emp = db.query(Employee).filter(Employee.id == "demo-employee-01").first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return map_employee_dto(emp, db)

@router.get("/{id}/dashboard")
def get_employee_dashboard(id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == id).first()
    if not emp:
        emp = db.query(Employee).filter(Employee.id == "demo-employee-01").first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    profile_dto = map_employee_dto(emp, db)

    # Competency radar data
    emp_comps = db.query(EmployeeCompetency).filter(EmployeeCompetency.employee_id == emp.id).all()
    radar = []
    for ec in emp_comps:
        comp = db.query(Competency).filter(Competency.id == ec.competency_id).first()
        radar.append({
            "subject": comp.name if comp else "Skill",
            "current": ec.score_percentage,
            "benchmark": 80,
            "fullMark": 100
        })

    if not radar:
        radar = [
            {"subject": "Survey Sampling", "current": 65, "benchmark": 80, "fullMark": 100},
            {"subject": "Statistical Quality", "current": 70, "benchmark": 80, "fullMark": 100},
            {"subject": "Data Validation", "current": 60, "benchmark": 80, "fullMark": 100},
            {"subject": "Survey Operations", "current": 75, "benchmark": 80, "fullMark": 100},
            {"subject": "Official Dissemination", "current": 55, "benchmark": 80, "fullMark": 100},
        ]

    # Critical skill gaps
    gaps = db.query(SkillGap).filter(
        SkillGap.employee_id == emp.id,
        SkillGap.severity == "CRITICAL"
    ).all()
    critical_gaps = []
    for g in gaps:
        comp = db.query(Competency).filter(Competency.id == g.competency_id).first()
        critical_gaps.append({
            "competencyId": g.competency_id,
            "competencyName": comp.name if comp else "Domain Knowledge",
            "currentLevel": g.current_level,
            "requiredLevel": g.required_level,
            "gap": g.gap_score,
            "severity": g.severity,
            "isCritical": True
        })

    next_best_action = {
        "title": "Complete NSS 78th Round Operational Training",
        "description": "Recommended by AI to remediate Survey Sampling critical gap before next quarter survey rollout.",
        "actionUrl": "/explore-learning",
        "actionLabel": "Resume Course"
    }

    weekly_activity = [
        {"day": "Mon", "hours": 1.5, "completed": True},
        {"day": "Tue", "hours": 2.0, "completed": True},
        {"day": "Wed", "hours": 1.0, "completed": True},
        {"day": "Thu", "hours": 2.5, "completed": True},
        {"day": "Fri", "hours": 1.5, "completed": True},
        {"day": "Sat", "hours": 0.5, "completed": False},
        {"day": "Sun", "hours": 0.0, "completed": False},
    ]

    return {
        "employee": profile_dto,
        "competencyRadar": radar,
        "criticalGaps": critical_gaps,
        "nextBestAction": next_best_action,
        "weeklyActivity": weekly_activity,
        "learningStreak": emp.learning_streak_days,
        "futureRoleReadiness": emp.future_role_readiness
    }
