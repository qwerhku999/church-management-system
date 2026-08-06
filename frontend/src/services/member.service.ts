import { apiDelete, apiGet, apiPost, apiPut, getApiErrorMessage } from "@/services/api";

interface MemberPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  membershipStatus?: string;
  ministry?: string;
  [key: string]: unknown;
}

export const memberService = {
  async list(params?: Record<string, string | number | undefined>) {
    try {
      const response = await apiGet(`/members`, { params });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async get(id: string) {
    try {
      const response = await apiGet(`/members/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async create(payload: MemberPayload) {
    try {
      const response = await apiPost(`/members`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async update(id: string, payload: MemberPayload) {
    try {
      const response = await apiPut(`/members/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async remove(id: string) {
    try {
      const response = await apiDelete(`/members/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
