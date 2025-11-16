#타입 어노테이션 평가 방식을 변화시키는 모듈
from __future__ import annotations

#데이터 클래스를 정의하기 위한 모듈
from dataclasses import dataclass

#타입 힌트로 사용되는 모듈
from typing import Any, Dict, Optional

#JSON-RPC 2.0 요청을 나타내는 데이터 클래스
@dataclass(slots=True)
class JSONRPCRequest:
    #요청할 메서드 이름
    method: str
    #선택적 매개변수 딕셔너리
    params: Optional[Dict[str, Any]] = None
    #선택적 요청 ID
    id: Optional[str | int] = None
    #JSON-RPC 버전 고정 값
    jsonrpc: str = "2.0"

#JSON-RPC 2.0 응답을 나타내는 데이터 클래스
@dataclass(slots=True)
class JSONRPCResponse:
    #응답
    result: Any | None
    #선택적 응답 ID
    id: Optional[str | int]
    #JSON-RPC 버전 고정 값
    jsonrpc: str = "2.0"
    #선택적 오류 객체
    error: "JSONRPCError | None" = None

#JSON-RPC 2.0 오류 객체를 나타내는 데이터 클래스
@dataclass(slots=True)
class JSONRPCError:
    code: int
    message: str
    data: Optional[Dict[str, Any]] = None

#JSON-RPC 에러를 예외 형태로 처리하는 클래스
class JSONRPCException(Exception):
    def __init__(self, error: JSONRPCError) -> None:
        super().__init__(error.message)
        self.error = error