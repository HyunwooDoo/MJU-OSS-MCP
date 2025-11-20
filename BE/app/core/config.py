#functools의 lru_cache를 사용하여 설정 객체 캐시 구현
from functools import lru_cache

#Optional 타입 지정을 위해 typing 모듈에서 Optional을 임포트
from typing import Optional

#pydantic의 BaseSettings와 Field를 임포트하여 설정 클래스 정의에 활용
from pydantic import BaseSettings, Field

#Settings 클래스를 정의하여 애플리케이션 설정을 관리
class Settings(BaseSettings):
    
    #애플리케이션 이름, 기본값, 설명 포함
    app_name: str = Field(default="Flight Planner API", description="Application name")
    
    #데이터베이스 연결 문자열, 기본값, 설명 포함
    database_url: str = Field(
        default="sqlite:///./app.db",
        description="Database connection string",
    )
    #LLM 제공자의 API 키, 기본값 None, 설명 포함
    openai_api_key: Optional[str] = Field(
        default=None,
        description="API key for the LLM provider",
    )
    #MCP JSON-RPC 엔드포인트의 기본 URL, 기본값 None, 설명 포함
    mcp_server_url: Optional[str] = Field(
        default=None,
        description="Base URL of the MCP JSON-RPC endpoint",
    )
    #외부 HTTP 요청에 대한 타임아웃 설정(초 단위), 기본값 10초, 설명 포함
    request_timeout_seconds: int = Field(
        default=10,
        description="Timeout (in seconds) for outbound HTTP requests",
    )

    #Pydantic의 Config 클래스를 사용하여 .env 파일 및 인코딩 설정 지정
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

#애플리케이션 전반에 걸쳐 단일 설정 인스턴스를 빠르게 가져오기 위한 캐시 함수 정의
@lru_cache()
def get_settings() -> Settings:
    return Settings()
