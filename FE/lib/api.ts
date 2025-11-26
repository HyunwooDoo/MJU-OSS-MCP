import type { FlightData, SavedTrip } from "@/types";
import { destinations } from "@/constants";

// MCP 서버 기본 URL (환경 변수로 설정 가능)
const MCP_SERVER_URL =
  process.env.NEXT_PUBLIC_MCP_SERVER_URL || "http://localhost:8001";

// BE 서버 기본 URL (환경 변수로 설정 가능)
const BE_SERVER_URL =
  process.env.NEXT_PUBLIC_BE_SERVER_URL || "http://localhost:8000";

// mcp_server 응답 형식
interface MCPFlight {
  origin: string;
  destination: string;
  departure_date?: string;
  return_date?: string;
  airline: string;
  price: number;
}

interface MCPResponse {
  jsonrpc: string;
  result?: {
    flights: MCPFlight[];
    cheapest?: MCPFlight;
  };
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: string | number;
}

// 항공사 코드 매핑 (항공사 이름에서 코드 추출)
const getAirlineCode = (airlineName: string): string => {
  const airlineMap: Record<string, string> = {
    대한항공: "KE",
    아시아나항공: "OZ",
    에어프랑스: "AF",
    루프트한자: "LH",
    일본항공: "JL",
    전일본공수: "ANA",
    에미레이트: "EK",
    카타르항공: "QR",
    싱가포르항공: "SQ",
  };

  for (const [name, code] of Object.entries(airlineMap)) {
    if (airlineName.includes(name)) {
      return code;
    }
  }

  // 기본값: 항공사 이름의 첫 2글자를 대문자로
  return airlineName
    .substring(0, 2)
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
};

// mcp_server 응답을 FE의 FlightData 형식으로 변환
const transformMCPFlightToFlightData = (
  mcpFlight: MCPFlight,
  index: number,
  duration: number
): FlightData => {
  // 날짜 파싱
  const departureDate = mcpFlight.departure_date || "";
  const returnDate = mcpFlight.return_date || "";

  // 기본 시간 생성 (실제 API에서 제공되지 않을 경우)
  const departureHour = 8 + (index % 12);
  const departureMinute = (index * 7) % 60;
  const flightDuration = 8 + (index % 6);
  const arrivalHour = (departureHour + Math.floor(flightDuration)) % 24;
  const arrivalMinute = (departureMinute + 30) % 60;

  // 가격 기반 절감액 계산 (실제 API에서 제공되지 않을 경우)
  const basePrice = mcpFlight.price * 1.2; // 20% 할인 가정
  const savings = Math.floor(basePrice - mcpFlight.price);

  return {
    id: `flight-${index + 1}`,
    airline: mcpFlight.airline,
    airlineCode: getAirlineCode(mcpFlight.airline),
    departureTime: `${departureHour
      .toString()
      .padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`,
    arrivalTime: `${arrivalHour.toString().padStart(2, "0")}:${arrivalMinute
      .toString()
      .padStart(2, "0")}`,
    duration: `${Math.floor(flightDuration)}시간 ${Math.floor(
      (flightDuration % 1) * 60
    )}분`,
    price: mcpFlight.price,
    stops: index % 3 === 0 ? 1 : 0, // 일부 항공편은 경유
    aircraft: ["Boeing 777", "Airbus A350", "Boeing 787", "Airbus A380"][
      index % 4
    ],
    departureDate,
    returnDate,
    savings: savings > 0 ? savings : 0,
  };
};

// 날짜 생성 헬퍼 함수
const generateDatesForMonth = (
  month: string,
  duration: number,
  count: number = 5
): Array<{ departureDate: string; returnDate: string }> => {
  const [year, monthNum] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const dates: Array<{ departureDate: string; returnDate: string }> = [];

  // 월 중에서 여러 날짜 구간 생성
  for (let i = 0; i < count; i++) {
    const maxStartDay = daysInMonth - duration;
    if (maxStartDay < 1) break;

    const startDay = Math.floor((i * maxStartDay) / count) + 1;
    const departureDate = `${year}-${monthNum
      .toString()
      .padStart(2, "0")}-${startDay.toString().padStart(2, "0")}`;

    const returnDay = Math.min(startDay + duration - 1, daysInMonth);
    const returnDate = `${year}-${monthNum
      .toString()
      .padStart(2, "0")}-${returnDay.toString().padStart(2, "0")}`;

    dates.push({ departureDate, returnDate });
  }

  return dates;
};

