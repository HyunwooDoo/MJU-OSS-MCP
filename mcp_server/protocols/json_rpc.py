from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional


@dataclass(slots=True)
class JSONRPCRequest:
    """Represents an inbound JSON-RPC 2.0 request."""

    method: str
    params: Optional[Dict[str, Any]] = None
    id: Optional[str | int] = None
    jsonrpc: str = "2.0"


@dataclass(slots=True)
class JSONRPCResponse:
    """Represents a JSON-RPC 2.0 response."""

    result: Any | None
    id: Optional[str | int]
    jsonrpc: str = "2.0"
    error: "JSONRPCError | None" = None


@dataclass(slots=True)
class JSONRPCError:
    """Represents a JSON-RPC 2.0 error object."""

    code: int
    message: str
    data: Optional[Dict[str, Any]] = None


class JSONRPCException(Exception):
    def __init__(self, error: JSONRPCError) -> None:
        super().__init__(error.message)
        self.error = error