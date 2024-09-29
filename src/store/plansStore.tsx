import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

type List = {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  travelArea: string;
  travelerCount: number;
  budget: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  visibilityStatus: string;
  travelPostImage?: [];
};

interface plansState {
  plans: List[] | [];
  setPlans: (plans: any) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}

const plansStore = create<plansState>()(
  devtools(
    (set) => ({
      plans: [],
      setPlans: (plans) => set(() => ({ plans: plans })),
      selectedCategory: "전체",
      setSelectedCategory: (category) =>
        set(() => ({ selectedCategory: category })),
      searchKeyword: "",
      setSearchKeyword: (keyword) => set(() => ({ searchKeyword: keyword })),
    }),
    {
      name: "plan-storage",
    }
  )
);

export default plansStore;
