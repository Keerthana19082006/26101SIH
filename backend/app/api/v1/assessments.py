from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.assessment_engine import AssessmentEngine
from app.services.competency_engine import CompetencyEngine
from app.services.streak_engine import StreakEngine
from app.models.assessments import AssessmentAttempt, Question, QuestionOption
from app.schemas.assessment import (
    StartDiagnosticRequest,
    DiagnosticAssessmentDTO,
    QuestionDTO,
    OptionDTO,
    SubmitAnswerRequest,
    AdaptiveNextQuestionResponse,
    SubmitAssessmentRequest,
    AssessmentResultDTO
)

router = APIRouter(prefix="/assessments", tags=["Assessments"])

@router.post("/start-diagnostic")
def start_diagnostic_attempt(req: StartDiagnosticRequest, db: Session = Depends(get_db)):
    """
    CRITICAL RULE (#7 & #39):
    Every time 'Enter Employee' is clicked, this endpoint creates a brand new attempt record
    in PostgreSQL, loading the role-aware questions.
    """
    attempt = AssessmentEngine.start_diagnostic_attempt(db, req.employeeId)
    questions = AssessmentEngine.get_role_questions(db, req.employeeId, limit=10)

    # Format questions DTO
    question_dtos = []
    for q in questions:
        opts = [
            {"id": opt.id, "key": opt.option_key, "text": opt.text}
            for opt in q.options
        ]
        question_dtos.append({
            "id": q.id,
            "competencyId": q.competency_id,
            "competencyName": q.competency_name,
            "questionText": q.question_text,
            "difficulty": q.difficulty,
            "options": opts
        })

    return {
        "attemptId": attempt.id,
        "employeeId": attempt.employee_id,
        "roleTitle": "Cadre Specific Role",
        "departmentName": "Official Statistical System",
        "totalQuestions": len(question_dtos),
        "questions": question_dtos,
        "attemptIndex": attempt.attempt_index,
        "status": attempt.status
    }

@router.post("/{attempt_id}/answer")
def submit_single_answer(attempt_id: str, req: SubmitAnswerRequest, db: Session = Depends(get_db)):
    """
    Submits answer and calculates adaptive next question
    Progression: EASY <-> MEDIUM <-> HARD
    """
    try:
        result = AssessmentEngine.submit_answer(
            db,
            attempt_id=attempt_id,
            question_id=req.questionId,
            selected_option_id=req.selectedOptionId,
            response_time=req.responseTimeSeconds or 0
        )
        next_q = result.get("nextQuestion")
        next_q_dto = None
        if next_q:
            opts = [
                {"id": opt.id, "key": opt.option_key, "text": opt.text}
                for opt in next_q.options
            ]
            next_q_dto = {
                "id": next_q.id,
                "competencyId": next_q.competency_id,
                "competencyName": next_q.competency_name,
                "questionText": next_q.question_text,
                "difficulty": next_q.difficulty,
                "options": opts
            }

        return {
            "answeredCorrect": result["answeredCorrect"],
            "nextQuestion": next_q_dto,
            "questionsRemaining": result["questionsRemaining"],
            "currentScore": result["currentScore"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{attempt_id}/submit")
def submit_completed_assessment(attempt_id: str, req: SubmitAssessmentRequest, db: Session = Depends(get_db)):
    """
    Finalizes assessment, updates competency levels, calculates skill gaps,
    records learning activity, and generates closed-loop course recommendations.
    """
    try:
        eval_result = CompetencyEngine.evaluate_attempt(db, attempt_id, req.answers)
        
        # Record learning activity to advance streak and leaderboard
        StreakEngine.record_learning_activity(
            db,
            employee_id=eval_result["employeeId"],
            activity_type="ASSESSMENT_COMPLETED",
            title=f"Diagnostic Competency Assessment #{attempt_id[-6:]}",
            points=50
        )

        return eval_result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/results/{attempt_id}")
def get_assessment_result(attempt_id: str, db: Session = Depends(get_db)):
    attempt = db.query(AssessmentAttempt).filter(AssessmentAttempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    
    return {
        "attemptId": attempt.id,
        "employeeId": attempt.employee_id,
        "scorePercentage": attempt.score_percentage,
        "status": attempt.status,
        "totalQuestions": attempt.total_questions,
        "answeredCount": attempt.answered_count,
        "completedAt": str(attempt.completed_at) if attempt.completed_at else None
    }
