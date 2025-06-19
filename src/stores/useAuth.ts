/** @format */

// src/stores/useAuth.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { authService, LoginRequest } from "@/services/authService";
import toast from "react-hot-toast";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenExpiresAt: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkToken: () => Promise<boolean>;
  setUser: (user: User) => void;
  clearAuth: () => void;
};

const useAuth = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        tokenExpiresAt: null,

        login: async (credentials: LoginRequest) => {
          set({ isLoading: true });
          try {
            const response = await authService.login(credentials);

            if (response.status) {
              // Save token
              authService.setToken(response.token);

              // Update store
              const user: User = {
                id: response.user.id,
                name: response.user.name,
                email: credentials.email,
                role: response.role,
              };

              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });

              toast.success("Login berhasil!");
            } else {
              throw new Error("Login gagal");
            }
          } catch (error: any) {
            set({ isLoading: false });

            let errorMessage = "Terjadi kesalahan saat login";

            if (error.response?.data?.message) {
              errorMessage = error.response.data.message;
            } else if (error.message) {
              errorMessage = error.message;
            }

            toast.error(errorMessage);
            throw error;
          }
        },

        logout: async () => {
          try {
            await authService.logout();
            toast.success("Logout berhasil!");
          } catch (error) {
            console.error("Logout error:", error);
            // Continue with logout even if API call fails
          } finally {
            // Clear everything
            authService.removeToken();
            set({
              user: null,
              isAuthenticated: false,
              tokenExpiresAt: null,
            });
          }
        },

        checkToken: async (): Promise<boolean> => {
          try {
            const token = authService.getToken();
            if (!token) {
              get().clearAuth();
              return false;
            }

            const response = await authService.checkToken();

            if (response.status) {
              // Check if token is expired
              if (authService.isTokenExpired(response.expires_at)) {
                get().clearAuth();
                toast.error("Sesi telah berakhir, silakan login kembali");
                return false;
              }

              // Update token expiry info
              set({
                tokenExpiresAt: response.expires_at,
                isAuthenticated: true,
              });

              return true;
            } else {
              get().clearAuth();
              return false;
            }
          } catch (error: any) {
            console.error("Token check error:", error);

            if (error.response?.status === 401) {
              get().clearAuth();
              toast.error("Sesi telah berakhir, silakan login kembali");
            }

            return false;
          }
        },

        setUser: (user: User) =>
          set({
            user,
            isAuthenticated: true,
          }),

        clearAuth: () => {
          authService.removeToken();
          set({
            user: null,
            isAuthenticated: false,
            tokenExpiresAt: null,
          });
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          tokenExpiresAt: state.tokenExpiresAt,
        }),
      }
    )
  )
);

export default useAuth;
