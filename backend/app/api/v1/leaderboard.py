from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.engagement import LeaderboardEntry

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("")
def get_leaderboard(
    department: Optional[str] = Query(None),
    limit: int = Query(10),
    db: Session = Depends(get_db)
):
    query = db.query(LeaderboardEntry)
    if department and department != "all":
        query = query.filter(LeaderboardEntry.department_name.ilike(f"%{department}%"))
    
    entries = query.order_by(LeaderboardEntry.total_points.desc()).limit(limit).all()

    return [
        {
            "rank": idx + 1,
            "employeeId": e.employee_id,
            "name": e.employee_name,
            "department": e.department_name,
            "designation": e.designation or "Statistical Officer",
            "points": e.total_points,
            "badgesCount": e.badges_count,
            "assessmentsCompleted": e.assessments_completed,
            "labsCompleted": e.labs_completed
        }
        for idx, e in enumerate(entries)
    ]
