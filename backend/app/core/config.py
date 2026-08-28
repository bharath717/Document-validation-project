from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AI Document Validation API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/document_validation"

    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: str = ".jpg,.jpeg,.png,.pdf"
    UPLOAD_DIR: str = "uploads"

    class Config:
        env_file = ".env"


settings = Settings()