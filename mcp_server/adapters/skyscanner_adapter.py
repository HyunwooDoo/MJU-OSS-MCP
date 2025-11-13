from __future__ import annotations

import logging
from typing import Any, Dict, List

import requests

from mcp_server.core.config import get_settings


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