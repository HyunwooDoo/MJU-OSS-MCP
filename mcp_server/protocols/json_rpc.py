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
    #요청 성공 시 반환되는 결과 데이터
    result: Any | None
    #요청과 응답을 매칭하기 위한 선택적 ID
    id: Optional[str | int]
    #JSON-RPC 프로토콜 버전 (고정 값)
    jsonrpc: str = "2.0"
    #요청 실패 시 반환되는 오류 객체 (선택적)
    error: "JSONRPCError | None" = None

#JSON-RPC 2.0 오류 객체를 나타내는 데이터 클래스
@dataclass(slots=True)
class JSONRPCError:
    #오류 코드 번호
    code: int
    #오류에 대한 설명 메시지
    message: str
    #추가적인 오류 데이터 (선택적)
    data: Optional[Dict[str, Any]] = None

#JSON-RPC 에러를 예외 형태로 처리하는 클래스
class JSONRPCException(Exception):
    #오류 객체를 받아 예외 메시지로 설정
    def __init__(self, error: JSONRPCError) -> None:
        #부모 클래스의 생성자 호출 및 오류 객체 저장
        super().__init__(error.message)
        #오류 객체 전체를 속성으로 저장, 예외 발생 시 상세 정보에 접근 가능
        self.error = error