import os
import secrets
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or secrets.token_urlsafe(32)
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or SECRET_KEY
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///hotspot-billing.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_TOKEN_LOCATION = ("cookies",)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_ACCESS_COOKIE_PATH = "/api/"
    JWT_COOKIE_SECURE = os.environ.get("JWT_COOKIE_SECURE", "false").lower() == "true"
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_COOKIE_CSRF_PROTECT = True