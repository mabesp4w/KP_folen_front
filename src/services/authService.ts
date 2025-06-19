/** @format */

// src/services/authService.ts
import { auth } from "@/services/baseURL";
import Cookies from "js-cookie";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  role: string;
  token: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

export interface CheckTokenResponse {
  status: boolean;
  expires_at: string;
  now: string;
  role: string;
  user: {
    id: string;
    email: string;
  };
}

export interface LogoutResponse {
  status: boolean;
  message: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await auth.post<LoginResponse>("/login", credentials);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async checkToken(): Promise<CheckTokenResponse> {
    try {
      const response = await auth({
        method: "post",
        url: "/cek_token",
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async logout(): Promise<LogoutResponse> {
    try {
      const response = await auth.post<LogoutResponse>("/logout");
      this.removeToken();
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Helper methods
  setToken(token: string): void {
    Cookies.set("token", token);
  }

  getToken(): string | null {
    return Cookies.get("token") || null;
  }

  removeToken(): void {
    Cookies.remove("token");
  }

  isTokenExpired(expiresAt: string): boolean {
    return new Date(expiresAt) < new Date();
  }
}

export const authService = new AuthService();
