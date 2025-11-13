# flight_analyzer.py는 항공편 데이터를 분석하는 기능이 들어있는 모듈

# MCP 서버 내부의 services/flight_analyzer.py의 FlightAnalyzer 클래스를 테스트하는 단위 테스트 모듈
from mcp_server.services.flight_analyzer import FlightAnalyzer

# FlightAnalyzer클래스의 find_cheapest가 항공권데이터(flights)중 가장 싼 항공편을 정확히 찾아 반환하는지 검증
def test_find_cheapest_returns_lowest_price() -> None:
    # 입력 값 : 가격/항공사 정보가 담긴 항공권목록(테스트용)
    flights = [
        {"price": 500000, "airline": "A"},
        {"price": 450000, "airline": "B"},
        {"price": 470000, "airline": "C"},
    ]

    # 항공권분석기 인스턴스 생성
    analyzer = FlightAnalyzer()
    # 가장 싼 항공편 찾아 1건 반환
    cheapest = analyzer.find_cheapest(flights)
    # 반환된 항공편이 예상한 가장 싼 항공편과 일치하는지 검증. 여기선 최저가(450000)인 두 번째 항목을 반환해야 함
    assert cheapest == flights[1]


# 가격 없는 항목(None)이 포함된 항공권목록에서 평균가격을 계산할 때 올바르게 처리하는지 검증
def test_average_price_handles_missing_prices() -> None:
    # 입력 값 : 가격정보가 일부 누락된 항공권목록(테스트용)
    flights = [
        {"price": 500000},
        {"price": None}, # 누락값, 평균계산에서 제외되어야 하는값
        {"price": 700000},
    ]

    # 항공권 분석기 인스턴스 생성
    analyzer = FlightAnalyzer()
    # 동작: 유효한 가격만 취해 평균가를 float으로 계산
    average = analyzer.average_price(flights)
    # 예상 평균가와 일치하는지 검증
    assert average == 600000.0

