# /app/api/v1/__init__.py
# v1 버전의 API를 하나로 묶어주는 초기화 모듈

# FastAPI에서 여러 엔드포인트를 하나로 묶는 라우터 객체를 생성하기 위해 필요한 클래스를 가져온다
from fastapi import APIRouter
# v1 안에 있는 saved.py와 search.py모듈(각각 서브 라우터 포함)을 불러온다
from . import saved, search

# 이 라우터에 포함되는 모든 API는 /api/v1부터 시작
router = APIRouter(prefix="/v1")
# search.py 안에 있는 라우터들을 현재 v1 라우터에 포함
# Swagger 문서에서 이 엔드포인트들을 search그룹으로 구분해서 보여준다
router.include_router(search.router, tags=["search"])
# saved.py 안의 라우터들을 v1 라우터에 포함
# Swagger 문서에서 이 엔드포인트들을 saved그룹으로 구분해서 보여준다
router.include_router(saved.router, tags=["saved"])