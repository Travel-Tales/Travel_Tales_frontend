import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import LocalStorage from "@/service/localstorage";

type List = {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  travelArea: string;
  travelerCount: number;
  budget: number;
  thumbnail: string;
  startDate: string;
  endDate: string;
  visibilityStatus: string;
  travelPostImage?: [];
};

interface BearState {
  accessToken: string;
  setAccessToken: (token: string) => void;
  planId: number | null;
  setPlanId: (id: number | null) => void;
  isLogin: string;
  setIsLogin: (loginState: string) => void;
  plans: List[] | [];
  setPlans: (plans: any) => void;
}

const access = LocalStorage.getItem("accessToken");

const useStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        accessToken: access ? access : "",
        setAccessToken: (token: string) => set(() => ({ accessToken: token })),
        planId: null,
        setPlanId: (id: number | null) => set(() => ({ planId: id })),
        isLogin: "false",
        setIsLogin: (loginState) => set(() => ({ isLogin: loginState })),
        plans: [],
        setPlans: (plans) => set(() => ({ plans: plans })),
      }),
      {
        name: "bear-storage",
      }
    )
  )
);

export default useStore;
