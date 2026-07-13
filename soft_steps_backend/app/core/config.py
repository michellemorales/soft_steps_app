from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "soft_steps_db"
    
    # JWT Settings
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # API Settings
    API_V1_PREFIX: str = "/api"
    PROJECT_NAME: str = "Soft Steps API"

    #Gemini
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-3.1-flash-lite"
    GEMINI_TEMPERATURE: float = 1.0
    
    class Config:
        env_file = ".env"

settings = Settings()