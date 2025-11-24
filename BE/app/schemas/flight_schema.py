
# 날짜 타입 사용을 위해 datetime 모듈에서 date를 임포트
from datetime import date

# Pydantic 스키마의 기반 클래스 임포트
from pydantic import BaseModel

# 항공권 정보의 공통 필드를 정의하는 기반(Base) 스키마
class FlightBase(BaseModel):
    origin: str  # 출발지
    destination: str # 도착지
    departure_date: date # 출발일
    return_date: date | None = None # 돌아오는 날짜 (없으면 None)
    airline: str | None = None # 항공사 (없으면 None)
    price: int | None = None # 가격 (없으면 None)

# 항공권 생성(Create) 요청 시 사용하는 스키마
# 별도 필드는 없고 FlightBase 필드를 그대로 사용함
class FlightCreate(FlightBase):
    pass

# 항공권 조회(Read) 시 응답으로 사용되는 스키마
class Flight(FlightBase):
    id: int  # 항공권 고유 ID

# Pydantic 모델이 ORM 모델과 호환되도록 설정
    class Config: 
        from_attributes = True # ORM 모델 객체를 Pydantic 모델로 변환하는 기능 활성화
