// hooks/useContactDetail.ts
"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { HubSpotContact } from "@/types/hubspot";

const fetchContactById = async (id: string): Promise<HubSpotContact> => {
  const res = await fetch(`/api/contacts/${id}`);
  if (!res.ok) throw new Error("Failed to fetch contact");
  return res.json();
};

export function useContactDetail(id: string) {
  const router = useRouter();
  const state = (router as any)?.location?.state;
  const fallback = state?.contact ?? null;

  const { data, error, isLoading, mutate } = useSWR(
    `/api/contacts/${id}`,
    () => fetchContactById(id),
    {
      fallbackData: fallback,
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
