# /app/api/__init__.py
# 여러버전의 API(v1, v2 등등)를 한군데로 묶어서 FastAPI 앱에 연결해주는 곳이다

# FastAPI가 제공하는 라우터 객체를 가져오는 코드
from fastapi import APIRouter
# v1 폴더 안에 정의된 router를 불러온다.
from .v1 import router as v1_router

# /api로 시작하는 상위 라우터 객체를 생성
api_router = APIRouter(prefix="/api")
# /api아래 /v1 라우터를 포함시킨다
api_router.include_router(v1_router)