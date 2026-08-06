import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  getApiErrorMessage,
} from "@/services/api";

export const notificationService = {
  async list() {
    try {
      const response = await apiGet("/notifications");
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async markAsRead(id: string) {
    try {
      const response = await apiPatch(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async markAllAsRead() {
    try {
      const response = await apiPatch("/notifications/read-all");
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async clearAll() {
    try {
      const response = await apiDelete("/notifications/clear");
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async send(payload: Record<string, unknown>) {
    try {
      const response = await apiPost("/notifications/send", payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};