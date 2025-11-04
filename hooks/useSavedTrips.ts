'use client';

import type { SavedTrip } from '@/types';

// Mutation: 여행 저장
export const useSaveTrip = () => {
  return (trip: Omit<SavedTrip, 'id' | 'savedAt'>) => {
    if (typeof window !== 'undefined') {
      const newTrip: SavedTrip = {
        ...trip,
        id: Date.now().toString(),
        savedAt: new Date().toISOString()
      };

      const existingSavedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
      const updatedTrips = [...existingSavedTrips, newTrip];
      localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
      
      return newTrip;
    }
    return null;
  };
};

// Mutation: 여행 삭제
export const useDeleteTrip = () => {
  return (tripId: string) => {
    if (typeof window !== 'undefined') {
      const existingSavedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
      const updatedTrips = existingSavedTrips.filter((trip: SavedTrip) => trip.id !== tripId);
      localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
    }
  };
};
