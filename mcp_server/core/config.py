#functools: 파이썬 표준 라이브러리 중 하나로, 함수 관련 보조 기능을 제공 / lru_cache: Least Recently Used Cache 의 약자.
from functools import lru_cache

#typing: 파이썬의 타입 힌트(type hint) 기능을 위한 내장 모듈 / Optional: 값이 None일 수도 있음을 나타내는 타입 힌트
from typing import Optional

#pydantic: 데이터 유효성 검사 및 설정 관리를 위한 파이썬 라이브러리 / BaseSettings: 환경설정 관리를 위한 기본 클래스 / Field: 필드 설정을 할 수 있는 도구
from pydantic import BaseSettings, Field

"""MCP 서버의 환경설정을 정의하는 클래스"""

class MCPSettings(BaseSettings):
   
    # 변수이름 : 값의 타입 = Field(기본값, 설명)
    skyscanner_api_key: Optional[str] = Field(default=None, description="SkyScanner API key")
    provider_b_api_key: Optional[str] = Field(default=None, description="임시 외부 API key 식별자")
    provider_timeout_seconds: int = Field(default=10, description="외부 API를 호출할 때의 타임아웃(시간 제한)")
    default_currency: str = Field(default="USD", description="가격 정규화를 위한 통화(currency) 설정값")
    enable_mock_providers: bool = Field(
        default=True,
        description="외부 제공자 호출 실패 또는 키 누락 시 합성(가짜) 데이터 반환",
    )

    # .env 파일에서 환경변수를 로드하도록 설정
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


"""캐시된 설정 인스턴스를 반환하여 .env 파일 재파싱 방지"""

@lru_cache()

#설정 객체를 불러오는 함수
def get_settings() -> MCPSettings:
    

    return MCPSettings()