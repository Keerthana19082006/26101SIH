from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.employees import router as employees_router
from app.api.v1.competencies import router as competencies_router
from app.api.v1.assessments import router as assessments_router
from app.api.v1.courses import router as courses_router
from app.api.v1.learning_paths import router as learning_paths_router
from app.api.v1.labs import router as labs_router
from app.api.v1.passport import router as passport_router
from app.api.v1.streak import router as streak_router
from app.api.v1.leaderboard import router as leaderboard_router
from app.api.v1.future_roles import router as future_roles_router
from app.api.v1.trainers import router as trainers_router
from app.api.v1.mcqs import router as mcqs_router
from app.api.v1.documents import router as documents_router
from app.api.v1.community import router as community_router
from app.api.v1.workforce import router as workforce_router
from app.api.v1.assistant import router as assistant_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.integrations import router as integrations_router
from app.api.v1.ai import router as ai_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(employees_router)
api_router.include_router(competencies_router)
api_router.include_router(assessments_router)
api_router.include_router(courses_router)
api_router.include_router(learning_paths_router)
api_router.include_router(labs_router)
api_router.include_router(passport_router)
api_router.include_router(streak_router)
api_router.include_router(leaderboard_router)
api_router.include_router(future_roles_router)
api_router.include_router(trainers_router)
api_router.include_router(mcqs_router)
api_router.include_router(documents_router)
api_router.include_router(community_router)
api_router.include_router(workforce_router)
api_router.include_router(assistant_router)
api_router.include_router(notifications_router)
api_router.include_router(integrations_router)
api_router.include_router(ai_router)
