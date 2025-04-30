"use server";

import { HubSpotContact } from "@/types/hubspot";
import { getHubspotCredentials } from "@/lib/getHubspotCredentials";

export async function searchContactsByStatus(
  status: string,
  after = "",
  limit = 12,
  email?: string,
  brand: "litto" | "skwezed" = "litto" // 🔥 optional brand argument, default to litto
): Promise<{ results: HubSpotContact[]; paging: string | null }> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const filters =
    status === "none"
      ? [
          {
            propertyName: "l2_lead_status",
            operator: "NOT_HAS_PROPERTY",
          },
        ]
      : [
          {
            propertyName: "l2_lead_status",
            operator: "EQ",
            value: status,
          },
        ];

  // If email is passed, add an extra filter
  if (email) {
    filters.push({
      propertyName: "ba_email",
      operator: "EQ",
      value: email,
    });
  }

  const response = await fetch(`${baseUrl}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters,
        },
      ],
      properties: [
        "firstname",
        "lastname",
        "email",
        "company",
        "phone",
        "address",
        "city",
        "state",
        "zip",
        "hs_lead_status",
        "l2_lead_status",
        "ba_email",
      ],
      limit,
      after: after || undefined,
    }),
  });

  const data = await response.json();

  return {
    results: data.results ?? [],
    paging: data.paging?.next?.after ?? null,
  };
}
