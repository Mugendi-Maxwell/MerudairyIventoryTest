import os
from dotenv import load_dotenv

load_dotenv() 
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_SERVER = os.getenv("MAIL_SERVER", "mail.mountkenyamilk.co.ke")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "True").lower() in ["true", "1"]
    MAIL_USE_SSL = os.getenv("MAIL_USE_SSL", "False").lower() in ["true", "1"]
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")

class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'dev.db')}"

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}
