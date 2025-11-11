# MCP Server (MCP 서버)

다중 외부 항공편 공급자 데이터를 집계하여 `POST /rpc` JSON-RPC 인터페이스로 제공하는 FastAPI 기반 서버입니다.

## 🚀 빠른 시작

1. 의존성 설치
   ```bash
   cd /Users/hyunwoodoo/Desktop/ex/MJU-OSS-MCP/mcp_server
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. 환경 변수 설정
   ```bash
   cp env.example .env
   ```
   실제 API 키가 있다면 입력하고, `ENABLE_MOCK_PROVIDERS=true` 상태에서는 키가 없어도 모의 데이터가 반환되어 오프라인 개발이 가능합니다.
3. 서버 실행
   ```bash
   uvicorn mcp_server.main:app --reload --port 8001
   ```

## 🌿 주요 환경 변수

- `SKYSCANNER_API_KEY`: SkyScanner 호출에 필요한 API 키.
- `PROVIDER_B_API_KEY`: 보조 공급자(Provider B) 호출에 필요한 API 키.
- `PROVIDER_TIMEOUT_SECONDS`: 외부 API 호출 타임아웃(초 단위, 기본값 10초).
- `DEFAULT_CURRENCY`: 응답에 사용할 기본 통화(기본값 USD).
- `ENABLE_MOCK_PROVIDERS`: `true`일 경우 키가 없거나 호출 실패 시에도 모의 데이터를 반환.

## 🧱 아키텍처

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│ FastAPI 애플리케이션 │ ─▶ │ JSON-RPC 처리기         │ ─▶ │ FlightAPIIntegrator │
│ (/rpc, /health)  │     │ (handle_json_rpc)    │     │ (비동기 통합 오케스트레이션) │
└─────────────────┘     └─────────┬────────────┘     └─────────┬───────────┘
                                  │                              │
                                  │                              │
                        ┌─────────▼──────────┐        ┌──────────▼──────────┐
                        │ SkyScannerAdapter  │        │ ProviderBAdapter     │
                        │ (requests + 모의)  │        │ (httpx + 모의)       │
                        └─────────┬──────────┘        └──────────┬──────────┘
                                  │                              │
                                  ▼                              ▼
                      SkyScanner 외부 API             Provider B 외부 API
                      (또는 모의 응답)                (또는 모의 응답)
```

## 📁 디렉터리 구조

```
mcp_server/
├── adapters/
│   ├── __init__.py
│   ├── api_provider_b_adapter.py    # 비동기 Provider B 어댑터 (httpx)
│   └── skyscanner_adapter.py        # SkyScanner 어댑터 (requests + 모의 응답)
├── core/
│   ├── __init__.py
│   └── config.py                    # Pydantic 설정 및 플래그
├── protocols/
│   ├── __init__.py
│   └── json_rpc.py                  # JSON-RPC 요청/응답 모델
├── services/
│   ├── __init__.py
│   ├── api_integrator.py            # 다중 공급자 응답 병합 로직
│   └── flight_analyzer.py           # 최저가 분석 도우미
├── tests/
│   ├── __init__.py
│   ├── e2e/
│   │   └── __init__.py
│   ├── integration/
│   │   └── __init__.py
│   └── unit/
│       ├── __init__.py
│       ├── test_adapters_mock.py    # 어댑터 모의 데이터 테스트
│       └── test_flight_analyzer.py  # 분석기 단위 테스트
├── main.py                          # FastAPI 진입점
├── requirements.txt
├── env.example
├── Dockerfile
└── README.md
```

## 🧪 테스트

다음 명령으로 단위 테스트를 실행할 수 있습니다.

```bash
pytest
```
