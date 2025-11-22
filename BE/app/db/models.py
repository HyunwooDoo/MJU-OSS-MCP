# SQLAlchemy에서 컬럼을 정의할 때 사용하는 타입/클래스들 임포트
from sqlalchemy import Column, Date, Integer, String

# ORM 모델들이 공통으로 상속받는 기반 클래스 임포트
from app.db.database import Base

# SavedFlight 모델 정의: saved_flights 테이블과 매핑되는 ORM 클래스
class SavedFlight(Base):
    __tablename__ = "saved_flights"

    id = Column(Integer, primary_key=True, index=True) # 기본 키 컬럼
    origin = Column(String, nullable=False) # 출발지
    destination = Column(String, nullable=False) # 도착지
    departure_date = Column(Date, nullable=False) # 출발일
    return_date = Column(Date, nullable=True) # 돌아오는 날짜
    airline = Column(String, nullable=True) # 항공사
    price = Column(Integer, nullable=True) # 가격