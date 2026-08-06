import { apiGet, apiPost, apiPut, apiDelete, getApiErrorMessage } from "@/services/api";

export const financeService = {
  async list() {
    try {
      const response = await apiGet(`/finance`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getSummary() {
    try {
      const response = await apiGet(`/finance/summary`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getMonthly() {
    try {
      const response = await apiGet(`/finance/monthly`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async create(payload: Record<string, unknown>) {
    try {
      const response = await apiPost(`/finance`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async update(id: string, payload: Record<string, unknown>) {
    try {
      const response = await apiPut(`/finance/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async remove(id: string) {
    try {
      const response = await apiDelete(`/finance/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
