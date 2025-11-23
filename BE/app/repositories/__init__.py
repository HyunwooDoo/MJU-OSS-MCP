# /app/repositories/__init__.py

# repositories 패키지의 진입점 역할
# 외부에서 repositories들을 임포트시에 간단하게 가져올수있도록 만들어주는 초기화 모듈
from .saved_flight_repo import SavedFlightRepository