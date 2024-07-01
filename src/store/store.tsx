import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

interface BearState {
  accessToken: string;
  setAccessToken: (token: string) => void;
}

const useStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        accessToken: "",
        setAccessToken: (token: string) => set({ accessToken: token }),
      }),
      {
        name: "bear-storage",
      }
    )
  )
);

export default useStore;
