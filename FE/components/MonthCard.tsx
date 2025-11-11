'use client';

import type { Month } from '@/types';

interface MonthCardProps {
  month: Month;
  isSelected: boolean;
  isAnimating: boolean;
  animationDelay: number;
  onSelect: (value: string) => void;
}

export function MonthCard({
  month,
  isSelected,
  isAnimating,
  animationDelay,
  onSelect,
}: MonthCardProps) {
  return (
    <div
      className={`cursor-pointer transform transition-all duration-150 hover:scale-105 rounded-xl ${
        isSelected ? 'ring-4 ring-indigo-300 shadow-xl' : 'hover:shadow-lg'
      }`}
      onClick={() => onSelect(month.value)}
    >
      <div
        className={`bg-white rounded-xl p-6 text-center border-2 transition-all duration-150 ${
          isSelected ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-purple-300'
        }`}
      >
        <div className={`text-2xl font-bold mb-2 ${isSelected ? 'text-indigo-600' : 'text-gray-800'}`}>
          {month.label}
        </div>
        <div className={`text-sm ${isSelected ? 'text-indigo-500' : 'text-gray-500'}`}>
          {month.description}
        </div>
      </div>
    </div>
  );
}
