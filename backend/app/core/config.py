import os
from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "KarmaSiksha Backend API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # Database: Default to SQLite for seamless local out-of-the-box run, easily overridden by PostgreSQL URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./karmasiksha.db"
    )
    
    # Security
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "karmasiksha-production-super-secret-key-change-in-prod-2026"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ]

    # AI Configuration
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "groq")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # Storage & Uploads
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    MAX_UPLOAD_SIZE_MB: int = 25

    # iGOT Integration
    IGOT_INTEGRATION_MODE: str = os.getenv("IGOT_INTEGRATION_MODE", "demo_adapter")
    IGOT_API_BASE_URL: str = os.getenv("IGOT_API_BASE_URL", "https://api.igot.gov.in/api")
    IGOT_API_KEY: str = os.getenv("IGOT_API_KEY", "")

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"

settings = Settings()
