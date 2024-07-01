import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

interface BearState {
  accessToken: string;
  setAccessToken: (token: string) => void;
  planId: number | null;
  setPlanId: (id: number | null) => void;
}

const useStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        accessToken: "",
        setAccessToken: (token: string) => set(() => ({ accessToken: token })),
        planId: null,
        setPlanId: (id: number | null) => set(() => ({ planId: id })),
      }),
      {
        name: "bear-storage",
      }
    )
  )
);

export default useStore;
