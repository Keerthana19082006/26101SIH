from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class OptionDTO(BaseModel):
    id: str
    key: str
    text: str

class QuestionDTO(BaseModel):
    id: str
    competencyId: str
    competencyName: Optional[str] = None
    questionText: str
    difficulty: str
    options: List[OptionDTO]

class StartDiagnosticRequest(BaseModel):
    employeeId: str

class DiagnosticAssessmentDTO(BaseModel):
    attemptId: str
    employeeId: str
    roleTitle: str
    departmentName: str
    totalQuestions: int
    questions: List[QuestionDTO]
    attemptIndex: int = 1

class SubmitAnswerRequest(BaseModel):
    questionId: str
    selectedOptionId: str
    responseTimeSeconds: Optional[int] = 0

class AdaptiveNextQuestionResponse(BaseModel):
    answeredCorrect: bool
    nextQuestion: Optional[QuestionDTO] = None
    questionsRemaining: int
    currentScore: float

class SubmitAssessmentRequest(BaseModel):
    answers: Dict[str, str]  # questionId -> selectedOptionId

class AssessmentResultDTO(BaseModel):
    attemptId: str
    employeeId: str
    overallScore: float
    benchmark: float = 70.0
    passed: bool = True
    totalQuestions: int
    correctCount: int
    competencyScores: Dict[str, float]
    competencyBreakdown: List[Dict[str, Any]]
    criticalGaps: List[Dict[str, Any]]
    developingGaps: List[Dict[str, Any]]
    strongAreas: List[Dict[str, Any]]
    recommendedCourses: List[Dict[str, Any]]
    futureRoleReadiness: float
