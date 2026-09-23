from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.learning import Course, LearningPath, LearningPathItem
from app.models.employees import Employee, SkillGap
from app.models.organization import Competency

class RecommendationEngine:
    @staticmethod
    def get_recommendations(db: Session, employee_id: str) -> List[Dict[str, Any]]:
        """
        Maps identified skill gaps (especially CRITICAL and DEVELOPING)
        to authoritative iGOT / NSSTA courses with explicit rationale.
        """
        # Fetch employee's critical and developing skill gaps
        gaps = db.query(SkillGap).filter(
            SkillGap.employee_id == employee_id
        ).order_by(SkillGap.gap_score.desc()).all()

        recommendations = []
        covered_course_ids = set()

        for gap in gaps:
            comp = db.query(Competency).filter(Competency.id == gap.competency_id).first()
            comp_name = comp.name if comp else "Domain Knowledge"

            # Search courses mapped to this competency or containing keywords
            matching_courses = db.query(Course).filter(
                (Course.competency_id == gap.competency_id) |
                (Course.title.ilike(f"%{comp_name}%")) |
                (Course.target_competency_name.ilike(f"%{comp_name}%"))
            ).all()

            for course in matching_courses:
                if course.id in covered_course_ids:
                    continue
                covered_course_ids.add(course.id)

                priority = "CRITICAL" if gap.is_critical else "HIGH"
                recommendations.append({
                    "id": course.id,
                    "code": course.code,
                    "title": course.title,
                    "provider": course.provider,
                    "targetCompetency": comp_name,
                    "gapSeverity": gap.severity,
                    "priority": priority,
                    "durationHours": course.duration_hours,
                    "level": course.level,
                    "rating": course.rating,
                    "modulesCount": course.modules_count,
                    "isIgotIntegrated": course.is_igot_integrated,
                    "reason": f"Targeted remediation for {gap.severity.lower()} skill gap in {comp_name} (Gap: -{gap.gap_score} pts)",
                    "expectedImprovement": f"+{min(25, int(gap.gap_score * 10))}% in {comp_name}"
                })

        # If no direct gaps mapped, return top rated iGOT courses
        if not recommendations:
            top_courses = db.query(Course).order_by(Course.rating.desc()).limit(4).all()
            for c in top_courses:
                recommendations.append({
                    "id": c.id,
                    "code": c.code,
                    "title": c.title,
                    "provider": c.provider,
                    "targetCompetency": c.target_competency_name or "Official Statistics",
                    "gapSeverity": "DEVELOPING",
                    "priority": "MEDIUM",
                    "durationHours": c.duration_hours,
                    "level": c.level,
                    "rating": c.rating,
                    "modulesCount": c.modules_count,
                    "isIgotIntegrated": c.is_igot_integrated,
                    "reason": "Core ministerial competency course for your cadre advancement",
                    "expectedImprovement": "+15% in Cadre Efficiency"
                })

        return recommendations[:6]

    @staticmethod
    def refresh_learning_path(db: Session, employee_id: str) -> Dict[str, Any]:
        """
        Regenerates dynamic learning path based on latest assessment results.
        """
        recs = RecommendationEngine.get_recommendations(db, employee_id)
        
        lp = db.query(LearningPath).filter(
            LearningPath.employee_id == employee_id
        ).first()

        if not lp:
            import uuid
            lp = LearningPath(
                id=f"lp-{uuid.uuid4().hex[:10]}",
                employee_id=employee_id,
                title="Cadre Competency Progression Pathway (FRAC Aligned)",
                status="ACTIVE",
                overall_progress=35.0
            )
            db.add(lp)
            db.commit()
            db.refresh(lp)
        else:
            # Clear existing items to re-order
            db.query(LearningPathItem).filter(
                LearningPathItem.learning_path_id == lp.id
            ).delete()
            db.commit()

        # Add updated items
        import uuid
        items = []
        for idx, rec in enumerate(recs):
            item = LearningPathItem(
                id=f"lpi-{uuid.uuid4().hex[:10]}",
                learning_path_id=lp.id,
                course_id=rec["id"],
                sequence_order=idx + 1,
                status="IN_PROGRESS" if idx == 0 else "PENDING",
                reason=rec["reason"],
                priority=rec["priority"]
            )
            db.add(item)
            items.append({
                "id": item.id,
                "course": rec,
                "order": idx + 1,
                "status": item.status,
                "reason": item.reason,
                "priority": item.priority
            })

        db.commit()
        return {
            "id": lp.id,
            "employeeId": employee_id,
            "title": lp.title,
            "status": lp.status,
            "overallProgress": lp.overall_progress,
            "items": items
        }

    @staticmethod
    def simulate_what_if(
        current_readiness: float,
        competency_name: str,
        current_level: float,
        target_level: float
    ) -> Dict[str, Any]:
        """
        Simulate projected future role readiness if competency improves from current -> target.
        """
        gain = max(0.0, target_level - current_level)
        projected_readiness = min(100.0, round(current_readiness + (gain * 6.5), 1))
        
        return {
            "competencyName": competency_name,
            "currentLevel": current_level,
            "targetLevel": target_level,
            "baselineReadiness": current_readiness,
            "projectedReadiness": projected_readiness,
            "readinessGain": round(projected_readiness - current_readiness, 1),
            "recommendation": f"Achieving Level {target_level} in {competency_name} places this officer within the promotional benchmark range."
        }
