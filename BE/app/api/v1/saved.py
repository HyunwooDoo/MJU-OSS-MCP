# /app/api/v1/saved.py
# 저장된 항공편 관련된 CRUD API를 제공하는 라우터 모듈
# 저장된 항공편 목록 조회(READ), 저장(CREATE), 삭제(DELETE)를 처리

# 타입 힌트에 사용할 리스트 제네릭 타입
from typing import List

# APIRouter는 FastAPI 라우터 생성용 클래스
# Depends는 FastAPI의 의존성 주입
# HTTPException는 클라이언트 요청 오류가 있을 시 적절한 HTTP 상태코드를 담아 반환
from fastapi import APIRouter, Depends, HTTPException
# Session 타입은 SQLAlchemy DB 세션 객체를 의미
from sqlalchemy.orm import Session

# DB 세션을 생성해주는 의존성 함수
from app.core.dependencies import get_db
# 저장된 항공편 정보를 DB에서 C, R, D 처리하는 Repository 클래스
from app.repositories.saved_flight_repo import SavedFlightRepository
# Flight, FlightCreate: API 요청/응답에 사용하는 Pydantic 스키마
from app.schemas.flight_schema import Flight, FlightCreate

# /saved를 기본 경로로 하는 라우터 생성
router = APIRouter(prefix="/saved")

# 저장된 항공편 리스트 조회 API
# /v1/saved/flights URL로 GET 요청이 오면 list_saved_flights함수를 실행
@router.get("/flights", response_model=List[Flight])
def list_saved_flights(
		# FastAPI가 get_db()를 실행하여 DB 세션 만들어서 함수에 넣어준다
    db: Session = Depends(get_db),
) -> List[Flight]:
		# 이 db 세션을 Repository에게 전달
    repository = SavedFlightRepository(db)
    # Repository가 DB에서 데이터 가져와서 반환
    return repository.list_flights()

# /v1/saved/flights 주소로 POST 요청이 오면 save_flight함수를 실행
# 새로운 항공권을 저장하라는 요청을 처리하는 API.
@router.post("/flights", response_model=Flight, status_code=201)
def save_flight(
		# 요청 바디(JSON)를 FlightCreate 스키마로 검증하여 payload로 받는다
    payload: FlightCreate,
    #  FastAPI가 get_db()를 실행하여 DB 세션 만들어서 함수에 넣어준다
    db: Session = Depends(get_db),
) -> Flight:
		# 이 db 세션을 Repository에게 전달
    repository = SavedFlightRepository(db)
    # 저장된 항공편 정보를 Flight 모델 형태로 반환
    return repository.create_flight(payload)

# /v1/saved/flights/3 같은 URL로 DELETE 요청이 오면 이 함수가 실행
# {flight_id}는 삭제할 항공편의 ID
# 삭제 성공하면 status_code=204(성공응답)
@router.delete("/flights/{flight_id}", status_code=204)
def delete_flight(
		# 삭제할 객체의 ID
    flight_id: int,
    # #  FastAPI가 get_db()를 실행하여 DB 세션 만들어서 함수에 넣어준다
    db: Session = Depends(get_db),
) -> None:
		# DB 세션을 전달해서 repository를 준비
    repository = SavedFlightRepository(db)
    # Repository에게 이 ID를 가진 항공편 삭제하라고 요청
    deleted = repository.delete_flight(flight_id)
    # 삭제 실패시
    if not deleted:
		    # 404 Not Found 에러를 클라이언트에게 던짐
        raise HTTPException(status_code=404, detail="Flight not found")