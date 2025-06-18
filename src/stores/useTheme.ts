/** @format */

// src/stores/useTheme.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Theme = "light" | "dark";

type ThemeStore = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const useTheme = create<ThemeStore>()(
  devtools(
    persist(
      (set) => ({
        theme: "light",
        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === "light" ? "dark" : "light",
          })),
        setTheme: (theme: Theme) => set({ theme }),
      }),
      {
        name: "theme-storage",
      }
    )
  )
);

export default useTheme;
