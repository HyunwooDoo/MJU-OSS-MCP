# /app/repositories/saved_flight_repo.py

# List, Optional 등 타입 힌트 표현을 위한 표준 타입들
from typing import List, Optional
# session은 SQLAlchemy에서 DB와 대화하기 위한 핵심 객체
from sqlalchemy.orm import Session
# DB 테이블과 연결된 ORM 모델들이 들어있는 models.py를 import
from app.db import models
# FlightCreate: 클라이언트가 보내는 JSON을 검증하는 "요청용" 스키마
# Flight: DB ORM 객체를 검증된 API 응답 형태로 변환하는 "응답용" 스키마
# API 레이어와 DB 레이어를 깔끔히 분리
from app.schemas.flight_schema import Flight, FlightCreate

# 저장된 항공편을 조회/생성/삭제하는 기능을 한곳에 모아둔 Repository 패턴 클래스
# 라우터에서는 직접 DB 쿼리를 하지 않고, Repository에게 맡기는 구조를 만든다
class SavedFlightRepository:
    # Repository 객체를 만들 때 DB 세션을 넣어줌
    def __init__(self, session: Session) -> None:
        self.session = session
    
    # 저장된 항공편들의 리스트를 반환
    def list_flights(self) -> List[Flight]:
        # SavedFlight 테이블 전체(모든 항공편 레코드)를 리스트로 가져온다
        flights = self.session.query(models.SavedFlight).all()
        # ORM 객체를 Pydantic 객체로 변환
        return [Flight.model_validate(flight) for flight in flights]

    # 새로운 항공편을 저장하고 저장된 항공편 정보를 반환
    def create_flight(self, payload: FlightCreate) -> Flight:
        # 클라이언트가 보낸 값을 그대로 DB 저장형 객체로 만듦
        flight = models.SavedFlight(**payload.model_dump())
        # 방금 만든 ORM 객체를 DB에 저장 대기 상태로 올려놓는다
        self.session.add(flight)
        # 올려놓은 객체를 실제 DB에 반영
        self.session.commit()
        # DB가 자동 생성한 ID를 flight 객체에 반영
        self.session.refresh(flight)
        # DB에 저장된 항공편 정보를 API 응답용 형태로 돌려줌
        return Flight.model_validate(flight)

    # 주어진 ID의 항공편을 삭제하고 성공 여부를 반환
    def delete_flight(self, flight_id: int) -> bool:
        # flight 변수는 해당 ID의 항공편이 있으면 객체, 없으면 None
        flight: Optional[models.SavedFlight] = (
            # SavedFlight 테이블을 조회하는 쿼리 시작
            self.session.query(models.SavedFlight)
            # ID로 항공편을 찾음
            .filter(models.SavedFlight.id == flight_id)
            # 조건에 맞는 첫번째 데이터 1개를 가져온다
            .first()
        )
        # 삭제할 데이터가 없으면 False
        if not flight:
            return False
        # DB 세션에서 해당 항공편 삭제 대기 상태로 올려놓음
        self.session.delete(flight)
        # 삭제 확정
        self.session.commit()
        # 삭제 성공하면 True
        return True
