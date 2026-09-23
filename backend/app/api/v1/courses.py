from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.learning import Course, CourseEnrollment
from app.schemas.learning import CourseDTO

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("")
def get_courses(
    search: Optional[str] = Query(None),
    competency: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Course)
    if search:
        query = query.filter(Course.title.ilike(f"%{search}%") | Course.description.ilike(f"%{search}%"))
    if competency:
        query = query.filter(Course.target_competency_name.ilike(f"%{competency}%"))
    if level and level != "all":
        query = query.filter(Course.level.ilike(f"%{level}%"))

    courses = query.all()
    return [
        {
            "id": c.id,
            "code": c.code,
            "title": c.title,
            "description": c.description,
            "provider": c.provider,
            "targetCompetency": c.target_competency_name,
            "durationHours": c.duration_hours,
            "level": c.level,
            "rating": c.rating,
            "modulesCount": c.modules_count,
            "isIgotIntegrated": c.is_igot_integrated,
            "igotUrl": c.igot_url,
            "thumbnailUrl": c.thumbnail_url
        }
        for c in courses
    ]

@router.get("/{id}")
def get_course_by_id(id: str, db: Session = Depends(get_db)):
    c = db.query(Course).filter(Course.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")
    return {
        "id": c.id,
        "code": c.code,
        "title": c.title,
        "description": c.description,
        "provider": c.provider,
        "targetCompetency": c.target_competency_name,
        "durationHours": c.duration_hours,
        "level": c.level,
        "rating": c.rating,
        "modulesCount": c.modules_count,
        "isIgotIntegrated": c.is_igot_integrated,
        "igotUrl": c.igot_url
    }

@router.post("/{id}/enroll")
def enroll_in_course(id: str, employee_id: str = Query(...), db: Session = Depends(get_db)):
    existing = db.query(CourseEnrollment).filter(
        CourseEnrollment.course_id == id,
        CourseEnrollment.employee_id == employee_id
    ).first()

    if not existing:
        import uuid
        existing = CourseEnrollment(
            id=f"enr-{uuid.uuid4().hex[:10]}",
            employee_id=employee_id,
            course_id=id,
            status="IN_PROGRESS",
            progress_percent=10.0
        )
        db.add(existing)
        db.commit()

    return {"enrolled": True, "enrollmentId": existing.id, "status": existing.status}
