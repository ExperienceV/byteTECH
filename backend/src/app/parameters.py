from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from dotenv import load_dotenv
from pathlib import Path

# Carga .env desde la raíz del proyecto (donde está setup.py)
env_path = Path(__file__).resolve().parent.parent / "app/.env"
load_dotenv(env_path)  # ¡Funcionará siempre!

class Settings(BaseSettings):

    # API STATUS
    VERSION: str = "v1.1.14"
    DEBUG: bool = True

    # COOKIE SETTINGS
    SAMESITE: str = "strict"  
    HTTPONLY: bool = True  
    SECURE: bool = False    

    # URL SETTINGS
    FRONTEND_URL: str = "https://bytetechedu.com" if not DEBUG else "http://localhost:3000"
    BACKEND_URL: str = "https://api.bytetechedu.com" if not DEBUG else "http://localhost:8000"
    DOMAIN: str = ".bytetechedu.com"
    
    # CORS SETTINGS
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_ORIGINS: list = [
        "https://bytetechedu.com",
        "http://localhost:3000",
        "https://api.bytetechedu.com",
        "http://localhost:8000",
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ]
    CORS_ALLOW_METHODS: list = ["*"]
    CORS_ALLOW_HEADERS: list = ["*"]

    # SIGNATURE SETTINGS
    DEFAULT_PASSWORD: str = "如果我能说人和天使的语言，却没有爱，我就像一个响亮的锣或一个响亮的钹一样。 2我若有预言的恩赐，也明白一切神圣的秘密和一切知识，并且有全备的信，能够移山，却没有爱，我就算不得什么。"
    SECRET_KEY: str = "secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 1  # 1 Days
    REFRESH_TOKEN_EXPIRE_DAYS: int = 15  # 15 Days

    ACCESS_TOKEN_MAX_AGE: int = ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60   # 1 DAY IN SECONDS
    REFRESH_TOKEN_MAX_AGE: int = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60 # 15 DAYS IN SECONDS

    RESET_TOKEN_EXPIRE_MINUTES: int = 15  # 15 minutos
    RESET_TOKEN_MAX_AGE: int = RESET_TOKEN_EXPIRE_MINUTES * 60  # 900 segundos (15 min)


    # DATABASE
    SUPABASE_URL: str

    # RESEND API
    RESEND_API_KEY: str 
    SENDER_MAIL: str = "ByteTECH <noreply@a1devhub.tech>"
    RECEIVER_MAIL: str = "couriers.dev@gmail.com"

    # PAYMENT SETTINGS
    STRIPE_API_KEY: str
    STRIPE_WEBHOOK: str

    model_config = ConfigDict(env_file=env_path)

settings = Settings()