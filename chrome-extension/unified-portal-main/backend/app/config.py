from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "Unified Services Portal"
    DATABASE_URL: str = "sqlite:///./unified_portal.db"
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # WhatsApp Business API Configuration
    WHATSAPP_BUSINESS_ACCOUNT_ID: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    WHATSAPP_API_TOKEN: str = ""
    WHATSAPP_VERIFY_TOKEN: str = "my_secure_token_2024"
    
    # RPA Safety Settings
    RPA_MODE: str = "DEMO"  # DEMO, STAGING, PRODUCTION
    DEMO_BASE_URL: str = "http://localhost:8000/demo-govt"
    
    # Blocked URLs for safety
    BLOCKED_URLS: list = [
        "https://connect.torrentpower.com",
        "https://www.torrentpower.com", 
        "https://www.adanigas.com",
        "https://www.gujaratgas.com",
        "https://ahmedabadcity.gov.in"
    ]
    
    class Config:
        env_file = ".env"

def get_settings():
    return Settings()

settings = get_settings()