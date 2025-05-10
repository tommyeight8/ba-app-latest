"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials";
import {
  HubSpotContactResult,
  HubSpotFieldsResult,
  HubSpotContact,
} from "@/types/hubspot";

// interface HubSpotSearchResponse {
//   results: HubSpotContact[];
//   paging?: {
//     next?: {
//       after: string;
//     };
//   };
// }

type ContactSearchResult = {
  results: HubSpotContact[];
  paging?: {
    next?: {
      after: string;
    };
  };
};

export async function searchContactsByCompany(
  company: string,
  after = "",
  limit = 50,
  email?: string,
  brand: "litto" | "skwezed" = "litto"
): Promise<ContactSearchResult> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const filters = [
    {
      propertyName: "company",
      operator: "CONTAINS_TOKEN",
      value: company,
    },
  ];

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
      filterGroups: [{ filters }],
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

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HubSpot Error ${response.status}: ${text}`);
  }

  const data = await response.json();

  return {
    results: data.results ?? [],
    paging: data.paging ?? undefined,
  };
}

export async function searchContactsByCity(
  city: string,
  after = "",
  limit = 50,
  brand: "litto" | "skwezed" = "litto"
): Promise<{ results: HubSpotContact[]; paging: string | null }> {
  return searchContacts("city", city, after, limit, brand);
}

export async function searchContactsByPostalCode(
  postalCode: string,
  after = "",
  limit = 50,
  brand: "litto" | "skwezed" = "litto",
  options?: {
    company?: string;
    status?: string;
  }
): Promise<ContactSearchResult> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const filters = [
    { propertyName: "zip", operator: "EQ", value: postalCode },
    ...(options?.company
      ? [
          {
            propertyName: "company",
            operator: "CONTAINS_TOKEN",
            value: options.company,
          },
        ]
      : []),
    ...(options?.status && options.status !== "all"
      ? [
          {
            propertyName: "l2_lead_status",
            operator: "EQ",
            value: options.status,
          },
        ]
      : []),
  ];

  const res = await fetch(`${baseUrl}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filterGroups: [{ filters }],
      properties: [
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
        "hs_lead_status",
        "l2_lead_status",
        "ba_email",
      ],
      sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
      limit,
      ...(after ? { after } : {}),
    }),
  });

  const data = await res.json();

  return {
    results: data.results ?? [],
    paging: data.paging ?? undefined,
  };
}

async function searchContacts(
  property: string,
  value: string,
  after = "",
  limit = 50,
  email?: string,
  brand: "litto" | "skwezed" = "litto"
): Promise<{ results: HubSpotContact[]; paging: string | null }> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const filters = [
    {
      propertyName: property,
      operator: property === "company" ? "CONTAINS_TOKEN" : "EQ",
      value: value.toLowerCase().trim(), // normalize input
    },
  ];

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
        "jobtitle",
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
      sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
      limit,
      ...(after ? { after } : {}),
    }),
  });

  const data = await response.json();

  return {
    results: data.results ?? [],
    paging: data.paging?.next?.after ?? null,
  };
}

// app/actions/actions.ts or wherever this is defined
export async function fetchHubSpotContactsPaginated(
  limit = 12,
  after = "",
  baEmail?: string,
  brand: "litto" | "skwezed" = "litto"
) {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const props = [
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
    "hs_lead_status",
    "l2_lead_status",
    "ba_email",
  ];

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const filters = baEmail
    ? [
        {
          propertyName: "ba_email",
          operator: "EQ",
          value: baEmail,
        },
      ]
    : [];

  const body = {
    filterGroups: filters.length ? [{ filters }] : [],
    sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
    properties: props,
    limit,
    after: after || undefined,
  };

  const res = await fetch(`${baseUrl}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot search error: ${res.status} - ${text}`);
  }

  const data = await res.json();

  return {
    results: data.results ?? [],
    paging: data.paging ?? undefined,
  };
}
