import json
from datetime import datetime, date
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.users import User, UserRole
from app.models.organization import Department, Role, CompetencyDomain, Competency, RoleCompetency
from app.models.employees import Employee, EmployeeCompetency, SkillGap, DigitalPassport
from app.models.assessments import Question, QuestionOption
from app.models.learning import Course, CourseEnrollment
from app.models.engagement import VirtualLab, LearningStreak, LeaderboardEntry, Achievement
from app.models.documents import Document, DocumentChunk

def seed_database(db: Session):
    """
    Seeds the authoritative PostgreSQL database with deterministic,
    high-fidelity government data matching the SIH 26101 requirements.
    """
    # 1. Check if already seeded
    if db.query(User).first():
        print("Database already contains records. Skipping seed.")
        return

    print("Seeding KarmaSiksha production database...")

    # 2. Seed Users
    default_pw = get_password_hash("KarmaSiksha@2026")
    users = [
        User(id="usr-admin-01", email="admin@karmasiksha.gov.in", hashed_password=default_pw, role="ADMIN"),
        User(id="usr-trainer-01", email="trainer@karmasiksha.gov.in", hashed_password=default_pw, role="TRAINER"),
        User(id="usr-emp-01", email="employee01@karmasiksha.gov.in", hashed_password=default_pw, role="EMPLOYEE"),
        User(id="usr-emp-02", email="employee02@karmasiksha.gov.in", hashed_password=default_pw, role="EMPLOYEE"),
        User(id="usr-emp-03", email="employee03@karmasiksha.gov.in", hashed_password=default_pw, role="EMPLOYEE"),
        User(id="usr-emp-04", email="employee04@karmasiksha.gov.in", hashed_password=default_pw, role="EMPLOYEE"),
        User(id="usr-emp-05", email="employee05@karmasiksha.gov.in", hashed_password=default_pw, role="EMPLOYEE"),
    ]
    db.add_all(users)
    db.commit()

    # 3. Seed Departments
    departments = [
        Department(
            id="dept-mospi",
            code="MoSPI-NSO",
            name="MoSPI / National Statistical Office",
            category="Statistics & National Accounts",
            ministry="Ministry of Statistics & Programme Implementation",
            station="Sardar Patel Bhawan, New Delhi"
        ),
        Department(
            id="dept-agri",
            code="DA&FW",
            name="Ministry of Agriculture & Farmers Welfare",
            category="Agricultural Planning & Economics",
            ministry="Ministry of Agriculture & Farmers Welfare",
            station="Krishi Bhawan, New Delhi"
        ),
        Department(
            id="dept-health",
            code="MoHFW",
            name="Ministry of Health & Family Welfare",
            category="Public Health Statistics & Surveillance",
            ministry="Ministry of Health & Family Welfare",
            station="Nirman Bhawan, New Delhi"
        ),
        Department(
            id="dept-labour",
            code="MoLE",
            name="Ministry of Labour & Employment",
            category="Labour Market & Industrial Statistics",
            ministry="Ministry of Labour & Employment",
            station="Shram Shakti Bhawan, New Delhi"
        ),
        Department(
            id="dept-edu",
            code="MoE",
            name="Ministry of Education",
            category="Educational Planning & UDISE+ Analytics",
            ministry="Ministry of Education",
            station="Shastri Bhawan, New Delhi"
        )
    ]
    db.add_all(departments)
    db.commit()

    # 4. Seed Roles
    roles = [
        # MoSPI
        Role(id="role-mospi-curr", department_id="dept-mospi", title="Statistical Investigator", cadre="Subordinate Statistical Service (SSS)", pay_level="Level 6 (7th CPC)", is_target_role="false"),
        Role(id="role-mospi-target", department_id="dept-mospi", title="Senior Statistical Officer", cadre="Subordinate Statistical Service (SSS)", pay_level="Level 7 (7th CPC)", is_target_role="true"),
        # Agriculture
        Role(id="role-agri-curr", department_id="dept-agri", title="Agricultural Statistics Officer", cadre="Indian Statistical Service", pay_level="Level 7 (7th CPC)", is_target_role="false"),
        Role(id="role-agri-target", department_id="dept-agri", title="Senior Agricultural Economist", cadre="Indian Statistical Service", pay_level="Level 8 (7th CPC)", is_target_role="true"),
        # Health
        Role(id="role-health-curr", department_id="dept-health", title="Health Statistics Officer", cadre="Central Health Service", pay_level="Level 6 (7th CPC)", is_target_role="false"),
        Role(id="role-health-target", department_id="dept-health", title="Senior Health Data Analyst", cadre="Central Health Service", pay_level="Level 7 (7th CPC)", is_target_role="true"),
        # Labour
        Role(id="role-labour-curr", department_id="dept-labour", title="Labour Statistics Officer", cadre="Labour Bureau Cadre", pay_level="Level 6 (7th CPC)", is_target_role="false"),
        Role(id="role-labour-target", department_id="dept-labour", title="Assistant Director (Labour Analytics)", cadre="Labour Bureau Cadre", pay_level="Level 7 (7th CPC)", is_target_role="true"),
        # Education
        Role(id="role-edu-curr", department_id="dept-edu", title="Educational Statistics Analyst", cadre="Educational Planning Service", pay_level="Level 6 (7th CPC)", is_target_role="false"),
        Role(id="role-edu-target", department_id="dept-edu", title="Senior Education Data Officer", cadre="Educational Planning Service", pay_level="Level 7 (7th CPC)", is_target_role="true"),
    ]
    db.add_all(roles)
    db.commit()

    # 5. Seed Competencies
    competencies = [
        # MoSPI
        Competency(id="comp-sampling", code="STAT-01", name="Survey Sampling", benchmark_level=4.0, description="Principles of stratified, cluster, and multi-stage sampling in national surveys"),
        Competency(id="comp-stat-methods", code="STAT-02", name="Statistical Methods", benchmark_level=4.0, description="Hypothesis testing, variance estimation, and regression modeling"),
        Competency(id="comp-data-analysis", code="STAT-03", name="Data Analysis", benchmark_level=4.0, description="Cleaning, weighting, tabulation, and exploratory analysis of survey datasets"),
        Competency(id="comp-survey-ops", code="STAT-04", name="Survey Operations", benchmark_level=4.0, description="Field supervisory schedules, enumerator oversight, and non-response adjustment"),
        Competency(id="comp-quality", code="STAT-05", name="Statistical Quality Assurance", benchmark_level=4.0, description="Data validation rules, consistency audits, and statistical disclosure control"),
        # Agriculture
        Competency(id="comp-crop-est", code="AGRI-01", name="Crop Estimation & Forecasting", benchmark_level=4.0, description="Techniques of crop cutting experiments and remote sensing yield prediction"),
        # Health
        Competency(id="comp-epidemiology", code="HLTH-01", name="Public Health Indicators", benchmark_level=4.0, description="Maternal, child, and morbidity statistical metrics"),
        # Labour
        Competency(id="comp-cpi", code="LABR-01", name="CPI & Wage Rate Analytics", benchmark_level=4.0, description="Consumer Price Index methodology and industrial workforce surveys"),
        # Education
        Competency(id="comp-udise", code="EDU-01", name="UDISE+ & Education Indicators", benchmark_level=4.0, description="School education census metrics and gross enrollment ratios"),
    ]
    db.add_all(competencies)
    db.commit()

    # 6. Map Role Competencies
    rc_mappings = [
        RoleCompetency(id="rc-1", role_id="role-mospi-curr", competency_id="comp-sampling", required_level=4.0),
        RoleCompetency(id="rc-2", role_id="role-mospi-curr", competency_id="comp-stat-methods", required_level=4.0),
        RoleCompetency(id="rc-3", role_id="role-mospi-curr", competency_id="comp-data-analysis", required_level=4.0),
        RoleCompetency(id="rc-4", role_id="role-mospi-curr", competency_id="comp-survey-ops", required_level=4.0),
        RoleCompetency(id="rc-5", role_id="role-mospi-curr", competency_id="comp-quality", required_level=4.0),
    ]
    db.add_all(rc_mappings)
    db.commit()

    # 7. Seed 5 Demo Employees
    demo_employees = [
        Employee(
            id="demo-employee-01",
            user_id="usr-emp-01",
            employee_number="01",
            name="Employee 01",
            avatar_initials="E1",
            department_id="dept-mospi",
            current_role_id="role-mospi-curr",
            target_role_id="role-mospi-target",
            igot_id="IGOT-MOSPI-202401",
            cadre="Subordinate Statistical Service (SSS)",
            pay_level="Level 6 (7th CPC)",
            station="Sardar Patel Bhawan, New Delhi",
            badge="DEMO / TEST ACCOUNT",
            is_demo=True,
            overall_competency=63.0,
            learning_progress_percent=72.0,
            future_role_readiness=66.0,
            learning_streak_days=14,
            total_learning_hours=34.0
        ),
        Employee(
            id="demo-employee-02",
            user_id="usr-emp-02",
            employee_number="02",
            name="Employee 02",
            avatar_initials="E2",
            department_id="dept-agri",
            current_role_id="role-agri-curr",
            target_role_id="role-agri-target",
            igot_id="IGOT-AGRI-202402",
            cadre="Indian Statistical Service / DES",
            pay_level="Level 7 (7th CPC)",
            station="Krishi Bhawan, New Delhi",
            badge="DEMO / TEST ACCOUNT",
            is_demo=True,
            overall_competency=68.0,
            learning_progress_percent=65.0,
            future_role_readiness=70.0,
            learning_streak_days=10,
            total_learning_hours=28.0
        ),
        Employee(
            id="demo-employee-03",
            user_id="usr-emp-03",
            employee_number="03",
            name="Employee 03",
            avatar_initials="E3",
            department_id="dept-health",
            current_role_id="role-health-curr",
            target_role_id="role-health-target",
            igot_id="IGOT-HLTH-202403",
            cadre="Central Health Service",
            pay_level="Level 6 (7th CPC)",
            station="Nirman Bhawan, New Delhi",
            badge="DEMO / TEST ACCOUNT",
            is_demo=True,
            overall_competency=71.0,
            learning_progress_percent=80.0,
            future_role_readiness=74.0,
            learning_streak_days=18,
            total_learning_hours=42.0
        ),
        Employee(
            id="demo-employee-04",
            user_id="usr-emp-04",
            employee_number="04",
            name="Employee 04",
            avatar_initials="E4",
            department_id="dept-labour",
            current_role_id="role-labour-curr",
            target_role_id="role-labour-target",
            igot_id="IGOT-LABR-202404",
            cadre="Labour Bureau Cadre",
            pay_level="Level 6 (7th CPC)",
            station="Shram Shakti Bhawan, New Delhi",
            badge="DEMO / TEST ACCOUNT",
            is_demo=True,
            overall_competency=59.0,
            learning_progress_percent=55.0,
            future_role_readiness=61.0,
            learning_streak_days=7,
            total_learning_hours=19.0
        ),
        Employee(
            id="demo-employee-05",
            user_id="usr-emp-05",
            employee_number="05",
            name="Employee 05",
            avatar_initials="E5",
            department_id="dept-edu",
            current_role_id="role-edu-curr",
            target_role_id="role-edu-target",
            igot_id="IGOT-EDU-202405",
            cadre="Educational Planning Service",
            pay_level="Level 6 (7th CPC)",
            station="Shastri Bhawan, New Delhi",
            badge="DEMO / TEST ACCOUNT",
            is_demo=True,
            overall_competency=66.0,
            learning_progress_percent=60.0,
            future_role_readiness=68.0,
            learning_streak_days=12,
            total_learning_hours=25.0
        )
    ]
    db.add_all(demo_employees)
    db.commit()

    # 8. Seed Employee Competencies & Skill Gaps for Employee 01
    emp1_comps = [
        EmployeeCompetency(id="ec-1", employee_id="demo-employee-01", competency_id="comp-sampling", current_level=2.0, score_percentage=50.0, proficiency_tier="BEGINNER"),
        EmployeeCompetency(id="ec-2", employee_id="demo-employee-01", competency_id="comp-stat-methods", current_level=3.2, score_percentage=75.0, proficiency_tier="INTERMEDIATE"),
        EmployeeCompetency(id="ec-3", employee_id="demo-employee-01", competency_id="comp-data-analysis", current_level=3.8, score_percentage=85.0, proficiency_tier="ADVANCED"),
        EmployeeCompetency(id="ec-4", employee_id="demo-employee-01", competency_id="comp-survey-ops", current_level=3.5, score_percentage=80.0, proficiency_tier="ADVANCED"),
        EmployeeCompetency(id="ec-5", employee_id="demo-employee-01", competency_id="comp-quality", current_level=2.5, score_percentage=60.0, proficiency_tier="INTERMEDIATE"),
    ]
    db.add_all(emp1_comps)

    emp1_gaps = [
        SkillGap(id="sg-1", employee_id="demo-employee-01", competency_id="comp-sampling", current_level=2.0, required_level=4.0, gap_score=2.0, severity="CRITICAL", is_critical=True),
        SkillGap(id="sg-2", employee_id="demo-employee-01", competency_id="comp-quality", current_level=2.5, required_level=4.0, gap_score=1.5, severity="DEVELOPING", is_critical=False),
        SkillGap(id="sg-3", employee_id="demo-employee-01", competency_id="comp-stat-methods", current_level=3.2, required_level=4.0, gap_score=0.8, severity="DEVELOPING", is_critical=False),
    ]
    db.add_all(emp1_gaps)
    db.commit()

    # 9. Seed Questions & Options
    questions_data = [
        {
            "id": "q-1",
            "comp_id": "comp-sampling",
            "comp_name": "Survey Sampling",
            "text": "In two-stage stratified sampling, what constitutes the First Stage Unit (FSU) in rural sectors for National Sample Surveys?",
            "difficulty": "MEDIUM",
            "explanation": "In NSS rural surveys, the Census Village is conventionally adopted as the First Stage Unit (FSU).",
            "options": [
                ("A", "Census Village", True),
                ("B", "Individual Household", False),
                ("C", "Hamlet-group selection block", False),
                ("D", "Panchayat Block Headquarters", False)
            ]
        },
        {
            "id": "q-2",
            "comp_id": "comp-sampling",
            "comp_name": "Survey Sampling",
            "text": "What is the key advantage of Probability Proportional to Size (PPS) sampling over Simple Random Sampling?",
            "difficulty": "HARD",
            "explanation": "PPS sampling provides higher inclusion probability to larger units, which significantly stabilizes overall aggregate estimators.",
            "options": [
                ("A", "Reduces variance of aggregate estimates when cluster sizes vary widely", True),
                ("B", "Completely eliminates non-sampling errors in field schedules", False),
                ("C", "Removes the requirement for any sampling frame", False),
                ("D", "Simplifies calculations to pure unweighted averages", False)
            ]
        },
        {
            "id": "q-3",
            "comp_id": "comp-stat-methods",
            "comp_name": "Statistical Methods",
            "text": "Which statistical test is best suited for testing independence of categorical attributes in survey cross-tabulations?",
            "difficulty": "MEDIUM",
            "explanation": "Pearson's Chi-Square Test of Independence is used to evaluate association between two categorical variables in survey tables.",
            "options": [
                ("A", "Chi-Square Test of Independence", True),
                ("B", "Paired Student's t-test", False),
                ("C", "Spearman Rank Correlation", False),
                ("D", "One-Way ANOVA F-test", False)
            ]
        },
        {
            "id": "q-4",
            "comp_id": "comp-data-analysis",
            "comp_name": "Data Analysis",
            "text": "Why are multiplier weights applied to household survey sample datasets before tabulating official aggregates?",
            "difficulty": "MEDIUM",
            "explanation": "Multipliers (inverse probability of selection) inflate the sample values to reflect the overall target universe/population.",
            "options": [
                ("A", "To extrapolate sample totals to universe estimates based on inverse selection probabilities", True),
                ("B", "To correct for arithmetic mistakes made by field investigators", False),
                ("C", "To normalize all survey responses into standard z-scores", False),
                ("D", "To hide private identification markers of responding households", False)
            ]
        },
        {
            "id": "q-5",
            "comp_id": "comp-survey-ops",
            "comp_name": "Survey Operations",
            "text": "When a selected household is temporarily absent during survey fieldwork, what is the mandatory operational protocol?",
            "difficulty": "EASY",
            "explanation": "Field manuals mandate at least three revisits on different days/times before classifying as an uncontacted non-response.",
            "options": [
                ("A", "Perform mandatory return visits at differing times before declaring non-response", True),
                ("B", "Immediately substitute with any neighbor without logging", False),
                ("C", "Delete the sample household record from the frame", False),
                ("D", "Estimate values from the investigator's personal intuition", False)
            ]
        },
        {
            "id": "q-6",
            "comp_id": "comp-quality",
            "comp_name": "Statistical Quality Assurance",
            "text": "What is the standard threshold for Relative Standard Error (RSE) for an official survey estimate to be deemed highly reliable?",
            "difficulty": "HARD",
            "explanation": "Estimates with RSE < 15% are deemed reliable for policy release without reservation.",
            "options": [
                ("A", "RSE strictly below 15%", True),
                ("B", "RSE between 40% and 55%", False),
                ("C", "RSE above 60%", False),
                ("D", "RSE equal to exactly 50%", False)
            ]
        }
    ]

    for q_data in questions_data:
        q = Question(
            id=q_data["id"],
            competency_id=q_data["comp_id"],
            competency_name=q_data["comp_name"],
            question_text=q_data["text"],
            difficulty=q_data["difficulty"],
            status="APPROVED",
            explanation=q_data["explanation"]
        )
        db.add(q)
        db.flush()

        for opt_key, opt_text, is_corr in q_data["options"]:
            opt = QuestionOption(
                id=f"{q.id}-{opt_key.lower()}",
                question_id=q.id,
                option_key=opt_key,
                text=opt_text,
                is_correct=is_corr
            )
            db.add(opt)

    db.commit()

    # 10. Seed Courses (iGOT Aligned)
    courses = [
        Course(
            id="course-nss-sampling",
            code="IGOT-STAT-01",
            title="NSS 78th Round Operational Training",
            description="Comprehensive guide to sample selection, village listing, and multi-stage stratification protocols under NSSTA.",
            provider="iGOT Karmayogi",
            competency_id="comp-sampling",
            target_competency_name="Survey Sampling",
            duration_hours=4.5,
            level="Intermediate",
            rating=4.9,
            modules_count=6,
            is_igot_integrated=True,
            thumbnail_url="/images/course-sampling.png"
        ),
        Course(
            id="course-stat-quality",
            code="IGOT-STAT-02",
            title="Statistical Data Validation & Quality Audits",
            description="Operational standards for data cleaning, consistency verification, and statistical disclosure control in national datasets.",
            provider="iGOT Karmayogi",
            competency_id="comp-quality",
            target_competency_name="Statistical Quality Assurance",
            duration_hours=3.5,
            level="Advanced",
            rating=4.8,
            modules_count=5,
            is_igot_integrated=True
        ),
        Course(
            id="course-survey-multiplier",
            code="IGOT-STAT-03",
            title="Survey Estimation & Multiplier Computation",
            description="Mathematical formulations for weighting, non-response adjustments, and population aggregate derivation.",
            provider="National Statistical Systems Training Academy (NSSTA)",
            competency_id="comp-data-analysis",
            target_competency_name="Data Analysis",
            duration_hours=5.0,
            level="Advanced",
            rating=4.7,
            modules_count=6,
            is_igot_integrated=True
        ),
        Course(
            id="course-field-ops",
            code="IGOT-STAT-04",
            title="Field Supervisory Protocols & Enumerator Leadership",
            description="Methods for oversight, sample re-interviews, and digital CAPI schedule validation in the field.",
            provider="iGOT Karmayogi",
            competency_id="comp-survey-ops",
            target_competency_name="Survey Operations",
            duration_hours=2.5,
            level="Intermediate",
            rating=4.9,
            modules_count=4,
            is_igot_integrated=True
        )
    ]
    db.add_all(courses)
    db.commit()

    # 11. Seed Virtual Labs
    labs = [
        VirtualLab(
            id="lab-sampling-alloc",
            department_id="dept-mospi",
            title="Multi-Stage Stratified Sampling Allocation Lab",
            description="Interactive simulation allowing statistical investigators to adjust stratum sizes, sample sizes, and compute design effect (Deff).",
            difficulty="Intermediate",
            estimated_minutes=35,
            competency_id="comp-sampling",
            target_competency_name="Survey Sampling",
            scenario_type="STRATIFIED_ALLOCATION",
            scenario_data_json=json.dumps({"strata": 4, "population": 250000, "sampleBudget": 1200})
        ),
        VirtualLab(
            id="lab-quality-audit",
            department_id="dept-mospi",
            title="Survey Data Consistency & Range Validation Lab",
            description="Simulated CAPI dataset with deliberate boundary errors and skip-pattern violations for investigator audit.",
            difficulty="Advanced",
            estimated_minutes=45,
            competency_id="comp-quality",
            target_competency_name="Statistical Quality Assurance",
            scenario_type="RANGE_VALIDATION",
            scenario_data_json=json.dumps({"recordsCount": 500, "errorInjectionRate": 0.08})
        )
    ]
    db.add_all(labs)
    db.commit()

    # 12. Seed Leaderboard & Streaks
    for emp in demo_employees:
        lb = LeaderboardEntry(
            id=f"lb-{emp.id}",
            employee_id=emp.id,
            employee_name=emp.name,
            department_name=emp.department.name if emp.department else "National Statistical Office",
            designation=emp.current_role.title if emp.current_role else "Statistical Investigator",
            total_points=500 + int(emp.overall_competency * 8),
            rank=1,
            badges_count=3,
            assessments_completed=2,
            labs_completed=1
        )
        db.add(lb)

        stk = LearningStreak(
            id=f"stk-{emp.id}",
            employee_id=emp.id,
            current_streak=emp.learning_streak_days,
            longest_streak=emp.learning_streak_days + 7,
            total_active_days=emp.learning_streak_days * 2,
            last_activity_date=date.today()
        )
        db.add(stk)

    db.commit()
    print("Database seeding successfully completed.")