export const searchFlightsViaMCP = async (
  destination: string,
  duration: number,
  month: string
): Promise<FlightData[]> => {
  try {
    // 목적지 정보에서 공항 코드 가져오기
    const destinationInfo = destinations.find((d) => d.id === destination);
    const destinationAirport =
      destinationInfo?.airport || destination.toUpperCase();
    const origin = "ICN"; // 기본 출발지는 인천

    // 월과 기간을 기반으로 여러 날짜 구간 생성
    const dateRanges = generateDatesForMonth(month, duration, 5);

    // 각 날짜 구간에 대해 mcp_server 호출
    const allFlights: FlightData[] = [];

    for (const dateRange of dateRanges) {
      try {
        // JSON-RPC 요청 생성
        const jsonRpcRequest = {
          jsonrpc: "2.0",
          method: "searchFlights",
          params: {
            origin: origin,
            destination: destinationAirport,
            departure_date: dateRange.departureDate,
            return_date: dateRange.returnDate,
          },
          id: `req-${dateRange.departureDate}`,
        };

        // mcp_server에 요청 전송
        const response = await fetch(`${MCP_SERVER_URL}/rpc`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonRpcRequest),
        });

        if (!response.ok) {
          console.warn(
            `MCP 서버 응답 오류 (${response.status}): ${response.statusText}`
          );
          continue;
        }

        const data: MCPResponse = await response.json();

        // 에러 처리
        if (data.error) {
          console.error(
            `MCP 서버 에러: ${data.error.code} - ${data.error.message}`
          );
          continue;
        }

        // 응답 데이터 변환
        if (data.result?.flights) {
          const transformedFlights = data.result.flights.map((flight, index) =>
            transformMCPFlightToFlightData(
              flight,
              allFlights.length + index,
              duration
            )
          );
          allFlights.push(...transformedFlights);
        }
      } catch (error) {
        console.error(
          `날짜 구간 ${dateRange.departureDate} 처리 중 오류:`,
          error
        );
        // 개별 날짜 구간 실패 시 계속 진행
        continue;
      }
    }

    // 결과가 있으면 가격순으로 정렬하여 반환
    if (allFlights.length > 0) {
      return allFlights.sort((a, b) => a.price - b.price).slice(0, 10); // 최대 10개 반환
    }

    // 결과가 없으면 폴백: mock 데이터 반환
    console.warn(
      "MCP 서버에서 결과를 받지 못했습니다. Mock 데이터를 사용합니다."
    );
    return generateMockFlights(destination, duration, month);
  } catch (error) {
    console.error("MCP 서버 호출 중 오류 발생:", error);
    // 에러 발생 시 폴백: mock 데이터 반환
    return generateMockFlights(destination, duration, month);
  }
};

// 폴백용 Mock 데이터 생성 함수
const generateMockFlights = (
  destination: string,
  duration: number,
  month: string
): FlightData[] => {
  const monthNumber = parseInt(month.split("-")[1]);
  const year = 2024;
  const daysInMonth = new Date(year, monthNumber, 0).getDate();

  const airlines = [
    { code: "KE", name: "대한항공" },
    { code: "OZ", name: "아시아나항공" },
    { code: "AF", name: "에어프랑스" },
    { code: "LH", name: "루프트한자" },
    { code: "JL", name: "일본항공" },
  ];

  const optimalDates: Array<{ departureDate: string; returnDate: string }> = [];
  for (let i = 0; i < 5; i++) {
    const startDay = Math.floor((i * (daysInMonth - duration)) / 5) + 1;
    const departureDate = `${year}-${monthNumber
      .toString()
      .padStart(2, "0")}-${startDay.toString().padStart(2, "0")}`;

    const returnDay = Math.min(startDay + duration - 1, daysInMonth);
    const returnDate = `${year}-${monthNumber
      .toString()
      .padStart(2, "0")}-${returnDay.toString().padStart(2, "0")}`;

    optimalDates.push({ departureDate, returnDate });
  }

  return optimalDates
    .map((dates, index) => {
      const airline = airlines[index % airlines.length];
      const basePrice = 800000 + Math.random() * 1200000;
      const savings = Math.floor(Math.random() * 300000) + 50000;
      const finalPrice = basePrice - savings;

      const departureHour = 8 + (index % 12);
      const departureMinute = (index * 7) % 60;
      const flightDuration = 8 + (index % 6);
      const arrivalHour = (departureHour + Math.floor(flightDuration)) % 24;
      const arrivalMinute = (departureMinute + 30) % 60;

      return {
        id: `flight-${index + 1}`,
        airline: airline.name,
        airlineCode: airline.code,
        departureTime: `${departureHour
          .toString()
          .padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`,
        arrivalTime: `${arrivalHour.toString().padStart(2, "0")}:${arrivalMinute
          .toString()
          .padStart(2, "0")}`,
        duration: `${Math.floor(flightDuration)}시간 ${Math.floor(
          (flightDuration % 1) * 60
        )}분`,
        price: Math.floor(finalPrice),
        stops: index % 3 === 0 ? 1 : 0,
        aircraft: ["Boeing 777", "Airbus A350", "Boeing 787", "Airbus A380"][
          index % 4
        ],
        departureDate: dates.departureDate,
        returnDate: dates.returnDate,
        savings: savings,
      };
    })
    .sort((a, b) => a.price - b.price);
};

