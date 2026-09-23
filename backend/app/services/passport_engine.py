import hashlib
import json
from datetime import datetime
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.employees import Employee, DigitalPassport, EmployeeCompetency
from app.models.engagement import LabAttempt, Achievement, LeaderboardEntry
from app.models.learning import CourseEnrollment
from app.models.organization import Department, Competency

class PassportEngine:
    @staticmethod
    def get_or_create_passport(db: Session, employee_id: str) -> Dict[str, Any]:
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            employee_id = "demo-employee-01"
            employee = db.query(Employee).filter(Employee.id == employee_id).first()

        passport = db.query(DigitalPassport).filter(DigitalPassport.employee_id == employee_id).first()
        
        dept = db.query(Department).filter(Department.id == employee.department_id).first() if employee else None
        dept_name = dept.name if dept else (employee.department if employee else "MoSPI / National Statistical Office")
        ministry = dept.ministry if dept else "Ministry of Statistics & Programme Implementation"

        if not passport:
            import uuid
            passport_num = f"IN-GOV-{employee.id.upper()[-6:]}-2026"
            raw_hash_data = f"{employee.id}-{dept_name}-{passport_num}-karmasiksha"
            verif_hash = hashlib.sha256(raw_hash_data.encode()).hexdigest()

            passport = DigitalPassport(
                id=f"dp-{uuid.uuid4().hex[:10]}",
                employee_id=employee.id,
                passport_number=passport_num,
                verification_hash=verif_hash,
                qr_code_data=f"https://igotkarmayogi.gov.in/verify/{passport_num}?hash={verif_hash[:16]}",
                issued_date="2026-01-15",
                last_verified_at=datetime.utcnow(),
                status="ACTIVE_VERIFIED"
            )
            db.add(passport)
            db.commit()
            db.refresh(passport)

        # Aggregate competencies
        emp_comps = db.query(EmployeeCompetency).filter(EmployeeCompetency.employee_id == employee.id).all()
        competency_matrix = []
        for ec in emp_comps:
            comp = db.query(Competency).filter(Competency.id == ec.competency_id).first()
            competency_matrix.append({
                "competencyId": ec.competency_id,
                "name": comp.name if comp else "Statistical Method",
                "currentLevel": ec.current_level,
                "scorePercentage": ec.score_percentage,
                "tier": ec.proficiency_tier,
                "lastAssessed": ec.last_assessed_at.strftime("%d %b %Y") if ec.last_assessed_at else "Recently"
            })

        # Aggregate completed courses
        enrollments = db.query(CourseEnrollment).filter(
            CourseEnrollment.employee_id == employee.id
        ).all()
        completed_courses = []
        for en in enrollments:
            completed_courses.append({
                "courseId": en.course_id,
                "title": en.course.title if en.course else "iGOT Course",
                "provider": en.course.provider if en.course else "iGOT Karmayogi",
                "status": en.status,
                "progress": en.progress_percent
            })

        # Achievements
        achievements = db.query(Achievement).filter(Achievement.employee_id == employee.id).all()
        achieve_list = [
            {"title": a.title, "category": a.category, "description": a.description}
            for a in achievements
        ]

        return {
            "passportNumber": passport.passport_number,
            "verificationHash": passport.verification_hash,
            "qrCodeData": passport.qr_code_data,
            "status": passport.status,
            "issuedDate": passport.issued_date,
            "employee": {
                "id": employee.id,
                "name": employee.name,
                "avatarInitials": employee.avatar_initials,
                "cadre": employee.cadre or "Subordinate Statistical Service (SSS)",
                "payLevel": employee.pay_level or "Level 6 (7th CPC)",
                "currentRole": employee.current_role.title if employee.current_role else "Statistical Investigator",
                "targetRole": employee.target_role.title if employee.target_role else "Senior Statistical Officer",
                "overallCompetency": employee.overall_competency,
                "igotId": employee.igot_id or "IGOT-GOV-2026",
                "station": employee.station
            },
            "department": {
                "name": dept_name,
                "ministry": ministry,
                "station": employee.station
            },
            "competencyMatrix": competency_matrix,
            "completedCourses": completed_courses,
            "verifiedAssessments": [
                {
                    "title": "National Statistical Cadre Initial Diagnostic",
                    "score": f"{employee.overall_competency}%",
                    "verification": "VERIFIED_NSSTA_BENCHMARK",
                    "date": "September 2026"
                }
            ],
            "virtualLabs": [
                {
                    "title": "MoSPI Sampling Allocation Lab",
                    "status": "COMPLETED_WITH_DISTINCTION",
                    "score": "95%"
                }
            ],
            "achievements": achieve_list,
            "futureRoleReadiness": {
                "targetRole": employee.target_role.title if employee.target_role else "Senior Statistical Officer",
                "readinessPercentage": employee.future_role_readiness,
                "eligibilityStatus": "READY_FOR_HIGHER_CADRE_SELECTION" if employee.future_role_readiness >= 70 else "IN_TRAINING_CYCLE"
            }
        }
