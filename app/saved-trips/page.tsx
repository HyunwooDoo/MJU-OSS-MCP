"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDeleteTrip } from "@/hooks/useSavedTrips";
import type { SavedTrip } from "@/types";
import { SavedTripCard } from "@/components/SavedTripCard";

export default function SavedTrips() {
  const router = useRouter();
  const deleteTrip = useDeleteTrip();
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string>("");

  useEffect(() => {
    const loadSavedTrips = () => {
      if (typeof window !== "undefined") {
        const trips = JSON.parse(localStorage.getItem("savedTrips") || "[]");
        setSavedTrips(
          trips.sort(
            (a: SavedTrip, b: SavedTrip) =>
              new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
          )
        );
      }
    };

    loadSavedTrips();
  }, []);

  const handleDeleteTripWithRefresh = (tripId: string) => {
    deleteTrip(tripId);
    const updatedTrips = savedTrips.filter((trip) => trip.id !== tripId);
    setSavedTrips(updatedTrips);
  };

  const handleSearchAgain = (trip: SavedTrip) => {
    router.push(
      `/flights?destination=${trip.destinationId}&duration=${
        trip.duration
      }&month=${trip.flight.departureDate.substring(0, 7)}`
    );
  };

  const handleBookTrip = (trip: SavedTrip) => {
    alert(
      `${trip.flight.airline} 항공편 예약을 진행합니다!\n목적지: ${
        trip.destination
      }\n출발: ${trip.flight.departureDate}\n귀국: ${
        trip.flight.returnDate
      }\n가격: ${trip.flight.price.toLocaleString()}원`
    );
  };

  const handleTripSelect = (tripId: string) => {
    setSelectedTrip(tripId);
  };

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
              홈으로 돌아가기
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              저장된 여행 목록
            </h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            나의 여행 계획
          </h2>
          <p className="text-gray-600">
            저장하신 여행 정보를 확인하고 예약을 진행하세요
          </p>
        </div>

        {/* Empty State */}
        {savedTrips.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">✈️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              저장된 여행이 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              항공권을 검색하고 마음에 드는 여행을 저장해보세요
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 whitespace-nowrap"
            >
              여행 계획하러 가기
            </button>
          </div>
        )}

        {/* Saved Trips List */}
        {savedTrips.length > 0 && (
          <div className="grid gap-6">
            {savedTrips.map((trip) => (
              <SavedTripCard
                key={trip.id}
                trip={trip}
                isSelected={selectedTrip === trip.id}
                onSelect={handleTripSelect}
                onDelete={handleDeleteTripWithRefresh}
                onSearchAgain={handleSearchAgain}
                onBook={handleBookTrip}
              />
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        {savedTrips.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 whitespace-nowrap"
            >
              <i className="ri-add-line mr-2"></i>
              새로운 여행 계획하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
