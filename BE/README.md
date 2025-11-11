# Flight Planner API (백엔드)

## ✅ 사전 준비 사항

- Python 3.11 이상
- `MCP_SERVER_URL`로 접근 가능한 MCP 서버 (선택 사항, 미설정 시 LLMService가 내부 더미 데이터를 사용)

## 🚀 빠른 시작

1. 백엔드 디렉터리 이동
   ```bash
   cd /Users/hyunwoodoo/Desktop/ex/MJU-OSS-MCP/BE
   ```
2. 가상환경 생성 및 활성화
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   ```
3. 의존성 설치
   ```bash
   pip install -r requirements.txt
   ```
4. 환경 변수 템플릿 복사 후 값 설정
   ```bash
   cp env.example .env
   ```
   데이터베이스 경로, MCP 서버 URL, API 키 등을 환경에 맞게 수정하세요.
5. 개발 서버 실행
   ```bash
   uvicorn app.main:app --reload
   ```

기본 주소는 `http://127.0.0.1:8000`이며, REST 엔드포인트는 `/api/v1` 하위에 구성되어 있습니다.

## 🌿 주요 환경 변수

- `DATABASE_URL`: SQLAlchemy 연결 문자열 (기본값: 로컬 SQLite 파일).
- `OPENAI_API_KEY`: MCP 서버 호출 시 Bearer 토큰으로 전달되는 선택적 키.
- `MCP_SERVER_URL`: MCP JSON-RPC 엔드포인트 기본 URL (예: `http://localhost:8001/rpc`).
- `REQUEST_TIMEOUT_SECONDS`: MCP 서버 호출 시 적용할 HTTP 타임아웃(초 단위).

## 🧱 아키텍처 하이라이트

- **FastAPI**가 HTTP 라우팅과 요청 검증을 담당합니다.
- **SQLAlchemy**가 저장된 항공편 정보를 DB에 영속화합니다.
- **LLMService**는 MCP 서버와 연동하여 항공편을 조회하고, 오류 시 더미 데이터를 반환합니다.

### 🗂️ 아키텍처 다이어그램

```
┌──────────────┐      ┌──────────────┐      ┌────────────────┐      ┌────────────────┐
│ FastAPI 앱   │ ───▶ │ API 라우터   │ ───▶ │ 서비스 계층     │ ───▶ │ 저장소 계층     │
│ (app.main)   │      │ (/api/v1)    │      │ (LLMService)   │      │ (SQLAlchemy)   │
└──────────────┘      └──────────────┘      └──────┬─────────┘      └────────┬──────┘
                                                  │                        │
                                                  │                        │
                                         ┌────────▼─────────┐    ┌─────────▼────────┐
                                         │ MCP 서버 RPC 호출│    │ SQLite / RDBMS   │
                                         │ (외부 연동)      │    │ (DATABASE_URL)   │
                                         └──────────────────┘    └──────────────────┘
```

### 📁 디렉터리 구조

```
BE/
├── app/
│   ├── api/
│   │   ├── __init__.py              # API 라우터 등록
│   │   └── v1/
│   │       ├── __init__.py          # 버전 라우터 엔트리
│   │       ├── saved.py             # 저장된 항공편 CRUD 엔드포인트
│   │       └── search.py            # 항공편 검색 엔드포인트
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py                # Pydantic 기반 환경 설정
│   │   └── dependencies.py          # FastAPI 의존성 주입 함수
│   ├── db/
│   │   ├── __init__.py
│   │   ├── database.py              # SQLAlchemy 엔진/세션 팩토리
│   │   └── models.py                # ORM 모델 정의
│   ├── repositories/
│   │   └── saved_flight_repo.py     # 저장소 계층 (CRUD)
│   ├── schemas/
│   │   ├── flight_schema.py         # 항공편 관련 Pydantic 스키마
│   │   └── search_schema.py         # 검색 요청/응답 스키마
│   ├── services/
│   │   └── llm_service.py           # MCP 연동 및 폴백 로직
│   ├── main.py                      # FastAPI 진입점
│   └── __init__.py
├── requirements.txt
├── env.example
└── README.md
```
