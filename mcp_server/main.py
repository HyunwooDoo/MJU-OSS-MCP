# 타입 힌트를 나중에 평가하도록 해서 최신 문법·순환 참조 문제를 줄임
from __future__ import annotations

from fastapi import FastAPI, HTTPException
# 프로젝트 공통 설정을 가져오는 설정 로더 함수
from mcp_server.core.config import get_settings
# MCP서버가 따르는 JSON-RPC 프로토콜용 자료형과 예외
from mcp_server.protocols.json_rpc import JSONRPCError, JSONRPCException, JSONRPCRequest, JSONRPCResponse
# 외부 항공권 API 통합 호출 서비스
from mcp_server.services.api_integrator import FlightAPIIntegrator
# 항공권 리스트에서 최저가 항공권을 분석하는 서비스
from mcp_server.services.flight_analyzer import FlightAnalyzer

# FastAPI 앱 인스턴스를 생성
# 모든 엔드포인트(@app.get, @app.post)는 이 객체에 등록
app = FastAPI(title="MCP Server")
# 여러 항공권 API들을 통합해서 호출
integrator = FlightAPIIntegrator()
# 항공편 리스트를 분석
analyzer = FlightAnalyzer()

# JSON-RPC 요청을 처리하는 엔드포인트
# 요청 Body를 JSONRPCRequest 모델로 자동 검증 받고
# 응답도 JSONRPCResponse 모델 형식으로 반환하는 비동기 함수
@app.post("/rpc", response_model=JSONRPCResponse)
async def handle_json_rpc(request: JSONRPCRequest) -> JSONRPCResponse:
    # 모든 JSON-RPC 처리 과정에서 발생하는 예외를 잡아서 에러응답으로 반환
    try:
        # method 값이 searchFlights일 때만 실제 항공권 검색 로직을 실행
        if request.method == "searchFlights":
            params = request.params or {} # params가 None일 경우 오류가 나지않도록 빈 dict로 대체
            # 외부 API에서 항공권 검색하고 리스트를 받아옴
            flights = await integrator.search_flights(params)
            # 받아온 항공권 리스트에서 최저가 항공권을 분석
            cheapest = analyzer.find_cheapest(flights)
            # JSON-RPC규격을 따르는 응답 생성
            return JSONRPCResponse(result={"flights": flights, "cheapest": cheapest}, id=request.id)
        # searchFlights 외의 method가 들어오면 JSON-RPC 방식으로 예외 반환
        raise JSONRPCException(JSONRPCError(code=-32601, message="Method not found"))
    # JSON-RPC 예외는 JSON-RPC 응답 형식으로 반환
    except JSONRPCException as exc:
        return JSONRPCResponse(result=None, id=request.id, error=exc.error)
    # 예상하지 못한 모든 오류는 HTTP 500 서버 에러로 변환
    except Exception as exc:  # pragma: no cover - placeholder for better error handling
        raise HTTPException(status_code=500, detail=str(exc)) from exc

# HTTP GET /health 요청이 들어왔을 때 실행되는 헬스체크 엔드포인트
# 보통 모니터링/로드밸런서가 주기적으로 호출해서 서버가 살아있는지, 기본설정이 정상 로드 되는지 확인시 사용
@app.get("/health")
async def health_check() -> dict[str, str]:
    # 환경변수/설정 파일에서 읽어온 Settings 객체를 가져옴
    settings = get_settings()
    # 서버 상태(ok)와 현재 사용 중인 기본 통화 코드를 함께 반환
    return {"status": "ok", "currency": settings.default_currency}
