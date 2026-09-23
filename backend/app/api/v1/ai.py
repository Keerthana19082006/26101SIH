from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, status
from app.services.groq_service import GroqService

router = APIRouter(prefix="/ai", tags=["AI Assessment & Groq Integration"])

class GenerateAssessmentRequest(BaseModel):
    employeeId: Optional[str] = None
    department: str
    role: str
    professionalArea: Optional[str] = None
    competencies: Optional[List[str]] = None
    count: Optional[int] = 6

@router.post("/generate-assessment")
def generate_assessment(req: GenerateAssessmentRequest):
    """
    POST /api/ai/generate-assessment
    Generates a role-specific competency assessment using Groq AI.
    Never exposes API keys or sensitive internals to the client.
    """
    if not req.department or not req.role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department and role are required fields for generating an assessment."
        )

    try:
        assessment_data = GroqService.generate_assessment_questions(
            department=req.department,
            role=req.role,
            professional_area=req.professionalArea,
            competencies=req.competencies,
            count=req.count or 6
        )

        return {
            "success": True,
            "assessment": assessment_data
        }

    except Exception as e:
        # Controlled error handling without leaking stack traces or internal secrets
        return {
            "success": False,
            "error": "AI assessment service temporarily unavailable."
        }
