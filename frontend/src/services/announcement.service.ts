import { apiDelete, apiGet, apiPost, apiPut, getApiErrorMessage } from "@/services/api";

export const announcementService = {
  async list() {
    try {
      const response = await apiGet(`/announcements`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async create(payload: Record<string, unknown>) {
    try {
      const response = await apiPost(`/announcements`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async update(id: string, payload: Record<string, unknown>) {
    try {
      const response = await apiPut(`/announcements/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async remove(id: string) {
    try {
      const response = await apiDelete(`/announcements/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
