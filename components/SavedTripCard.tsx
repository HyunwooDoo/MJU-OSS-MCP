'use client';

import type { SavedTrip } from '@/types';
import { airlines } from '@/constants';

interface SavedTripCardProps {
  trip: SavedTrip;
  isSelected: boolean;
  onSelect: (tripId: string) => void;
  onDelete: (tripId: string) => void;
  onSearchAgain: (trip: SavedTrip) => void;
  onBook: (trip: SavedTrip) => void;
}

export function SavedTripCard({
  trip,
  isSelected,
  onSelect,
  onDelete,
  onSearchAgain,
  onBook,
}: SavedTripCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-xl transform hover:scale-[1.01] ${
        isSelected ? 'border-purple-400 ring-4 ring-purple-200' : 'border-gray-200 hover:border-purple-300'
      }`}
      onClick={() => onSelect(trip.id)}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl mr-4">
            ✈️
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{trip.destination} 여행</h3>
            <p className="text-sm text-gray-500">
              {new Date(trip.savedAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              저장됨
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(trip.id);
          }}
          className="text-gray-400 hover:text-red-500 transition-colors duration-300"
        >
          <i className="ri-delete-bin-line text-xl"></i>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">목적지</div>
          <div className="font-bold text-purple-600">{trip.destination}</div>
          <div className="text-sm text-gray-500">({trip.airport})</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">여행 기간</div>
          <div className="font-bold text-blue-600">{trip.duration}일</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">여행 월</div>
          <div className="font-bold text-indigo-600">{trip.month}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">항공료</div>
          <div className="font-bold text-green-600">{trip.flight.price.toLocaleString()}원</div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">
              {airlines.find((a) => a.code === trip.flight.airlineCode)?.logo || '✈️'}
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-800">{trip.flight.airline}</h4>
              <p className="text-sm text-gray-500">{trip.flight.aircraft}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-purple-600">{trip.flight.price.toLocaleString()}원</div>
            {trip.flight.savings > 0 && (
              <div className="text-sm text-green-600 font-semibold">
                {trip.flight.savings.toLocaleString()}원 절약
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">출발</div>
            <div className="font-semibold text-gray-800">
              {new Date(trip.flight.departureDate).toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
                weekday: 'short',
              })}
            </div>
            <div className="text-lg font-bold text-blue-600">ICN {trip.flight.departureTime}</div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">비행시간</div>
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <i className="ri-plane-line mx-2 text-purple-600"></i>
              <div className="w-8 h-0.5 bg-gray-300"></div>
            </div>
            <div className="font-semibold text-gray-800">{trip.flight.duration}</div>
            <div className="text-sm text-gray-500">{trip.flight.stops === 0 ? '직항' : `경유 ${trip.flight.stops}회`}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">도착</div>
            <div className="font-semibold text-gray-800">
              {new Date(trip.flight.departureDate).toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
                weekday: 'short',
              })}
            </div>
            <div className="text-lg font-bold text-purple-600">{trip.airport} {trip.flight.arrivalTime}</div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="text-sm text-gray-500 mb-1">귀국편</div>
          <div className="font-semibold">
            {new Date(trip.flight.returnDate).toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSearchAgain(trip);
          }}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-all duration-300 whitespace-nowrap"
        >
          <i className="ri-search-line mr-1"></i>
          다시 검색
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook(trip);
          }}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
            isSelected
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
              : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
          }`}
        >
          <i className="ri-plane-line mr-1"></i>
          예약하기
        </button>
      </div>
    </div>
  );
}
