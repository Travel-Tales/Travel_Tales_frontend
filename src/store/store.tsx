import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import LocalStorage from "@/service/localstorage";

interface BearState {
  accessToken: string;
  setAccessToken: (token: string) => void;
  planId: number | null;
  setPlanId: (id: number | null) => void;
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
      }),
      {
        name: "bear-storage",
      }
    )
  )
);

export default useStore;
