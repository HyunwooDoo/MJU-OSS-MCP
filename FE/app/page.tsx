"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { destinations, durations, months } from "@/constants";
import { searchFlightsByText } from "@/lib/api";
import { DestinationCard } from "@/components/DestinationCard";
import { DurationCard } from "@/components/DurationCard";
import { MonthCard } from "@/components/MonthCard";

export default function Home() {
  const router = useRouter();
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [textInput, setTextInput] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  const handleDestinationSelect = (destinationId: string) => {
    setSelectedDestination(destinationId);
  };

  const handleDurationSelect = (days: number) => {
    setSelectedDuration(days);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
  };

  const handlePlanTrip = () => {
    if (selectedDestination && selectedDuration && selectedMonth) {
      router.push(
        `/flights?destination=${selectedDestination}&duration=${selectedDuration}&month=${selectedMonth}`
      );
    }
  };

  const handleTextSearch = async () => {
    if (!textInput.trim()) return;

    setIsSearching(true);
    try {
      // BE API를 통해 텍스트 검색
      const result = await searchFlightsByText(textInput.trim());

      if (result && result.destination && result.duration && result.month) {
        // 검색 결과가 있으면 항공권 검색 페이지로 이동
        router.push(
          `/flights?destination=${result.destination}&duration=${result.duration}&month=${result.month}`
        );
      } else {
        // BE가 아직 구현되지 않았거나 결과가 없는 경우
        alert(
          `입력하신 여행 정보를 분석하여 최적의 항공권을 찾아드리겠습니다:\n\n"${textInput}"\n\n아래에서 목적지, 기간, 월을 선택해주세요.`
        );
      }
    } catch (error) {
      console.error("텍스트 검색 중 오류:", error);
      alert(
        `검색 중 오류가 발생했습니다. 아래에서 목적지, 기간, 월을 직접 선택해주세요.`
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                꿈의 여행
              </span>
              <br />
              계획하기
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              원하는 목적지, 여행 기간, 출발 월을 선택하거나 직접 입력하여
              최저가 항공권을 찾아보세요
            </p>

            {/* Quick Access to Saved Trips */}
            <div className="mt-6">
              <button
                onClick={() => router.push("/saved-trips")}
                className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-200 hover:border-purple-300 whitespace-nowrap"
              >
                <i className="ri-bookmark-line mr-2"></i>
                저장된 여행 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Text Input Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 mb-16">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              여행 정보를 직접 입력해보세요
            </h2>
            <p className="text-gray-600">
              목적지, 여행 일수, 여행 월을 자유롭게 입력하시면 AI가
              분석해드립니다
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="예: 파리로 7일간 4월에 여행하고 싶어요. 로맨틱한 분위기를 원하고 예산은 200만원 정도입니다."
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors duration-300 resize-none text-sm"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {textInput.length}/500자
              </span>
              <button
                onClick={handleTextSearch}
                disabled={!textInput.trim() || isSearching}
                className={`px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                  textInput.trim() && !isSearching
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {isSearching ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    분석 중...
                  </>
                ) : (
                  <>
                    <i className="ri-search-line mr-2"></i>
                    AI로 검색하기
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-200"></div>
          <span className="px-6 text-gray-500 font-medium">
            또는 아래에서 선택하세요
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-200"></div>
        </div>
      </div>

      {/* Destination Selection */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            어디로 떠나고 싶으신가요?
          </h2>
          <p className="text-gray-600">마음에 드는 목적지를 선택해주세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {destinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              isSelected={selectedDestination === destination.id}
              isAnimating={false}
              animationDelay={index * 50}
              onSelect={handleDestinationSelect}
            />
          ))}
        </div>

        {/* Duration Selection */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            얼마나 오래 여행하고 싶으신가요?
          </h2>
          <p className="text-gray-600">여행 기간을 선택해주세요</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {durations.map((duration, index) => (
            <DurationCard
              key={duration.days}
              duration={duration}
              isSelected={selectedDuration === duration.days}
              isAnimating={false}
              animationDelay={index * 30}
              onSelect={handleDurationSelect}
            />
          ))}
        </div>

        {/* Month Selection */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            언제 떠나고 싶으신가요?
          </h2>
          <p className="text-gray-600">여행하고 싶은 월을 선택해주세요</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4 mb-16">
          {months.map((month, index) => (
            <MonthCard
              key={month.value}
              month={month}
              isSelected={selectedMonth === month.value}
              isAnimating={false}
              animationDelay={index * 30}
              onSelect={handleMonthSelect}
            />
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={handlePlanTrip}
            disabled={
              !selectedDestination || !selectedDuration || !selectedMonth
            }
            className={`px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
              selectedDestination && selectedDuration && selectedMonth
                ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <i className="ri-plane-line mr-2"></i>
            최저가 항공권 검색하기
          </button>
        </div>

        {/* Selected Summary */}
        {(selectedDestination || selectedDuration > 0 || selectedMonth) && (
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                선택한 여행 정보
              </h3>
              <div className="space-y-3">
                {selectedDestination && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">목적지:</span>
                    <span className="font-semibold text-purple-600">
                      {
                        destinations.find((d) => d.id === selectedDestination)
                          ?.name
                      }
                    </span>
                  </div>
                )}
                {selectedDuration > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">여행 기간:</span>
                    <span className="font-semibold text-blue-600">
                      {selectedDuration}일
                    </span>
                  </div>
                )}
                {selectedMonth && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">여행 월:</span>
                    <span className="font-semibold text-indigo-600">
                      {months.find((m) => m.value === selectedMonth)?.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        :global(.animate-fade-in) {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
