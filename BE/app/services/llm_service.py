
from __future__ import annotations

import logging
from datetime import date
from typing import Any, Dict, Iterable, List, Optional

import httpx

from app.schemas.flight_schema import Flight
from app.schemas.search_schema import FlightSearchRequest


class LLMService:
    """Service responsible for delegating flight searches to an MCP server."""

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

    def search_flights(self, request: FlightSearchRequest) -> List[Flight]:
        flights: List[Flight] = []

        if self.rpc_url:
            try:
                flights = self._fetch_from_mcp(request)
            except Exception as exc:  # pragma: no cover - defensive
                self.logger.warning(
                    "Falling back to local flight suggestion due to MCP error: %s", exc
                )

        if not flights:
            flights = [self._build_fallback_flight(request)]

        return flights

    def _fetch_from_mcp(self, request: FlightSearchRequest) -> List[Flight]:
        payload = {
            "jsonrpc": "2.0",
            "method": "searchFlights",
            "params": self._build_params(request),
            "id": "flight-search",
        }

        headers: Dict[str, str] = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        response = httpx.post(
            self.rpc_url,
            json=payload,
            headers=headers,
            timeout=self.timeout_seconds,
        )
        response.raise_for_status()

        data = response.json()
        error = data.get("error")
        if error:
            message = error.get("message", "Unknown MCP error")
            raise RuntimeError(message)

        flights_data = data.get("result", {}).get("flights", [])
        return self._map_flights(request, flights_data)

    def _build_params(self, request: FlightSearchRequest) -> Dict[str, Any]:
        params: Dict[str, Any] = {
            "origin": request.origin,
            "destination": request.destination,
            "departure_date": request.departure_date.isoformat(),
            "return_date": request.return_date.isoformat() if request.return_date else None,
            "passengers": request.passengers,
        }
        return {key: value for key, value in params.items() if value is not None}

    def _map_flights(
        self,
        request: FlightSearchRequest,
        flights: Iterable[Dict[str, Any]],
    ) -> List[Flight]:
        mapped: List[Flight] = []

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

        return mapped

    def _build_fallback_flight(self, request: FlightSearchRequest) -> Flight:
        return Flight(
            id=0,
            origin=request.origin,
            destination=request.destination,
            departure_date=request.departure_date,
            return_date=request.return_date,
            airline="Demo Airline",
            price=0,
        )

    @staticmethod
    def _coalesce(value: Optional[Any], default: Any) -> Any:
        return value if value not in (None, "") else default

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
