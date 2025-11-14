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
    """Adapter responsible for communicating with the SkyScanner Flights API."""

    BASE_URL = "https://partners.api.skyscanner.net/apiservices"

    def __init__(self) -> None:
        self.settings = get_settings()
        self.logger = logging.getLogger(__name__)

    def search_flights(self, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        api_key = self.settings.skyscanner_api_key
        if not api_key:
            self.logger.warning("SkyScanner API key missing. Using mock response.")
            return self._mock_response(params) if self.settings.enable_mock_providers else []

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