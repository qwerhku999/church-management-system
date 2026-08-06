import { apiGet, apiPost, apiPut, apiDelete, getApiErrorMessage } from "@/services/api";

export const donationService = {
  async list() {
    try {
      const response = await apiGet(`/donations`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getSummary() {
    try {
      const response = await apiGet(`/donations/summary`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getTrend() {
    try {
      const response = await apiGet(`/donations/monthly-trend`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async create(payload: Record<string, unknown>) {
    try {
      const response = await apiPost(`/donations`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async update(id: string, payload: Record<string, unknown>) {
    try {
      const response = await apiPut(`/donations/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async remove(id: string) {
    try {
      const response = await apiDelete(`/donations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
