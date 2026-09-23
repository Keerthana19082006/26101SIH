import json
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.documents import GeneratedMCQ
from app.models.assessments import Question, QuestionOption
from app.services.rag_engine import RAGEngine
from app.schemas.document_mcq import GenerateMCQRequest, UpdateMCQStatusRequest

router = APIRouter(prefix="/mcqs", tags=["AI MCQ Generation & Review"])

@router.post("/generate")
def generate_mcqs(req: GenerateMCQRequest, db: Session = Depends(get_db)):
    """
    RAG-grounded AI MCQ Generation.
    Generated questions start in REVIEW_REQUIRED status.
    """
    generated = RAGEngine.generate_grounded_mcqs(
        db=db,
        document_id=req.documentId,
        text_context=req.textContext,
        competency=req.competency,
        difficulty=req.difficulty,
        count=req.count
    )

    return [
        {
            "id": g.id,
            "documentId": g.document_id,
            "competency": g.competency_name,
            "difficulty": g.difficulty,
            "questionText": g.question_text,
            "options": json.loads(g.options_json),
            "correctOptionKey": g.correct_option_key,
            "explanation": g.explanation,
            "sourceReference": g.source_reference,
            "validationStatus": g.validation_status
        }
        for g in generated
    ]

@router.get("")
def list_mcqs(
    status: Optional[str] = Query(None),
    competency: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(GeneratedMCQ)
    if status and status != "all":
        query = query.filter(GeneratedMCQ.validation_status == status)
    if competency:
        query = query.filter(GeneratedMCQ.competency_name.ilike(f"%{competency}%"))

    items = query.order_by(GeneratedMCQ.created_at.desc()).all()
    return [
        {
            "id": g.id,
            "competency": g.competency_name,
            "difficulty": g.difficulty,
            "questionText": g.question_text,
            "options": json.loads(g.options_json),
            "correctOptionKey": g.correct_option_key,
            "explanation": g.explanation,
            "sourceReference": g.source_reference,
            "validationStatus": g.validation_status,
            "reviewerFeedback": g.reviewer_feedback
        }
        for g in items
    ]

@router.patch("/{id}/status")
def update_mcq_status(id: str, req: UpdateMCQStatusRequest, db: Session = Depends(get_db)):
    mcq = db.query(GeneratedMCQ).filter(GeneratedMCQ.id == id).first()
    if not mcq:
        raise HTTPException(status_code=404, detail="MCQ not found")

    mcq.validation_status = req.status
    if req.feedback:
        mcq.reviewer_feedback = req.feedback
    
    # If approved and published, add directly to live questions pool!
    if req.status == "PUBLISHED":
        options_data = json.loads(mcq.options_json)
        new_q = Question(
            id=f"q-pub-{uuid.uuid4().hex[:10]}",
            competency_id="comp-sampling",
            competency_name=mcq.competency_name,
            question_text=mcq.question_text,
            difficulty=mcq.difficulty.upper(),
            status="APPROVED",
            explanation=mcq.explanation,
            source_document_id=mcq.document_id
        )
        db.add(new_q)
        db.flush()

        for opt in options_data:
            q_opt = QuestionOption(
                id=f"opt-{uuid.uuid4().hex[:10]}",
                question_id=new_q.id,
                option_key=opt.get("key", "A"),
                text=opt.get("text", ""),
                is_correct=opt.get("isCorrect", False)
            )
            db.add(q_opt)

    db.commit()
    return {"id": mcq.id, "status": mcq.validation_status}
