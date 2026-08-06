import { apiGet, getApiErrorMessage } from "@/services/api";

export const dashboardService = {
  async getOverview() {
    try {
      const response = await apiGet(`/dashboard`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
