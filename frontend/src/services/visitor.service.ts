import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getApiErrorMessage } from "@/services/api";

export const visitorService = {
  async list() {
    try {
      const response = await apiGet(`/visitors`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getStats() {
    try {
      const response = await apiGet(`/visitors/stats`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async create(payload: Record<string, unknown>) {
    try {
      const response = await apiPost(`/visitors`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updateFollowUp(id: string, payload: Record<string, unknown>) {
    try {
      const response = await apiPatch(`/visitors/${id}/follow-up`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async remove(id: string) {
    try {
      const response = await apiDelete(`/visitors/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async update(id: string, payload: Record<string, unknown>) {
    try {
      const response = await apiPut(`/visitors/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
