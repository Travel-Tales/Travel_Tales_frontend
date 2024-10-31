import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

interface loadingState {
  isLoading: boolean;
  setIsLoading: (plans: any) => void;
}

const loadingStore = create<loadingState>()(
  devtools(
    (set) => ({
      isLoading: false,
      setIsLoading: (isLoading) => set(() => ({ isLoading: isLoading })),
    }),
    {
      name: "loading-storage",
    }
  )
);

export default loadingStore;
