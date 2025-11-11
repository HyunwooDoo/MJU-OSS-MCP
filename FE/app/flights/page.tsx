"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { FlightData } from "@/types";
import { destinations } from "@/constants";
import { searchFlightsViaMCP } from "@/lib/api";
import { useSaveTrip } from "@/hooks/useSavedTrips";
import { FlightCard } from "@/components/FlightCard";

function FlightsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saveTrip = useSaveTrip();
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState<string>("");

  const destination = searchParams.get("destination") || "";
  const duration = parseInt(searchParams.get("duration") || "0");
  const month = searchParams.get("month") || "";

  const destinationInfo = destinations.find((d) => d.id === destination);
  const monthName = month
    ? new Date(month + "-01").toLocaleDateString("ko-KR", { month: "long" })
    : "";

  useEffect(() => {
    const fetchFlights = async () => {
      if (destination && duration && month) {
        setLoading(true);
        try {
          const flightData = await searchFlightsViaMCP(
            destination,
            duration,
            month
          );
          setFlights(flightData);
        } catch (error) {
          console.error("항공권 검색 중 오류 발생:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFlights();
  }, [destination, duration, month]);

  const handleFlightSelect = (flightId: string) => {
    setSelectedFlight(flightId);
  };

  const handleBookFlight = (flight: FlightData) => {
    alert(
      `${flight.airline} 항공편이 선택되었습니다!\n출발: ${
        flight.departureDate
      }\n귀국: ${flight.returnDate}\n가격: ${flight.price.toLocaleString()}원`
    );
  };

  const handleSaveFlight = (flight: FlightData) => {
    if (destinationInfo) {
      saveTrip({
        destination: destinationInfo.name,
        destinationId: destination,
        country: destinationInfo.country,
        airport: destinationInfo.airport || "",
        duration: duration,
        month: monthName,
        flight: flight,
      });

      alert(
        `${flight.airline} 항공편이 저장되었습니다!\n저장된 여행 목록에서 확인하실 수 있습니다.`
      );
    }
  };

  if (!destination || !duration || !month) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            잘못된 접근입니다
          </h2>
          <p className="text-gray-600 mb-6">
            홈페이지에서 여행 정보를 선택해주세요
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 whitespace-nowrap"
          >
            홈페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-300"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              다시 선택하기
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              항공권 검색 결과
            </h1>
            <div></div>
          </div>
        </div>
      </div>

      {/* Search Summary */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-500 mb-1">목적지</div>
              <div className="font-bold text-purple-600 text-lg">
                {destinationInfo?.name} ({destinationInfo?.airport})
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">여행 기간</div>
              <div className="font-bold text-blue-600 text-lg">
                {duration}일
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">여행 월</div>
              <div className="font-bold text-indigo-600 text-lg">
                {monthName}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">검색 결과</div>
              <div className="font-bold text-green-600 text-lg">
                최저가 5개 항공편
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              최저가 항공권을 검색하고 있습니다
            </h3>
            <p className="text-gray-600">
              MCP 프로토콜을 통해 실시간 항공료를 조회 중...
            </p>
            <div className="mt-4 text-sm text-purple-600">
              • {monthName} 중 가장 저렴한 날짜 분석 중<br />
              • 항공사별 최저가 비교 중<br />• 최적의 여행 일정 계산 중
            </div>
          </div>
        )}

        {/* Flight Results */}
        {!loading && flights.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {monthName} 최저가 항공편
              </h2>
              <p className="text-gray-600">
                선택한 기간 동안 가장 저렴한 날짜와 항공사를 찾았습니다
              </p>
            </div>

            <div className="grid gap-6">
              {flights.map((flight, index) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  destinationAirport={destinationInfo?.airport}
                  duration={duration}
                  index={index}
                  isSelected={selectedFlight === flight.id}
                  onSelect={handleFlightSelect}
                  onSave={handleSaveFlight}
                  onBook={handleBookFlight}
                />
              ))}
            </div>

            {/* 추가 정보 */}
            <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3">
                💡 최저가 검색 결과
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  • {monthName} 중 가장 저렴한 출발 날짜들을 선별했습니다
                </div>
                <div>• 항공사별 최저가를 실시간으로 비교했습니다</div>
                <div>• 경유 횟수와 비행시간을 고려한 최적 항공편입니다</div>
                <div>• 가격은 세금 및 수수료가 포함된 최종 금액입니다</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Flights() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              페이지를 불러오는 중...
            </h3>
          </div>
        </div>
      }
    >
      <FlightsContent />
    </Suspense>
  );
}
