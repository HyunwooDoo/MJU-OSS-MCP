# SQLAlchemy 엔진 생성 함수 임포트 (DB와의 실제 연결을 담당)
from sqlalchemy import create_engine

# ORM 모델의 기반 클래스와 세션 팩토리 생성 함수 임포트
from sqlalchemy.orm import declarative_base, sessionmaker

# 환경 설정에서 DATABASE_URL 등을 불러오는 함수 임포트
from app.core.config import get_settings

# 설정 객체 생성 
settings = get_settings()

# 데이터베이스 연결 URL 가져오기
database_url = settings.database_url

# SQLAlchemy 엔진 생성
# - SQLite의 경우 멀티스레드 접근을 허용하기 위해 check_same_thread 옵션 비활성화
# - 다른 DB는 별도 옵션 없이 기본 설정 사용
engine = create_engine(
    database_url,
    connect_args={"check_same_thread": False} if database_url.startswith("sqlite") else {},
)

# 세션 팩토리(SessionLocal) 생성
# - autocommit=False  → 트랜잭션은 수동으로 commit해야 함
# - autoflush=False   → flush 자동 실행 방지
# - bind=engine       → 위에서 생성한 엔진에 연결된 세션 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ORM 모델들이 상속할 기본 Base 클래스
Base = declarative_base()
