from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    auth_service_url: str
    core_service_url: str
    frontend_url: str = "http://localhost:3000"
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    environment: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
