from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class CourseDTO(BaseModel):
    id: str
    code: str
    title: str
    description: Optional[str] = None
    provider: str = "iGOT Karmayogi"
    competencyId: Optional[str] = None
    targetCompetencyName: Optional[str] = None
    durationHours: float
    level: str
    rating: float
    modulesCount: int = 5
    isIgotIntegrated: bool = True
    igotUrl: str = "https://igotkarmayogi.gov.in"
    thumbnailUrl: Optional[str] = None

class RecommendedCourseDTO(BaseModel):
    course: CourseDTO
    reason: str
    targetCompetency: str
    gapSeverity: str
    priority: str
    expectedImprovement: str

class LearningPathItemDTO(BaseModel):
    id: str
    course: CourseDTO
    order: int
    status: str
    reason: Optional[str] = None
    priority: str

class LearningPathDTO(BaseModel):
    id: str
    employeeId: str
    title: str
    status: str
    overallProgress: float
    items: List[LearningPathItemDTO]
