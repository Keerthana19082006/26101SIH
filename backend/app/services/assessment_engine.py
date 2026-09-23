import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from sqlalchemy.orm import Session
from app.models.assessments import Question, QuestionOption, AssessmentAttempt, AssessmentResponse
from app.models.employees import Employee
from app.models.organization import Role, RoleCompetency, Competency

class AssessmentEngine:
    @staticmethod
    def start_diagnostic_attempt(db: Session, employee_id: str) -> AssessmentAttempt:
        """
        CRITICAL RULE (#7 & #39):
        EVERY TIME "ENTER EMPLOYEE" IS CLICKED, A NEW ATTEMPT RECORD IS CREATED.
        Previous completions, abandonments, or existing scores MUST NEVER block a new attempt.
        """
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            # Fallback to demo-employee-01 if ID doesn't exist
            employee_id = "demo-employee-01"
            employee = db.query(Employee).filter(Employee.id == employee_id).first()

        # Determine attempt index
        prev_attempts_count = db.query(AssessmentAttempt).filter(
            AssessmentAttempt.employee_id == employee_id
        ).count()

        new_attempt = AssessmentAttempt(
            id=f"asmt-{employee_id}-{int(datetime.utcnow().timestamp() * 1000)}-{uuid.uuid4().hex[:6]}",
            employee_id=employee_id,
            attempt_type="INITIAL_DIAGNOSTIC",
            attempt_index=prev_attempts_count + 1,
            status="IN_PROGRESS",
            total_questions=10,
            answered_count=0,
            score_percentage=0.0,
            started_at=datetime.utcnow()
        )
        db.add(new_attempt)
        db.commit()
        db.refresh(new_attempt)
        return new_attempt

    @staticmethod
    def get_role_questions(db: Session, employee_id: str, limit: int = 10) -> List[Question]:
        """
        Select questions covering all competencies mapped to the employee's current role blueprint.
        Prefer MEDIUM difficulty first.
        """
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        role_id = employee.current_role_id if employee else None

        # Fetch required competencies for this role
        competency_ids = []
        if role_id:
            role_comps = db.query(RoleCompetency).filter(RoleCompetency.role_id == role_id).all()
            competency_ids = [rc.competency_id for rc in role_comps]

        if not competency_ids:
            # Fallback: take competencies from all available
            comps = db.query(Competency).limit(5).all()
            competency_ids = [c.id for c in comps]

        selected_questions = []
        used_ids = set()

        for comp_id in competency_ids:
            # Prefer 1 MEDIUM question
            q1 = db.query(Question).filter(
                Question.competency_id == comp_id,
                Question.status == "APPROVED",
                Question.difficulty == "MEDIUM",
                ~Question.id.in_(used_ids)
            ).first()

            if not q1:
                q1 = db.query(Question).filter(
                    Question.competency_id == comp_id,
                    Question.status == "APPROVED",
                    ~Question.id.in_(used_ids)
                ).first()

            if q1:
                selected_questions.append(q1)
                used_ids.add(q1.id)

            # Pick second question (EASY or HARD)
            q2 = db.query(Question).filter(
                Question.competency_id == comp_id,
                Question.status == "APPROVED",
                Question.difficulty.in_(["EASY", "HARD"]),
                ~Question.id.in_(used_ids)
            ).first()

            if not q2:
                q2 = db.query(Question).filter(
                    Question.competency_id == comp_id,
                    Question.status == "APPROVED",
                    ~Question.id.in_(used_ids)
                ).first()

            if q2:
                selected_questions.append(q2)
                used_ids.add(q2.id)

            if len(selected_questions) >= limit:
                break

        # If pool has fewer, fill up from any approved questions
        if len(selected_questions) < limit:
            extras = db.query(Question).filter(
                Question.status == "APPROVED",
                ~Question.id.in_(used_ids)
            ).limit(limit - len(selected_questions)).all()
            selected_questions.extend(extras)

        return selected_questions[:limit]

    @staticmethod
    def get_adaptive_next_question(
        db: Session,
        employee_id: str,
        competency_id: str,
        current_difficulty: str,
        was_correct: bool,
        answered_ids: List[str]
    ) -> Optional[Question]:
        """
        Adaptive difficulty progression:
        If correct: EASY -> MEDIUM -> HARD
        If incorrect: HARD -> MEDIUM -> EASY
        """
        if was_correct:
            target_difficulty = "HARD" if current_difficulty == "MEDIUM" else "MEDIUM"
        else:
            target_difficulty = "EASY" if current_difficulty == "MEDIUM" else "MEDIUM"

        next_q = db.query(Question).filter(
            Question.competency_id == competency_id,
            Question.difficulty == target_difficulty,
            Question.status == "APPROVED",
            ~Question.id.in_(answered_ids)
        ).first()

        if not next_q:
            # Fallback to any remaining in competency
            next_q = db.query(Question).filter(
                Question.competency_id == competency_id,
                Question.status == "APPROVED",
                ~Question.id.in_(answered_ids)
            ).first()

        return next_q

    @staticmethod
    def submit_answer(
        db: Session,
        attempt_id: str,
        question_id: str,
        selected_option_id: str,
        response_time: int = 0
    ) -> Dict[str, Any]:
        attempt = db.query(AssessmentAttempt).filter(AssessmentAttempt.id == attempt_id).first()
        if not attempt:
            raise ValueError("Assessment attempt not found")

        question = db.query(Question).filter(Question.id == question_id).first()
        if not question:
            raise ValueError("Question not found")

        selected_opt = db.query(QuestionOption).filter(QuestionOption.id == selected_option_id).first()
        is_correct = selected_opt.is_correct if selected_opt else False

        # Record response
        resp = AssessmentResponse(
            id=f"resp-{uuid.uuid4().hex[:10]}",
            attempt_id=attempt_id,
            question_id=question_id,
            selected_option_id=selected_option_id,
            is_correct=is_correct,
            difficulty_encountered=question.difficulty,
            response_time_seconds=response_time,
            answered_at=datetime.utcnow()
        )
        db.add(resp)

        attempt.answered_count += 1
        db.commit()

        # Find answered IDs in this attempt
        answered_q_ids = [
            r.question_id for r in db.query(AssessmentResponse.question_id).filter(
                AssessmentResponse.attempt_id == attempt_id
            ).all()
        ]

        # Get adaptive next question in same or related competency
        next_q = AssessmentEngine.get_adaptive_next_question(
            db,
            attempt.employee_id,
            question.competency_id,
            question.difficulty,
            is_correct,
            answered_q_ids
        )

        return {
            "answeredCorrect": is_correct,
            "nextQuestion": next_q,
            "questionsRemaining": max(0, attempt.total_questions - attempt.answered_count),
            "currentScore": 0.0
        }
