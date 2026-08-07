import { apiGet, apiPost, apiPut, getApiErrorMessage } from "@/services/api";

interface AuthResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: Record<string, unknown>;
  data?: { user?: Record<string, unknown>; token?: string; accessToken?: string; refreshToken?: string };
  message?: string;
}

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await apiPost<{ data: AuthResponse }>("/auth/login", { email, password });
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async register(payload: Record<string, unknown>) {
    try {
      const response = await apiPost<{ data: AuthResponse }>("/auth/register", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getMe() {
    try {
      const response = await apiGet<{ data: AuthResponse }>("/auth/me");
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async forgotPassword(email: string) {
    try {
      const response = await apiPost<{ data: { message?: string } }>("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updateProfile(payload: Record<string, unknown>) {
    try {
      const response = await apiPut<{ data: AuthResponse }>("/auth/me", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async changePassword(payload: { currentPassword: string; newPassword: string }) {
    try {
      const response = await apiPost<{ data: { message?: string } }>("/auth/change-password", payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
