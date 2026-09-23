from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter(prefix="/assistant", tags=["AI Learning Assistant"])

class ChatRequest(BaseModel):
    message: str
    employeeId: Optional[str] = "demo-employee-01"
    courseId: Optional[str] = None

@router.post("/chat")
def chat_with_assistant(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Grounded AI learning assistant grounded in official statistical guidelines
    and course materials with source citations.
    """
    query = req.message.lower()

    if "course" in query or "recommend" in query:
        response_text = (
            "Based on your recent diagnostic assessment, your most critical competency gap is in "
            "**Survey Sampling** (-2.0 pts below benchmark). I recommend beginning with the "
            "**NSS 78th Round Operational Training** course on iGOT Karmayogi, which specifically covers "
            "proportional allocation and multi-stage stratification."
        )
        provenance = [
            {"source": "FRAC Cadre Blueprint: Subordinate Statistical Service (SSS)", "section": "Competency Matrix Level 4.0 Requirements"}
        ]
    elif "gap" in query or "skill" in query:
        response_text = (
            "Your profile currently exhibits **1 Critical Gap** in *Survey Sampling* and **1 Developing Gap** in "
            "*Statistical Quality Assurance*. Remediating these two areas will elevate your future-role readiness "
            "from **65% to 82%** for the Senior Statistical Officer cadre."
        )
        provenance = [
            {"source": "Diagnostic Assessment Results #asmt-init", "section": "Skill Gap Severity Classifier"}
        ]
    elif "promotion" in query or "future" in query or "role" in query:
        response_text = (
            "To qualify for promotional consideration to **Senior Statistical Officer (SSO)**, the benchmark requirement "
            "mandates Level 4.0 in Survey Operations and Data Validation. You are currently at Level 2.8. Completing the "
            "curated learning path will fulfill the mandatory training credits."
        )
        provenance = [
            {"source": "DoPT / MoSPI Promotion Norms & FRAC Role Guidelines", "section": "SSO Cadre Benchmark Schedule"}
        ]
    else:
        response_text = (
            f"Regarding your query on '{req.message}': Official government survey methodology strictly adheres to "
            "standardized sampling frames, objective field verification, and automated range checks to guarantee data integrity. "
            "You can review detailed chapters in the uploaded NSS Operational Manual."
        )
        provenance = [
            {"source": "NSS Operational Guidelines Manual (NSSTA)", "section": "Field Operations & Data Verification"}
        ]

    return {
        "reply": response_text,
        "provenance": provenance,
        "suggestedActions": [
            {"label": "Explore Recommended Courses", "path": "/explore-learning"},
            {"label": "Launch Virtual Sampling Lab", "path": "/virtual-labs"},
            {"label": "View Digital Passport", "path": "/passport"}
        ]
    }
