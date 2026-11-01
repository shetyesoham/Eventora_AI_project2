import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Eventora AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Gemini AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Supabase / Database
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./eventora.db")
    
    # Integrations
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "eventora-super-secret-key-change-in-prod-2026")
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app"
    ]

    model_config = {
        "env_file": ".env",
        "extra": "allow"
    }

settings = Settings()

