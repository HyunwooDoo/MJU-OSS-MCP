#타입 어노테이션 평가 방식을 변화시키는 모듈
from __future__ import annotations

#로그를 분류하고 관리하기 위한 모듈
import logging

#타입 힌트로 사용되는 모듈
from typing import Any, Dict, List

#HTTP 클라이언트 라이브러리
import httpx

#프로젝트 환경설정 값을 가져오는 모듈
from mcp_server.core.config import get_settings

#외부 항공편 데이터 제공자의 API와 상호작용하는 어댑터 클래스
class ProviderBAdapter:

    #ProviderB API의 기본 URL
    BASE_URL = "https://provider-b.example.com/api/flights"

    #어댑터 초기화 메서드
    def __init__(self) -> None:
        self.settings = get_settings()
        self.logger = logging.getLogger(__name__)

    #비동기적으로 항공편을 검색하는 메서드
    async def search_flights(self, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        
        #Provider B API 키를 설정에서 가져옴
        api_key = self.settings.provider_b_api_key
        
        #API 키가 없으면 경고 로그를 남기고 모의 응답을 반환
        if not api_key:
            self.logger.warning("Provider B API key missing. Using mock response.")
            return self._mock_response(params) if self.settings.enable_mock_providers else []

        #Provider B API에 비동기 GET 요청을 보내고 응답을 처리
        try:
            
            #비동기 HTTP 클라이언트 생성
            async with httpx.AsyncClient(timeout=self.settings.provider_timeout_seconds) as client:
                
                #GET 요청 보내기
                response = await client.get(self.BASE_URL, params={**params, "api_key": api_key})
                
                #HTTP 오류 발생 시 예외로 처리
                response.raise_for_status()
                
                #응답 JSON 데이터 파싱
                data = response.json()
            
            #결과 데이터 반환
            return data.get("results", [])
        
        #HTTP 요청 중 오류가 발생하면 로그 남기기
        except httpx.HTTPError as exc:
            self.logger.error("Provider B API call failed: %s", exc)
            
            #모의 응답 기능 활성화 시 모의 응답 반환
            if self.settings.enable_mock_providers:
                return self._mock_response(params)
            #예외 재전파
            raise

    #모의 응답 생성 메서드
    def _mock_response(self, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        #모의 응답에 사용할 출발지와 도착지 설정
        destination = params.get("destination", "UNKNOWN")
        origin = params.get("origin", "ICN")
        
        #모의 항공편 데이터 반환
        return [
            {
                "origin": origin,
                "destination": destination,
                "departure_date": params.get("departure_date"),
                "return_date": params.get("return_date"),
                "airline": "ProviderB Mock Express",
                "price": 810_000,
            }
        ]