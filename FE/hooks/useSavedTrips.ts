"use client";

import type { SavedTrip } from "@/types";
import {
  saveTrip as saveTripAPI,
  deleteTrip as deleteTripAPI,
} from "@/lib/api";

// Mutation: 여행 저장
export const useSaveTrip = () => {
  return async (
    trip: Omit<SavedTrip, "id" | "savedAt">
  ): Promise<SavedTrip | null> => {
    try {
      const savedTrip = await saveTripAPI(trip);
      return savedTrip;
    } catch (error) {
      console.error("여행 저장 중 오류:", error);
      return null;
    }
  };
};

// Mutation: 여행 삭제
export const useDeleteTrip = () => {
  return async (tripId: string): Promise<boolean> => {
    try {
      const success = await deleteTripAPI(tripId);
      return success;
    } catch (error) {
      console.error("여행 삭제 중 오류:", error);
      return false;
    }
  };
};
