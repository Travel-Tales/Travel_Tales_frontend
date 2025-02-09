import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension";

type List = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  travelArea: string;
  travelerCount: number;
  visibilityStatus: string;
  budget: string;
  startDate: string;
  endDate: string;
};

interface reviewState {
  review: List | null;
  setReview: (review: any) => void;
  activeReviewTab: boolean;
  setActiveReviewTab: (activeReviewTab: any) => void;
}

const reviewStore = create<reviewState>()(
  devtools(
    persist(
      (set) => ({
        review: null,
        setReview: (review) => set(() => ({ review: review })),
        activeReviewTab: false,
        setActiveReviewTab: (activeReviewTab) =>
          set(() => ({ activeReviewTab: activeReviewTab })),
      }),
      { name: "review-storage" }
    )
  )
);

export default reviewStore;
