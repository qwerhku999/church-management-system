import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
  getApiErrorMessage,
} from "@/services/api";

export const eventService = {
  async list(params?: Record<string, unknown>) {
    try {
      const query = params
        ? `?${new URLSearchParams(
          Object.entries(params).reduce(
            (result, [key, value]) => {
              if (
                value !== undefined &&
                value !== null &&
                value !== ""
              ) {
                result[key] = String(value);
              }

              return result;
            },
            {} as Record<string, string>
          )
        ).toString()}`
        : "";

      const response = await apiGet(
        `/events${query}`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error)
      );
    }
  },

  async get(id: string) {
    try {
      const response = await apiGet(
        `/events/${id}`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error)
      );
    }
  },

  async calendar(
    month: number,
    year: number
  ) {
    try {
      const response = await apiGet(
        `/events/calendar?month=${month}&year=${year}`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error)
      );
    }
  },

  async create(
    payload: Record<string, unknown>
  ) {
    try {
      const response = await apiPost(
        `/events`,
        payload
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error)
      );
    }
  },

  async update(
    id: string,
    payload: Record<string, unknown>
  ) {
    try {
      const response = await apiPut(
        `/events/${id}`,
        payload
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error)
      );
    }
  },

  async publish(id: string) {
    try {
      const response = await apiPatch(
        `/events/${id}/publish`,
        {}
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error)
      );
    }
  },

  async remove(id: string) {
    try {
      const response = await apiDelete(
        `/events/${id}`
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error)
      );
    }
  },
};