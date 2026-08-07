import api from "@/lib/axios";
import { resolveMock } from "@/services/mock/mockData";

export interface ApiResponse<T = unknown> {
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

/**
 * When no backend URL is configured (or it is unreachable) the app falls
 * back to the isolated mock layer so the UI is fully explorable. As soon as
 * NEXT_PUBLIC_API_URL is set to a running MinistryFlow API, every request is
 * sent to the real backend instead.
 */
export const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

interface RequestConfig {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  [key: string]: unknown;
}

function mockResponse<T>(url: string, method: string, config?: RequestConfig, data?: unknown) {
  const body = resolveMock(method, url, { params: config?.params, data });
  return { data: body as T, status: 200, statusText: "OK", headers: {}, config: {} } as {
    data: T;
  };
}

function isNetworkError(error: unknown) {
  const err = error as { response?: unknown; code?: string; message?: string };
  return !err?.response || err?.code === "ERR_NETWORK" || err?.message === "Network Error";
}

export const getApiErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || "Request failed";
  }
  return "Unexpected error";
};

export const apiGet = async <T = ApiResponse>(url: string, config?: RequestConfig) => {
  if (USE_MOCK) return mockResponse<T>(url, "GET", config);
  try {
    return await api.get<T>(url, config);
  } catch (error) {
    if (isNetworkError(error)) return mockResponse<T>(url, "GET", config);
    throw error;
  }
};

export const apiPost = async <T = ApiResponse>(url: string, data?: unknown, config?: RequestConfig) => {
  if (USE_MOCK) return mockResponse<T>(url, "POST", config, data);
  try {
    return await api.post<T>(url, data, config);
  } catch (error) {
    if (isNetworkError(error)) return mockResponse<T>(url, "POST", config, data);
    throw error;
  }
};

export const apiPut = async <T = ApiResponse>(url: string, data?: unknown, config?: RequestConfig) => {
  if (USE_MOCK) return mockResponse<T>(url, "PUT", config, data);
  try {
    return await api.put<T>(url, data, config);
  } catch (error) {
    if (isNetworkError(error)) return mockResponse<T>(url, "PUT", config, data);
    throw error;
  }
};

export const apiPatch = async <T = ApiResponse>(url: string, data?: unknown, config?: RequestConfig) => {
  if (USE_MOCK) return mockResponse<T>(url, "PATCH", config, data);
  try {
    return await api.patch<T>(url, data, config);
  } catch (error) {
    if (isNetworkError(error)) return mockResponse<T>(url, "PATCH", config, data);
    throw error;
  }
};

export const apiDelete = async <T = ApiResponse>(url: string, config?: RequestConfig) => {
  if (USE_MOCK) return mockResponse<T>(url, "DELETE", config);
  try {
    return await api.delete<T>(url, config);
  } catch (error) {
    if (isNetworkError(error)) return mockResponse<T>(url, "DELETE", config);
    throw error;
  }
};
