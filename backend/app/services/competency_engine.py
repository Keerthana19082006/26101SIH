import uuid
from datetime import datetime
from typing import Dict, List, Any
from sqlalchemy.orm import Session
from app.models.assessments import AssessmentAttempt, AssessmentResponse, Question, QuestionOption
from app.models.employees import Employee, EmployeeCompetency, SkillGap
from app.models.organization import RoleCompetency, Competency

class CompetencyEngine:
    @staticmethod
    def get_proficiency_tier(level: float) -> str:
        if level >= 4.5:
            return "EXPERT"
        elif level >= 3.5:
            return "ADVANCED"
        elif level >= 2.5:
            return "INTERMEDIATE"
        elif level >= 1.5:
            return "BEGINNER"
        return "NOVICE"

    @staticmethod
    def evaluate_attempt(db: Session, attempt_id: str, answers_map: Dict[str, str]) -> Dict[str, Any]:
        attempt = db.query(AssessmentAttempt).filter(AssessmentAttempt.id == attempt_id).first()
        if not attempt:
            raise ValueError(f"Attempt {attempt_id} not found")

        employee_id = attempt.employee_id
        employee = db.query(Employee).filter(Employee.id == employee_id).first()

        # Score answers
        correct_count = 0
        competency_stats = {}  # comp_id -> {correct: int, total: int, comp_name: str}

        for q_id, opt_id in answers_map.items():
            question = db.query(Question).filter(Question.id == q_id).first()
            if not question:
                continue

            opt = db.query(QuestionOption).filter(QuestionOption.id == opt_id).first()
            is_correct = opt.is_correct if opt else False
            if is_correct:
                correct_count += 1

            comp_id = question.competency_id
            if comp_id not in competency_stats:
                comp = db.query(Competency).filter(Competency.id == comp_id).first()
                competency_stats[comp_id] = {
                    "correct": 0,
                    "total": 0,
                    "comp_name": comp.name if comp else (question.competency_name or "Competency"),
                    "benchmark": comp.benchmark_level if comp else 4.0
                }

            competency_stats[comp_id]["total"] += 1
            if is_correct:
                competency_stats[comp_id]["correct"] += 1

            # Check if response already recorded
            existing_resp = db.query(AssessmentResponse).filter(
                AssessmentResponse.attempt_id == attempt_id,
                AssessmentResponse.question_id == q_id
            ).first()
            if not existing_resp:
                new_resp = AssessmentResponse(
                    id=f"resp-{uuid.uuid4().hex[:10]}",
                    attempt_id=attempt_id,
                    question_id=q_id,
                    selected_option_id=opt_id,
                    is_correct=is_correct,
                    difficulty_encountered=question.difficulty,
                    answered_at=datetime.utcnow()
                )
                db.add(new_resp)

        total_questions = max(1, len(answers_map))
        overall_score = round((correct_count / total_questions) * 100, 1)

        # Update attempt
        attempt.status = "COMPLETED"
        attempt.score_percentage = overall_score
        attempt.answered_count = len(answers_map)
        attempt.completed_at = datetime.utcnow()

        # Update Employee Competencies & Skill Gaps
        competency_scores = {}
        competency_breakdown = []
        critical_gaps = []
        developing_gaps = []
        strong_areas = []

        for comp_id, stats in competency_stats.items():
            score_pct = round((stats["correct"] / max(1, stats["total"])) * 100, 1)
            # Level on 1-5 scale: (score_pct / 100) * 4 + 1
            current_level = round(1.0 + (score_pct / 100.0) * 4.0, 1)
            required_level = stats["benchmark"]
            gap_score = max(0.0, round(required_level - current_level, 1))

            competency_scores[stats["comp_name"]] = score_pct
            proficiency_tier = CompetencyEngine.get_proficiency_tier(current_level)

            # Determine severity
            if gap_score >= 1.8:
                severity = "CRITICAL"
                is_critical = True
                critical_gaps.append({
                    "competencyId": comp_id,
                    "competencyName": stats["comp_name"],
                    "currentLevel": current_level,
                    "requiredLevel": required_level,
                    "gap": gap_score,
                    "severity": severity
                })
            elif gap_score >= 0.8:
                severity = "DEVELOPING"
                is_critical = False
                developing_gaps.append({
                    "competencyId": comp_id,
                    "competencyName": stats["comp_name"],
                    "currentLevel": current_level,
                    "requiredLevel": required_level,
                    "gap": gap_score,
                    "severity": severity
                })
            else:
                severity = "STRONG"
                is_critical = False
                strong_areas.append({
                    "competencyId": comp_id,
                    "competencyName": stats["comp_name"],
                    "currentLevel": current_level,
                    "requiredLevel": required_level,
                    "gap": gap_score,
                    "severity": severity
                })

            competency_breakdown.append({
                "id": comp_id,
                "name": stats["comp_name"],
                "score": score_pct,
                "currentLevel": current_level,
                "requiredLevel": required_level,
                "gapScore": gap_score,
                "severity": severity,
                "proficiencyTier": proficiency_tier
            })

            # Upsert into EmployeeCompetency
            emp_comp = db.query(EmployeeCompetency).filter(
                EmployeeCompetency.employee_id == employee_id,
                EmployeeCompetency.competency_id == comp_id
            ).first()

            if not emp_comp:
                emp_comp = EmployeeCompetency(
                    id=f"ec-{uuid.uuid4().hex[:10]}",
                    employee_id=employee_id,
                    competency_id=comp_id,
                    current_level=current_level,
                    score_percentage=score_pct,
                    proficiency_tier=proficiency_tier,
                    last_assessed_at=datetime.utcnow()
                )
                db.add(emp_comp)
            else:
                emp_comp.current_level = current_level
                emp_comp.score_percentage = score_pct
                emp_comp.proficiency_tier = proficiency_tier
                emp_comp.last_assessed_at = datetime.utcnow()

            # Upsert into SkillGap
            skill_gap = db.query(SkillGap).filter(
                SkillGap.employee_id == employee_id,
                SkillGap.competency_id == comp_id
            ).first()

            if not skill_gap:
                skill_gap = SkillGap(
                    id=f"sg-{uuid.uuid4().hex[:10]}",
                    employee_id=employee_id,
                    competency_id=comp_id,
                    current_level=current_level,
                    required_level=required_level,
                    gap_score=gap_score,
                    severity=severity,
                    is_critical=is_critical,
                    updated_at=datetime.utcnow()
                )
                db.add(skill_gap)
            else:
                skill_gap.current_level = current_level
                skill_gap.required_level = required_level
                skill_gap.gap_score = gap_score
                skill_gap.severity = severity
                skill_gap.is_critical = is_critical
                skill_gap.updated_at = datetime.utcnow()

        # Update overall employee summary
        if employee:
            employee.overall_competency = overall_score
            employee.critical_gaps_count = len(critical_gaps)
            employee.priority_skill_gaps_count = len(critical_gaps) + len(developing_gaps)
            employee.future_role_readiness = max(40.0, round(overall_score * 0.85 + 10.0, 1))

        db.commit()

        # Get recommendations via closed loop
        from app.services.recommendation_engine import RecommendationEngine
        recommended_courses = RecommendationEngine.get_recommendations(db, employee_id)

        return {
            "attemptId": attempt_id,
            "employeeId": employee_id,
            "overallScore": overall_score,
            "benchmark": 70.0,
            "passed": overall_score >= 60.0,
            "totalQuestions": total_questions,
            "correctCount": correct_count,
            "competencyScores": competency_scores,
            "competencyBreakdown": competency_breakdown,
            "criticalGaps": critical_gaps,
            "developingGaps": developing_gaps,
            "strongAreas": strong_areas,
            "recommendedCourses": recommended_courses,
            "futureRoleReadiness": employee.future_role_readiness if employee else 65.0
        }
