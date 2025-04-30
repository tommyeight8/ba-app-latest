"use server";

import {
  HubSpotContactResult,
  HubSpotFieldsResult,
  HubSpotContact,
} from "@/types/hubspot";
import { getHubspotCredentials } from "@/lib/getHubspotCredentials"; // ✅ import central helper

// --- Fetch Contact Properties ---
export const fetchContactProperties = async (brand: "litto" | "skwezed") => {
  const { baseUrl, token } = getHubspotCredentials(brand);

  try {
    const res = await fetch(`${baseUrl}/properties/v1/contacts/properties`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: `Error ${res.status}: ${text}` };
    }

    const data = await res.json();

    return {
      success: true,
      fields: data,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};

// --- Fetch All Contacts ---
export async function fetchHubSpotContacts(
  brand: "litto" | "skwezed"
): Promise<HubSpotContactResult> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const props = [
    "firstname",
    "lastname",
    "email",
    "company",
    "city",
    "state",
    "zip",
    "address",
    "phone",
  ];

  const url = `${baseUrl}/crm/v3/objects/contacts?limit=100&properties=${props.join(
    ","
  )}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        success: false,
        error: `HubSpot error: ${res.status} - ${text}`,
      };
    }

    const data = await res.json();
    return { success: true, contacts: data.results };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// --- Fetch All Contact Fields ---
export async function fetchAllContactFields(
  brand: "litto" | "skwezed"
): Promise<HubSpotFieldsResult> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  try {
    const response = await fetch(`${baseUrl}/crm/v3/properties/contacts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `Error: ${response.status} - ${text}` };
    }

    const data = await response.json();
    return { success: true, fields: data.results };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// --- Search by Company ---
export async function searchContactsByCompany(
  company: string,
  brand: "litto" | "skwezed",
  after = "",
  limit = 50
) {
  return searchContacts("company", company, brand, after, limit);
}

// --- Search by Postal Code ---
export async function searchContactsByPostalCode(
  postalCode: string,
  brand: "litto" | "skwezed",
  after = "",
  limit = 50
) {
  return searchContacts("zip", postalCode, brand, after, limit);
}

// --- Search by City ---
export async function searchContactsByCity(
  city: string,
  brand: "litto" | "skwezed",
  after = "",
  limit = 50
) {
  return searchContacts("city", city, brand, after, limit);
}

// --- Generic Search ---
async function searchContacts(
  field: string,
  value: string,
  brand: "litto" | "skwezed",
  after = "",
  limit = 50
): Promise<{ results: HubSpotContact[]; paging: string | null }> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const url = `${baseUrl}/crm/v3/objects/contacts/search`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: field,
              operator: "CONTAINS_TOKEN",
              value,
            },
          ],
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
      ],
      limit,
      after: after || undefined,
    }),
  });

  const data = await res.json();

  return {
    results: data.results ?? [],
    paging: data.paging?.next?.after ?? null,
  };
}

// --- Fetch Paginated Contacts ---
export async function fetchHubSpotContactsPaginated(
  limit = 10,
  after = "",
  brand: "litto" | "skwezed"
) {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const props = [
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
  ];

  const url = `${baseUrl}/crm/v3/objects/contacts?limit=${limit}${
    after ? `&after=${after}` : ""
  }&properties=${props.join(",")}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`HubSpot fetch error: ${res.statusText}`);
  }

  const data = await res.json();

  return {
    results: data.results,
    next: data.paging?.next?.after ?? null,
  };
}

// --- Fetch Total Contact Count ---
export async function fetchHubSpotContactsTotalCount(
  brand: "litto" | "skwezed"
): Promise<number> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const url = `${baseUrl}/crm/v3/objects/contacts?limit=1`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch total contact count");
  }

  const data = await res.json();
  return data.total ?? 0;
}
