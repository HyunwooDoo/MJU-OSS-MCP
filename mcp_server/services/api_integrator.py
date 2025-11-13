# 타입 힌트를 문자열로 처리하여 순방향 참조 문제 해결 
from __future__ import annotations 

# 비동기 프로그래밍을 위한 모듈
import asyncio

# 타입 힌트로 사용되는 모듈
from typing import Any, Dict, List 

# ProviderB API 어댑터
from mcp_server.adapters.api_provider_b_adapter import ProviderBAdapter 

# Skyscanner API 어댑터
from mcp_server.adapters.skyscanner_adapter import SkyScannerAdapter

"""여러 API 제공자들을 동시에 호출해서 응답을 합치는 클래스"""

class FlightAPIIntegrator:
    
    # 외부에서 adapter를 주입받을 수 있고, 없으면 기본값으로 새로 생성하는 생성자
    def __init__(self, skyscanner: SkyScannerAdapter | None = None, provider_b: ProviderBAdapter | None = None) -> None:
        self.skyscanner = skyscanner or SkyScannerAdapter() 
        self.provider_b = provider_b or ProviderBAdapter()
    
    # 파라미터를 받아서, 비동기적으로 여러 API를 호출한 뒤, 항공편 리스트를 결과로 돌려주는 함수
    async def search_flights(self, params: Dict[str, Any]) -> List[Dict[str, Any]]: 
        skyscanner_results = await asyncio.to_thread(self.skyscanner.search_flights, params) # 동기 함수 호출을 비동기적으로 처리 (skyscanner는 동기 함수)
        provider_b_results = await self.provider_b.search_flights(params) # 비동기 함수 직접 호출 (provider_b는 비동기 함수)
        return [*skyscanner_results, *provider_b_results] # 두 결과 리스트를 합쳐서 반환 
    
    # 개선사항 현재는 API 순차 실행 -> 병렬 실행으로 변경 가능 (asyncio.gather 등 사용)