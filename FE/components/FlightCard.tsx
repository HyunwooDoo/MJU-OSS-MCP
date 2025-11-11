"use client";

import type { FlightData } from "@/types";
import { airlines } from "@/constants";

interface FlightCardProps {
  flight: FlightData;
  destinationAirport?: string;
  duration: number;
  index: number;
  isSelected: boolean;
  onSelect: (flightId: string) => void;
  onSave: (flight: FlightData) => void;
  onBook: (flight: FlightData) => void;
}

export function FlightCard({
  flight,
  destinationAirport,
  duration,
  index,
  isSelected,
  onSelect,
  onSave,
  onBook,
}: FlightCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-xl transform hover:scale-[1.02] ${
        isSelected
          ? "border-purple-400 ring-4 ring-purple-200"
          : "border-gray-200 hover:border-purple-300"
      }`}
      onClick={() => onSelect(flight.id)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="text-2xl mr-3">
            {airlines.find((a) => a.code === flight.airlineCode)?.logo || "✈️"}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              {flight.airline}
            </h3>
            <p className="text-sm text-gray-500">{flight.aircraft}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">
            {flight.price.toLocaleString()}원
          </div>
          {flight.savings > 0 && (
            <div className="text-sm text-green-600 font-semibold">
              {flight.savings.toLocaleString()}원 절약
            </div>
          )}
          {index === 0 && (
            <div className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full mt-1">
              최저가
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">출발</div>
          <div className="font-semibold text-gray-800">
            {new Date(flight.departureDate).toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
          </div>
          <div className="text-lg font-bold text-blue-600">
            ICN {flight.departureTime}
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">비행시간</div>
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <i className="ri-plane-line mx-2 text-purple-600"></i>
            <div className="w-8 h-0.5 bg-gray-300"></div>
          </div>
          <div className="font-semibold text-gray-800">{flight.duration}</div>
          <div className="text-sm text-gray-500">
            {flight.stops === 0 ? "직항" : `경유 ${flight.stops}회`}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">도착</div>
          <div className="font-semibold text-gray-800">
            {new Date(flight.departureDate).toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
          </div>
          <div className="text-lg font-bold text-purple-600">
            {destinationAirport} {flight.arrivalTime}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">귀국편: </span>
            <span className="font-semibold">
              {new Date(flight.returnDate).toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
                weekday: "short",
              })}
            </span>
          </div>
          <div className="text-right">
            <span className="text-gray-500">총 여행기간: </span>
            <span className="font-semibold text-indigo-600">{duration}일</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(flight);
          }}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-all duration-300 whitespace-nowrap"
        >
          <i className="ri-bookmark-line mr-1"></i>
          저장하기
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook(flight);
          }}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
            isSelected
              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
              : "bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
          }`}
        >
          {isSelected ? "선택됨" : "선택하기"}
        </button>
      </div>
    </div>
  );
}
