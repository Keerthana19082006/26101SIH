from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class DocumentDTO(BaseModel):
    id: str
    title: str
    filename: str
    fileType: str
    fileSizeMb: float
    competencyName: str
    chunksCount: int
    status: str
    createdAt: str

class GenerateMCQRequest(BaseModel):
    documentId: Optional[str] = None
    textContext: Optional[str] = None
    competency: str = "Survey Sampling"
    difficulty: str = "Intermediate"
    count: int = 5
    department: Optional[str] = "MoSPI / National Statistical Office"

class GeneratedMCQDTO(BaseModel):
    id: str
    documentId: Optional[str] = None
    competencyName: str
    difficulty: str
    questionText: str
    options: List[Dict[str, Any]]
    correctOptionKey: str
    explanation: Optional[str] = None
    sourceReference: Optional[str] = None
    validationStatus: str
    reviewerFeedback: Optional[str] = None

class UpdateMCQStatusRequest(BaseModel):
    status: str  # APPROVED, REJECTED, PUBLISHED
    feedback: Optional[str] = None
