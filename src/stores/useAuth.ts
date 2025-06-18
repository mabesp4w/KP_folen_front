/** @format */

// src/stores/useAuth.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
};

const useAuth = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        login: (user: User) =>
          set({
            user,
            isAuthenticated: true,
          }),
        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
          }),
      }),
      {
        name: "auth-storage",
      }
    )
  )
);

export default useAuth;
