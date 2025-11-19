#FastAPI 프레임워크 임포트
from fastapi import FastAPI

#API 라우터 및 데이터베이스 설정 임포트
from app.api import api_router

#DB 베이스 모델 및 엔진 임포트
from app.db import Base, engine

#모든 DB 테이블을 엔진에 바인딩하여 생성
Base.metadata.create_all(bind=engine)

#FastAPI 애플리케이션 객체 생성
app = FastAPI(title="Flight Planner API")

#API 라우터를 애플리케이션에 등록하여 엔드포인트를 제공
app.include_router(api_router)