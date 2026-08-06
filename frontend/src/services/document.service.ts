import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getApiErrorMessage } from "@/services/api";

export const documentService = {
  async list(params?: Record<string, string | number | undefined>) {
    try {
      const response = await apiGet(`/documents`, { params });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async get(id: string) {
    try {
      const response = await apiGet(`/documents/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async upload(payload: FormData) {
    try {
      const response = await apiPost(`/documents`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async update(id: string, payload: Record<string, unknown>) {
    try {
      const response = await apiPut(`/documents/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async archive(id: string) {
    try {
      const response = await apiPatch(`/documents/${id}/archive`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async remove(id: string) {
    try {
      const response = await apiDelete(`/documents/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
