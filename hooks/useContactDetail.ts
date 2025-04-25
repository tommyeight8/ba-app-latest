"use client";

import useSWR from "swr";
import { HubSpotContact } from "@/types/hubspot";

const fetchContactById = async (id: string): Promise<HubSpotContact> => {
  const res = await fetch(`/api/contacts/${id}`);
  if (!res.ok) throw new Error("Failed to fetch contact");
  return res.json();
};

export function useContactDetail(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/contacts/${id}` : null,
    () => fetchContactById(id),
    {
      revalidateOnFocus: true,
    }
  );

  return {
    contact: data,
    error,
    isLoading,
    mutate,
  };
}
