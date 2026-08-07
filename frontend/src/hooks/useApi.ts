"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { apiGet } from "@/services/api";

/**
 * Generic SWR-based data hook. Works with both the live backend and the
 * mock fallback layer since it goes through the shared `apiGet` helper.
 * `select` lets each caller pluck the shape it needs from the API envelope.
 */
export function useApi<T = unknown>(
  key: string | null,
  select?: (body: unknown) => T,
  config?: SWRConfiguration
) {
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async (url: string) => {
      const res = await apiGet(url);
      const body = res.data;
      return (select ? select(body) : body) as T;
    },
    {
      revalidateOnFocus: false,
      ...config,
    }
  );

  return { data, error, isLoading, mutate };
}
