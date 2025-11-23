
from collections.abc import Generator

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.db.database import SessionLocal
from app.services.llm_service import LLMService


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_llm_service(settings: Settings = Depends(get_settings)) -> LLMService:
    return LLMService(
        api_key=settings.openai_api_key,
        rpc_url=settings.mcp_server_url,
        timeout_seconds=settings.request_timeout_seconds,
    )
