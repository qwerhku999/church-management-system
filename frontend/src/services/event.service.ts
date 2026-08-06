import { apiDelete, apiGet, apiPost, apiPut, getApiErrorMessage } from "@/services/api";

export const eventService = {
  async list() {
    try {
      const response = await apiGet(`/events`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async get(id: string) {
    try {
      const response = await apiGet(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async create(payload: Record<string, unknown>) {
    try {
      const response = await apiPost(`/events`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async update(id: string, payload: Record<string, unknown>) {
    try {
      const response = await apiPut(`/events/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async remove(id: string) {
    try {
      const response = await apiDelete(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
