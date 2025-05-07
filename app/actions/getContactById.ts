"use server";

import { HubSpotContact } from "@/types/hubspot";
import { getHubspotCredentials } from "@/lib/getHubspotCredentials"; // ✅ import central helper

export async function getContactById(
  id: string,
  brand: "litto" | "skwezed"
): Promise<HubSpotContact | null> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const properties = [
    "firstname",
    "lastname",
    "jobtitle",
    "email",
    "company",
    "phone",
    "address",
    "city",
    "state",
    "zip",
    "ba_email",
    "hs_lead_status",
    "l2_lead_status",
    "hubspot_owner_id",
  ];

  const params = new URLSearchParams({
    properties: properties.join(","),
  });

  const url = `${baseUrl}/crm/v3/objects/contacts/${id}?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}
