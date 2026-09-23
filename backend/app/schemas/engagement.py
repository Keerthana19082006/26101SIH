from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class VirtualLabDTO(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    estimatedMinutes: int
    targetCompetencyName: str
    scenarioType: str

class SubmitLabRequest(BaseModel):
    employeeId: str
    answers: Dict[str, Any]
    telemetry: Optional[Dict[str, Any]] = None

class LabResultDTO(BaseModel):
    attemptId: str
    labId: str
    score: float
    passed: bool
    competencyEvidenceLogged: bool
    pointsAwarded: int
    feedback: str

class LearningStreakDTO(BaseModel):
    employeeId: str
    currentStreak: int
    longestStreak: int
    totalActiveDays: int
    lastActivityDate: str
    milestones: List[Dict[str, Any]]

class LeaderboardRankDTO(BaseModel):
    rank: int
    employeeId: str
    name: str
    department: str
    designation: str
    points: int
    badgesCount: int
    assessmentsCompleted: int
    labsCompleted: int

class DigitalPassportDTO(BaseModel):
    passportNumber: str
    employee: Dict[str, Any]
    department: Dict[str, Any]
    competencyMatrix: List[Dict[str, Any]]
    completedCourses: List[Dict[str, Any]]
    verifiedAssessments: List[Dict[str, Any]]
    virtualLabs: List[Dict[str, Any]]
    achievements: List[Dict[str, Any]]
    futureRoleReadiness: Dict[str, Any]
    verificationHash: str
    qrCodeData: str
    issuedDate: str
    status: str
