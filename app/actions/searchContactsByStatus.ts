"use server";

import { HubSpotContact } from "@/types/hubspot";

export async function searchContactsByStatus(
  status: string,
  after = "",
  limit = 12,
  email?: string // <-- optional user email for filtering by ba_email
): Promise<{ results: HubSpotContact[]; paging: string | null }> {
  const baseUrl = process.env.HUBSPOT_API_BASE;
  const token = process.env.HUBSPOT_ACCESS_TOKEN;

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

  // If email is passed, filter by ba_email too
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
        "ba_email", // include for reference
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