// ==================== 저장된 여행 관련 API ====================

/**
 * 저장된 여행 목록 조회
 */
export const getSavedTrips = async (): Promise<SavedTrip[]> => {
  try {
    const response = await fetch(`${BE_SERVER_URL}/api/v1/saved`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // 엔드포인트가 없으면 빈 배열 반환 (BE가 아직 구현되지 않은 경우)
        return [];
      }
      throw new Error(`서버 오류: ${response.status}`);
    }

    const data = await response.json();
    // BE 응답 형식에 따라 조정 필요 (배열이거나 객체 안에 배열이 있을 수 있음)
    return Array.isArray(data) ? data : data.trips || data.data || [];
  } catch (error) {
    console.error("저장된 여행 목록 조회 중 오류:", error);
    // BE 서버가 없거나 오류 발생 시 localStorage 폴백
    return getSavedTripsFromLocalStorage();
  }
};

/**
 * 여행 저장
 */
export const saveTrip = async (
  trip: Omit<SavedTrip, "id" | "savedAt">
): Promise<SavedTrip | null> => {
  try {
    const response = await fetch(`${BE_SERVER_URL}/api/v1/saved`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trip),
    });

    if (!response.ok) {
      if (response.status === 404) {
        // BE가 아직 구현되지 않은 경우 localStorage 사용
        return saveTripToLocalStorage(trip);
      }
      throw new Error(`서버 오류: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("여행 저장 중 오류:", error);
    // BE 서버가 없거나 오류 발생 시 localStorage 폴백
    return saveTripToLocalStorage(trip);
  }
};

/**
 * 여행 삭제
 */
export const deleteTrip = async (tripId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BE_SERVER_URL}/api/v1/saved/${tripId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // BE가 아직 구현되지 않은 경우 localStorage 사용
        return deleteTripFromLocalStorage(tripId);
      }
      throw new Error(`서버 오류: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("여행 삭제 중 오류:", error);
    // BE 서버가 없거나 오류 발생 시 localStorage 폴백
    return deleteTripFromLocalStorage(tripId);
  }
};

// ==================== 텍스트 검색 관련 API ====================

/**
 * 텍스트로 여행 정보 검색 (LLM 기반)
 */
export const searchFlightsByText = async (
  text: string
): Promise<{ destination: string; duration: number; month: string } | null> => {
  try {
    const response = await fetch(`${BE_SERVER_URL}/api/v1/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: text }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        // BE가 아직 구현되지 않은 경우 null 반환
        console.warn("BE 검색 API가 아직 구현되지 않았습니다.");
        return null;
      }
      throw new Error(`서버 오류: ${response.status}`);
    }

    const data = await response.json();
    // BE 응답 형식에 따라 조정 필요
    return {
      destination: data.destination || data.destinationId || "",
      duration: data.duration || data.days || 0,
      month: data.month || data.departureMonth || "",
    };
  } catch (error) {
    console.error("텍스트 검색 중 오류:", error);
    return null;
  }
};

// ==================== localStorage 폴백 함수 ====================

/**
 * localStorage에서 저장된 여행 목록 조회 (폴백)
 */
const getSavedTripsFromLocalStorage = (): SavedTrip[] => {
  if (typeof window === "undefined") return [];
  try {
    const trips = JSON.parse(localStorage.getItem("savedTrips") || "[]");
    return trips.sort(
      (a: SavedTrip, b: SavedTrip) =>
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
  } catch (error) {
    console.error("localStorage에서 데이터 읽기 오류:", error);
    return [];
  }
};

/**
 * localStorage에 여행 저장 (폴백)
 */
const saveTripToLocalStorage = (
  trip: Omit<SavedTrip, "id" | "savedAt">
): SavedTrip | null => {
  if (typeof window === "undefined") return null;
  try {
    const newTrip: SavedTrip = {
      ...trip,
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
    };

    const existingSavedTrips = JSON.parse(
      localStorage.getItem("savedTrips") || "[]"
    );
    const updatedTrips = [...existingSavedTrips, newTrip];
    localStorage.setItem("savedTrips", JSON.stringify(updatedTrips));

    return newTrip;
  } catch (error) {
    console.error("localStorage에 데이터 저장 오류:", error);
    return null;
  }
};

/**
 * localStorage에서 여행 삭제 (폴백)
 */
const deleteTripFromLocalStorage = (tripId: string): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const existingSavedTrips = JSON.parse(
      localStorage.getItem("savedTrips") || "[]"
    );
    const updatedTrips = existingSavedTrips.filter(
      (trip: SavedTrip) => trip.id !== tripId
    );
    localStorage.setItem("savedTrips", JSON.stringify(updatedTrips));
    return true;
  } catch (error) {
    console.error("localStorage에서 데이터 삭제 오류:", error);
    return false;
  }
};
