# 타입 힌트를 문자열로 처리하여 순방향 참조 문제 해결
from __future__ import annotations

# 평균을 계산하기 위한 표준 라이브러리
from statistics import mean

# 타입 힌트로 사용되는 모듈 
from typing import Dict, List

""" 가장 싼 항공편 데이터 분석을 위한 유틸리티 클래스 """

class FlightAnalyzer:
    
    # 항공편 목록에서 가장 저렴한 항공편을 찾아 반환하는 함수
    def find_cheapest(self, flights: List[Dict[str, int]]) -> Dict[str, int] | None:
        if not flights:
            return None
        
        # 가격이 없는 항목은 무한대로 간주하여 가장 싼 항공편에서 제외
        return min(flights, key=lambda flight: flight.get("price", float("inf"))) 
    
    # 항공편 목록에서 평균 가격을 계산하여 반환하는 함수
    def average_price(self, flights: List[Dict[str, int]]) -> float | None: 
        prices = [flight.get("price") for flight in flights if flight.get("price") is not None] # 가격이 None이 아닌 항공편의 가격만 추출
        if not prices: #가격이 없는 경우 None 반환
            return None
        return float(mean(prices)) # 평균 가격을 계산하여 반환