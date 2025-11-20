#타입 어노테이션 평가 방식을 변화시키는 모듈
from __future__ import annotations

#로그 기록에 필요한 표준 로깅 모듈
import logging

#날짜 데이터 처리를 위한 표준 모듈
from datetime import date

#타입 힌트로 사용되는 모듈
from typing import Any, Dict, Iterable, List, Optional

#HTTP 요청을 보내기 위한 외부 라이브러리
import httpx

#항공권 도메인 모델 Flight
from app.schemas.flight_schema import Flight
from app.schemas.search_schema import FlightSearchRequest

#항공권 검색 기능을 MCP 버서와 연동하는 주요 서비스 클래스
class LLMService:

    #초기화 메서드 / API 키, RPC URL, 타임아웃 시간 초기화
    def __init__(
        self,
        api_key: str | None = None,
        rpc_url: str | None = None,
        timeout_seconds: int = 10,
    ) -> None:
        self.api_key = api_key
        self.rpc_url = rpc_url
        self.timeout_seconds = timeout_seconds
        self.logger = logging.getLogger(__name__)

    #항공권 검색 요청 처리 메서드
    #MCP와 통신하여 항공권 정보를 가져오거나, 실패 시 기본 항공권 정보를 반환
    def search_flights(self, request: FlightSearchRequest) -> List[Flight]:
        #결과 항공권 리스트 초기화
        flights: List[Flight] = []

        #MCP URL이 설정된 경우 MCP로부터 항공권 정보 요청
        if self.rpc_url:
            try:
                flights = self._fetch_from_mcp(request)
           #호출 실패 시 경고 로그 기록
           #혹시 모를 예외 상황에 대비한 방어적 코드
            except Exception as exc:  # pragma: no cover - defensive
                self.logger.warning(
                    "Falling back to local flight suggestion due to MCP error: %s", exc
                )

        #MCP 호출 실패 또는 결과가 없을 경우 기본 항공권 정보 생성
        if not flights:
            flights = [self._build_fallback_flight(request)]
        
        #최종 항공권 리스트 반환
        return flights

    #MCP 서버에 JSON-RPC 요청을 보내 항공권 정보를 받아 Flight 객체 리스트로 변환 및 반환
    def _fetch_from_mcp(self, request: FlightSearchRequest) -> List[Flight]:
        #JSON-RPC 요청 메시지 구성
        payload = {
            "jsonrpc": "2.0",
            "method": "searchFlights",
            "params": self._build_params(request),
            "id": "flight-search",
        }

        #Content-Type 헤더 지정 
        #API 키가 있으면 Authorization 헤더 추가
        headers: Dict[str, str] = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        #MCP 서버에 POST 요청 전송
        response = httpx.post(
            self.rpc_url,
            json=payload,
            headers=headers,
            timeout=self.timeout_seconds,
        )
        response.raise_for_status()

        #응답 중 에러 정보 확인 및 예외 처리
        data = response.json()
        error = data.get("error")
        if error:
            message = error.get("message", "Unknown MCP error")
            raise RuntimeError(message)

        #결과 데이터에서 항공권 정보 추출 및 매핑
        flights_data = data.get("result", {}).get("flights", [])
        return self._map_flights(request, flights_data)

    #FlightSearchRequest 객체를 JSON-RPC 호출에 필요한 파라미터 딕셔너리로 변환
    def _build_params(self, request: FlightSearchRequest) -> Dict[str, Any]:
        #요청 파라미터 구성
        params: Dict[str, Any] = {
            "origin": request.origin,
            "destination": request.destination,
            "departure_date": request.departure_date.isoformat(),
            "return_date": request.return_date.isoformat() if request.return_date else None,
            "passengers": request.passengers,
        }
        #None 값이 아닌 파라미터만 필터링하여 반환
        return {key: value for key, value in params.items() if value is not None}

    #MCP로부터 받은 항공권 데이터를 Flight 객체 리스트로 매핑
    def _map_flights(
        self,
        request: FlightSearchRequest,
        flights: Iterable[Dict[str, Any]],
    ) -> List[Flight]:
        #매핑된 Flight 객체를 담을 리스트 초기화
        mapped: List[Flight] = []

        #각 항공권 데이터를 순회하며 Flight 객체로 변환
        for index, flight_data in enumerate(flights, start=1):
            mapped.append(
                Flight(
                    id=index,
                    origin=self._coalesce(flight_data.get("origin"), request.origin),
                    destination=self._coalesce(
                        flight_data.get("destination"), request.destination
                    ),
                    departure_date=self._parse_date(
                        flight_data.get("departure_date"),
                        request.departure_date,
                    ),
                    return_date=self._parse_optional_date(
                        flight_data.get("return_date"), request.return_date
                    ),
                    airline=self._coalesce(
                        flight_data.get("airline") or flight_data.get("carrier"),
                        "Unknown Airline",
                    ),
                    price=self._parse_price(flight_data.get("price")),
                )
            )

        #매핑된 Flight 객체 리스트 반환
        return mapped

    #MCP 오류 시 기본 대체용 Flight 객체 생성
    def _build_fallback_flight(self, request: FlightSearchRequest) -> Flight:
        #기본 대체용 Flight 객체 생성 및 반환
        return Flight(
            id=0,
            origin=request.origin,
            destination=request.destination,
            departure_date=request.departure_date,
            return_date=request.return_date,
            airline="Demo Airline",
            price=0,
        )

    #입력값이 None 또는 빈 문자열일 경우 기본값 반환
    @staticmethod
    def _coalesce(value: Optional[Any], default: Any) -> Any:
        return value if value not in (None, "") else default

    #입력 값이 date 객체인지 확인, 문자열이면 ISO 형식으로 파싱
    #변환 실패 혹은 유효하지 않은 타입일 경우 기본값 반환
    @staticmethod
    def _parse_date(value: Any, default: date) -> date:
        if isinstance(value, date):
            return value
        if isinstance(value, str):
            try:
                return date.fromisoformat(value)
            except ValueError:
                return default
        return default

    #입력값이 None일 경우 기본값 반환
    #날짜 객체 또는 ISO 형식 문자열일 경우 date 객체로 안전하게 변환 및 반환
    @staticmethod
    def _parse_optional_date(value: Any, default: Optional[date]) -> Optional[date]:
        if value is None:
            return default
        if isinstance(value, date):
            return value
        if isinstance(value, str):
            try:
                return date.fromisoformat(value)
            except ValueError:
                return default
        return default

    #가격 필드 값이 None일 경우 None 반환
    #정수, 실수, 문자열 형태의 숫자 값을 안전하게 정수로 변환하여 반환
    @staticmethod
    def _parse_price(value: Any) -> Optional[int]:
        if value is None:
            return None
        if isinstance(value, (int, float)):
            return int(value)
        if isinstance(value, str):
            digits = "".join(ch for ch in value if ch.isdigit())
            if digits:
                return int(digits)
        return None
