import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.api.v1.router import api_router
from app.seeds.seed_data import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize tables
    Base.metadata.create_all(bind=engine)
    
    # 2. Seed database with deterministic government personas
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

    # 3. Ensure uploads directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade AI-Enabled Learning Platform Backend Integrated with the iGOT Karmayogi Ecosystem (SIH 26101)",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers under both /api and /api/v1 for compatibility
app.include_router(api_router, prefix="/api")
app.include_router(api_router, prefix="/api/v1")

# Mount static uploads if exists
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected"
    }

@app.get("/", tags=["Health"])
def root():
    return {
        "message": "KarmaSiksha Government Platform Backend is active.",
        "documentation": "/docs",
        "health": "/health"
    }
