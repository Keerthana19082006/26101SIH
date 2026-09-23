from app.schemas.auth import Token, LoginRequest, RegisterRequest, UserResponse
from app.schemas.employee import EmployeeProfileResponse, DashboardSummaryResponse, CompetencyItem, SkillGapItem
from app.schemas.assessment import (
    StartDiagnosticRequest,
    DiagnosticAssessmentDTO,
    QuestionDTO,
    OptionDTO,
    SubmitAnswerRequest,
    AdaptiveNextQuestionResponse,
    SubmitAssessmentRequest,
    AssessmentResultDTO,
)
from app.schemas.learning import CourseDTO, RecommendedCourseDTO, LearningPathDTO, LearningPathItemDTO
from app.schemas.engagement import (
    VirtualLabDTO,
    SubmitLabRequest,
    LabResultDTO,
    LearningStreakDTO,
    LeaderboardRankDTO,
    DigitalPassportDTO,
)
from app.schemas.document_mcq import DocumentDTO, GenerateMCQRequest, GeneratedMCQDTO, UpdateMCQStatusRequest

__all__ = [
    "Token",
    "LoginRequest",
    "RegisterRequest",
    "UserResponse",
    "EmployeeProfileResponse",
    "DashboardSummaryResponse",
    "CompetencyItem",
    "SkillGapItem",
    "StartDiagnosticRequest",
    "DiagnosticAssessmentDTO",
    "QuestionDTO",
    "OptionDTO",
    "SubmitAnswerRequest",
    "AdaptiveNextQuestionResponse",
    "SubmitAssessmentRequest",
    "AssessmentResultDTO",
    "CourseDTO",
    "RecommendedCourseDTO",
    "LearningPathDTO",
    "LearningPathItemDTO",
    "VirtualLabDTO",
    "SubmitLabRequest",
    "LabResultDTO",
    "LearningStreakDTO",
    "LeaderboardRankDTO",
    "DigitalPassportDTO",
    "DocumentDTO",
    "GenerateMCQRequest",
    "GeneratedMCQDTO",
    "UpdateMCQStatusRequest",
]
