# 비동기 함수 실행을 위한 내장 모듈
import asyncio
# 테스트 자동화 프레임 워크(테스트 실행용)
import pytest

# MCP 서버의 어댑터 클래스(항공권 API 연동용)를 불러옴
from mcp_server.adapters.api_provider_b_adapter import ProviderBAdapter
from mcp_server.adapters.skyscanner_adapter import SkyScannerAdapter

# Skyscanner API 키가 없는 환경을 가정하고 mock 데이터가 반환되는지 테스트하는 함수
# 동기요청으로 받아온 응답을 어댑터에서 표준 구조로 가공해서 반환하는지 확인
def test_skyscanner_adapter_returns_mock_without_api_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("SKYSCANNER_API_KEY", raising=False) # SKYSCANNER_API_KEY라는 환경 변수를 삭제해서 API키가 없도록 만든다 -> 이 테스트 실행 중에는 없는 것처럼 위장
    # Skyscanner API에 연결하는 어댑터 객체 생성
    adapter = SkyScannerAdapter()

    # 실제로 항공권 데이터를 가져오는 함수. 현재는 mock 데이터를 반환(인천->나리타 mock검색 실행)
    results = adapter.search_flights({"origin": "ICN", "destination": "NRT"})
    # assert를 활용해 결과가 비어있지 않은지 확인
    assert results, "Expected mock results when API key is missing"

# Provider B API 키가 없는 환경을 가정하고 mock 데이터가 반환되는지 테스트하는 함수
# 비동기요청으로 받아온 응답을 어댑터에서 표준 구조로 가공해서 반환하는지 확인
def test_provider_b_adapter_returns_mock_without_api_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("PROVIDER_B_API_KEY", raising=False) # 환경 변수를 삭제해서 API키가 없도록 만든다 
    adapter = ProviderBAdapter() # Provider B 어댑터 인스턴스 생성

    # 비동기 search_flights를 동기 테스트에서 실행
    results = asyncio.run(adapter.search_flights({"origin": "ICN", "destination": "HND"}))
    # assert를 활용해 결과가 비어있지 않은지 확인
    assert results, "Expected mock results when API key is missing"

