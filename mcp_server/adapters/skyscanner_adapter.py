#타입 어노테이션 평가 방식을 변화시키는 모듈
from __future__ import annotations

#로그를 분류하고 관리하기 위한 모듈
import logging

#타입 힌트로 사용되는 모듈
from typing import Any, Dict, List

#HTTP 클라이언트 라이브러리
import requests

#프로젝트 환경설정 값을 가져오는 모듈
from mcp_server.core.config import get_settings

#SkyScanner API와 상호작용하는 어댑터 클래스
class SkyScannerAdapter:

    #SkyScanner API의 기본 URL
    BASE_URL = "https://partners.api.skyscanner.net/apiservices"

    #객체 생성 시 환경설정 및 로깅 도구 초기화
    def __init__(self) -> None:
        self.settings = get_settings()
        self.logger = logging.getLogger(__name__)

    #API를 통해 항공편 검색을 수행하는 메서드
    def search_flights(self, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        
        #환경설정에서 API 키를 가져옴
        api_key = self.settings.skyscanner_api_key
        
        #API 키가 없으면 경고 메시지를 로그로 남김
        if not api_key:
            self.logger.warning("SkyScanner API key missing. Using mock response.")
            
            #모의 응답 기능 활성화 시 모의 응답 반환, 아니면 빈 리스트 반환
            return self._mock_response(params) if self.settings.enable_mock_providers else []

        #API 요청 헤더 설정
        headers = {"x-api-key": api_key}
        try:
            response = requests.get(
                f"{self.BASE_URL}/flights/live/search",
                params=params,
                headers=headers,
                timeout=self.settings.provider_timeout_seconds,
            )
            response.raise_for_status()
            payload = response.json()
            return payload.get("itineraries", [])
        except requests.RequestException as exc:
            self.logger.error("SkyScanner API call failed: %s", exc)
            if self.settings.enable_mock_providers:
                return self._mock_response(params)
            raise

    #모의 응답을 생성하는 내부 메서드
    def _mock_response(self, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        destination = params.get("destination", "UNKNOWN")
        origin = params.get("origin", "ICN")
        return [
            {
                "origin": origin,
                "destination": destination,
                "departure_date": params.get("departure_date"),
                "return_date": params.get("return_date"),
                "airline": "SkyScanner Mock Air",
                "price": 750_000,
            },
            {
                "origin": origin,
                "destination": destination,
                "departure_date": params.get("departure_date"),
                "return_date": params.get("return_date"),
                "airline": "SkyScanner Mock Saver",
                "price": 690_000,
            },
        ]