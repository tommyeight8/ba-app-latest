"use server";

import { HubSpotContact } from "@/types/hubspot";
import { getHubspotCredentials } from "@/lib/getHubspotCredentials"; // ✅ import the helper

interface HubSpotSearchResponse {
  results: HubSpotContact[];
  paging?: {
    next?: {
      after: string;
    };
  };
}

export async function fetchAllContactsByEmail(
  email: string,
  brand: "litto" | "skwezed"
): Promise<HubSpotContact[]> {
  const { baseUrl, token } = getHubspotCredentials(brand); // ✅ cleaner

  if (!baseUrl || !token) {
    throw new Error(`❌ Missing HubSpot API credentials for ${brand}`);
  }

  // const properties =
  //   brand === "skwezed"
  //     ? ["email", "firstname", "lastname"]
  //     : [
  //         "firstname",
  //         "lastname",
  //         "email",
  //         "company",
  //         "phone",
  //         "address",
  //         "city",
  //         "state",
  //         "zip",
  //         "ba_email",
  //         "hs_lead_status",
  //         "l2_lead_status",
  //       ];
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
  ];

  const results: HubSpotContact[] = [];
  let after: string | undefined = undefined;

  do {
    const res: Response = await fetch(
      `${baseUrl}/crm/v3/objects/contacts/search`,
      {
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
                  propertyName: "ba_email",
                  operator: "EQ",
                  value: email,
                },
              ],
            },
          ],
          properties,
          limit: 100,
          after,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HubSpot Error ${res.status}: ${text}`);
    }

    const data: HubSpotSearchResponse = await res.json();
    results.push(...(data.results ?? []));

    after = data.paging?.next?.after;
  } while (after);

  return results;
}
