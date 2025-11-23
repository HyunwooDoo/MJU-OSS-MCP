# 날짜 타입(date)을 사용하기 위해 임포트
from datetime import date

# 응답에서 Flight 리스트 타입을 위해 임포트
from typing import List

# Pydantic의 BaseModel 임포트
from pydantic import BaseModel

# 검색 결과에 포함될 Flight 스키마 임포트
from app.schemas.flight_schema import Flight

# 항공권 검색 요청 데이터를 정의하는 스키마
class FlightSearchRequest(BaseModel):
    origin: str                     # 출발지
    destination: str                # 도착지
    departure_date: date            # 출발일
    return_date: date | None = None # 돌아오는 날짜 (없으면 None)
    passengers: int = 1             # 승객 수 (기본값 1)


# 항공권 검색 응답 데이터를 정의하는 스키마
class FlightSearchResponse(BaseModel):
    results: List[Flight]           # 검색된 결과 리스트
