#Generator 타입 힌트를 위해 collections.abc에서 Generator 임포트
from collections.abc import Generator

#FastAPI의 의존성 주입 기능을 위해 Depends 임포트
from fastapi import Depends

#SQLAlchemy의 세션 관리를 위해 Session 임포트
from sqlalchemy.orm import Session

#앱 설정 관리용 Settings 클래스 및 설정 객체 반환 함수 임포트
from app.core.config import Settings, get_settings

#SQLAlchemy 데이터베이스 세션 생성용 SessionLocal 임포트
from app.db.database import SessionLocal

#항공권 검색 서비스 LLMService 클래스 임포트
from app.services.llm_service import LLMService

#데이터베이스 세션을 생성, 관리하는 의존성 주입 함수
def get_db() -> Generator[Session, None, None]:
    #새 DB 세션 생성
    #yidld를 사용해 요청 처리 함수에 세션 객체를 전달
    #세션 사용 후 반드시 닫히도록 finally 블록에서 자원 해제 및 세션 종료
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#LLMService 인스턴스를 생성하여 반환하는 의존성 주입 함수
def get_llm_service(settings: Settings = Depends(get_settings)) -> LLMService:
    return LLMService(
        api_key=settings.openai_api_key,
        rpc_url=settings.mcp_server_url,
        timeout_seconds=settings.request_timeout_seconds,
    )
