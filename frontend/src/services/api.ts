import api from "@/lib/axios";

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  pagination?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
  [key: string]: unknown;
}

export const getApiErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || "Request failed";
  }
  return "Unexpected error";
};

export const apiGet = <T = ApiResponse>(url: string, config?: object) => api.get<T>(url, config);
export const apiPost = <T = ApiResponse>(url: string, data?: unknown, config?: object) => api.post<T>(url, data, config);
export const apiPut = <T = ApiResponse>(url: string, data?: unknown, config?: object) => api.put<T>(url, data, config);
export const apiPatch = <T = ApiResponse>(url: string, data?: unknown, config?: object) => api.patch<T>(url, data, config);
export const apiDelete = <T = ApiResponse>(url: string, config?: object) => api.delete<T>(url, config);
