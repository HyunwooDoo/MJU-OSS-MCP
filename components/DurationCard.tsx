"use client";

import type { Duration } from "@/types";

interface DurationCardProps {
  duration: Duration;
  isSelected: boolean;
  isAnimating: boolean;
  animationDelay: number;
  onSelect: (days: number) => void;
}

export function DurationCard({
  duration,
  isSelected,
  isAnimating,
  animationDelay,
  onSelect,
}: DurationCardProps) {
  return (
    <div
      className={`cursor-pointer transform transition-all duration-150 hover:scale-105 rounded-xl ${
        isSelected ? "ring-4 ring-blue-300 shadow-xl" : "hover:shadow-lg"
      }`}
      onClick={() => onSelect(duration.days)}
    >
      <div
        className={`bg-white rounded-xl p-6 text-center border-2 transition-all duration-150 ${
          isSelected
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 hover:border-purple-300"
        }`}
      >
        <div
          className={`text-2xl font-bold mb-2 ${
            isSelected ? "text-blue-600" : "text-gray-800"
          }`}
        >
          {duration.label}
        </div>
        <div
          className={`text-sm ${
            isSelected ? "text-blue-500" : "text-gray-500"
          }`}
        >
          {duration.description}
        </div>
      </div>
    </div>
  );
}
