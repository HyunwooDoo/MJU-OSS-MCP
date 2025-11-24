# /app/api/v1/search.py

# API 만들 때 자주 쓰는 FastAPI 핵심 도구들을 import
# APIRouter는 FastAPI 라우터 생성용 클래스
# Depends는 FastAPI의 의존성 주입
# HTTPException는 클라이언트 요청 오류가 있을 시 적절한 HTTP 상태코드를 담아 반환
from fastapi import APIRouter, Depends, HTTPException

# 항공편 검색 기능을 FastAPI가 자동으로 만들어서 주입할수 있게 해주는 의존성 함수를 import
from app.core.dependencies import get_llm_service
# 요청/응답 데이터 형식(Pydantic)을 가져온다
# FlightSearchRequest: 클라이언트가 보내는 검색 조건(JSON)의 형식을 정의
# FlightSearchResponse: API가 응답할 때 어떤 형식으로 결과를 반환할지 정의
from app.schemas.search_schema import FlightSearchRequest, FlightSearchResponse
# 실제 항공편 검색 로직을 수행하는 서비스 클래스
from app.services.llm_service import LLMService

# /search를 기본 경로로 갖는 라우터 생성
router = APIRouter(prefix="/search")

# 해당 경로로 POST 요청이 오면 아래 함수 실행
@router.post("/flights", response_model=FlightSearchResponse)
def search_flights(
    # 요청 바디(JSON)를 FlightSearchRequest로 검증 후 받음
    payload: FlightSearchRequest,
    # FastAPI가 get_llm_service()를 실행해서 LLMService 객체(항공편 검색 기능)를 자동으로 함수에 넣음
    # 의존성 주입
    llm_service: LLMService = Depends(get_llm_service),
) -> FlightSearchResponse: # 함수의 최종 반환 타입은 FlightSearchResponse
    try:
        # 검색 서비스(LLMService)에게 항공편 검색 결과 요청
        flights = llm_service.search_flights(payload)
    # 예기치 않은 오류가 발생 시 500 Internal Server Error로 반환
    except Exception as exc:  # pragma: no cover - placeholder for real error handling
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    # 검색 결과 flights를 JSON 응답으로 반환
    return FlightSearchResponse(results=flights)
