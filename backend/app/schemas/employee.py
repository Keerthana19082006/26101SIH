from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CompetencyItem(BaseModel):
    id: str
    name: str
    currentLevel: float
    requiredLevel: float = 4.0
    gapScore: float
    severity: str
    proficiencyTier: str = "INTERMEDIATE"

class SkillGapItem(BaseModel):
    competencyId: str
    competencyName: str
    currentLevel: float
    requiredLevel: float
    gap: float
    severity: str
    isCritical: bool

class EmployeeProfileResponse(BaseModel):
    id: str
    employeeNumber: Optional[str] = None
    name: str
    avatarInitials: str = "EM"
    department: str
    departmentCode: Optional[str] = None
    ministry: Optional[str] = None
    station: str = "New Delhi"
    cadre: Optional[str] = None
    payLevel: Optional[str] = None
    currentRole: str
    targetRole: str
    igotId: Optional[str] = None
    badge: str = "DEMO / TEST ACCOUNT"
    overallCompetency: float = 65.0
    competencyGrowth: str = "+8% improvement"
    learningProgressPercent: float = 70.0
    futureRoleReadiness: float = 65.0
    learningStreakDays: int = 14
    totalLearningHours: float = 32.0
    prioritySkillGapsCount: int = 2
    criticalGapsCount: int = 1
    competencies: List[str] = []

    class Config:
        from_attributes = True

class DashboardSummaryResponse(BaseModel):
    employee: EmployeeProfileResponse
    competencyRadar: List[Dict[str, Any]]
    criticalGaps: List[SkillGapItem]
    nextBestAction: Dict[str, Any]
    weeklyActivity: List[Dict[str, Any]]
    enrolledCourses: List[Dict[str, Any]]
