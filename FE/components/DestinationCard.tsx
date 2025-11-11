"use client";

import type { Destination } from "@/types";

interface DestinationCardProps {
  destination: Destination;
  isSelected: boolean;
  isAnimating: boolean;
  animationDelay: number;
  onSelect: (id: string) => void;
}

export function DestinationCard({
  destination,
  isSelected,
  isAnimating,
  animationDelay,
  onSelect,
}: DestinationCardProps) {
  return (
    <div
      className={`group cursor-pointer transform transition-all duration-200 hover:scale-105 rounded-2xl ${
        isSelected ? "ring-4 ring-purple-300 shadow-2xl" : "hover:shadow-xl"
      }`}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={() => onSelect(destination.id)}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="relative h-48 overflow-hidden">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {destination.name}
          </h3>
          <p className="text-sm text-purple-600 mb-2">{destination.country}</p>
          <p className="text-gray-600 text-sm">{destination.description}</p>
        </div>
      </div>
    </div>
  );
}
