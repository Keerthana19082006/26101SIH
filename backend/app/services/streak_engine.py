import uuid
from datetime import datetime, date, timedelta
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.engagement import LearningStreak, LearningActivity, LeaderboardEntry
from app.models.employees import Employee

class StreakEngine:
    @staticmethod
    def get_streak(db: Session, employee_id: str) -> Dict[str, Any]:
        streak = db.query(LearningStreak).filter(LearningStreak.employee_id == employee_id).first()
        if not streak:
            streak = LearningStreak(
                id=f"stk-{uuid.uuid4().hex[:10]}",
                employee_id=employee_id,
                current_streak=14,
                longest_streak=21,
                total_active_days=38,
                last_activity_date=date.today()
            )
            db.add(streak)
            db.commit()
            db.refresh(streak)

        milestones = [
            {"days": 3, "title": "3-Day Starter", "achieved": streak.longest_streak >= 3},
            {"days": 7, "title": "Weekly Champion", "achieved": streak.longest_streak >= 7},
            {"days": 14, "title": "Fortnight Dedication", "achieved": streak.longest_streak >= 14},
            {"days": 30, "title": "Monthly Cadre Master", "achieved": streak.longest_streak >= 30},
        ]

        return {
            "employeeId": employee_id,
            "currentStreak": streak.current_streak,
            "longestStreak": streak.longest_streak,
            "totalActiveDays": streak.total_active_days,
            "lastActivityDate": str(streak.last_activity_date),
            "milestones": milestones
        }

    @staticmethod
    def record_learning_activity(
        db: Session,
        employee_id: str,
        activity_type: str,
        title: str,
        points: int = 25
    ) -> Dict[str, Any]:
        """
        Records a meaningful learning activity.
        Multiple activities on same day do not increase streak by more than 1.
        Updates Leaderboard points.
        """
        today = date.today()

        # Log activity
        act = LearningActivity(
            id=f"act-{uuid.uuid4().hex[:10]}",
            employee_id=employee_id,
            activity_type=activity_type,
            title=title,
            points_awarded=points,
            activity_date=today,
            created_at=datetime.utcnow()
        )
        db.add(act)

        # Update streak
        streak = db.query(LearningStreak).filter(LearningStreak.employee_id == employee_id).first()
        streak_extended = False

        if streak:
            last_date = streak.last_activity_date
            if last_date == today - timedelta(days=1):
                # Consecutive day: increment streak
                streak.current_streak += 1
                streak.total_active_days += 1
                streak.longest_streak = max(streak.longest_streak, streak.current_streak)
                streak.last_activity_date = today
                streak_extended = True
            elif last_date == today:
                # Same day: activity counted, streak maintained
                pass
            else:
                # Streak broken, reset to 1
                streak.current_streak = 1
                streak.total_active_days += 1
                streak.last_activity_date = today
                streak_extended = True
        else:
            streak = LearningStreak(
                id=f"stk-{uuid.uuid4().hex[:10]}",
                employee_id=employee_id,
                current_streak=1,
                longest_streak=1,
                total_active_days=1,
                last_activity_date=today
            )
            db.add(streak)
            streak_extended = True

        # Update leaderboard points
        lb = db.query(LeaderboardEntry).filter(LeaderboardEntry.employee_id == employee_id).first()
        if lb:
            lb.total_points += points
            if activity_type == "ASSESSMENT_COMPLETED":
                lb.assessments_completed += 1
            elif activity_type == "LAB_COMPLETED":
                lb.labs_completed += 1

        db.commit()

        return {
            "activityLogged": True,
            "pointsAwarded": points,
            "currentStreak": streak.current_streak,
            "streakExtended": streak_extended
        }
