import {
  apiGet,
  apiPatch,
  apiPost,
  apiDelete,
  getApiErrorMessage,
} from "@/services/api";

export interface ManagedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role:
    | "super_admin"
    | "admin"
    | "pastor"
    | "secretary"
    | "treasurer"
    | "finance_officer"
    | "ministry_leader"
    | "volunteer"
    | "member";
  isActive: boolean;
  isEmailVerified?: boolean;
  lastLogin?: string | null;
  createdAt?: string;
}

export interface UsersResponse {
  data?: ManagedUser[];
  users?: ManagedUser[];
  pagination?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
}

export const usersService = {
  async getUsers(params?: {
    search?: string;
    role?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    try {
      const response = await apiGet<UsersResponse>("/users", {
        params,
      });

      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updateRole(userId: string, role: string) {
    try {
      const response = await apiPatch<{
        data?: { user?: ManagedUser };
      }>(`/users/${userId}/role`, { role });

      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async toggleStatus(userId: string) {
    try {
      const response = await apiPatch<{
        data?: { user?: ManagedUser };
      }>(`/users/${userId}/status`);

      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async deleteUser(userId: string) {
    try {
      const response = await apiDelete(`/users/${userId}`);

      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async createUser(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }) {
    try {
      const response = await apiPost<{
        data?: { user?: ManagedUser };
      }>("/users", payload);

      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};