"use server";

import { HubSpotContact } from "@/types/hubspot";

interface HubSpotSearchResponse {
  results: HubSpotContact[];
  paging?: {
    next?: {
      after: string;
    };
  };
}

export async function fetchAllContactsByEmail(
  email: string
): Promise<HubSpotContact[]> {
  const baseUrl = process.env.HUBSPOT_API_BASE;
  const token = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!baseUrl || !token) {
    throw new Error("Missing HubSpot API credentials");
  }

  const properties = [
    "firstname",
    "lastname",
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

// // app/actions/fetchAllContactsByEmail.ts
// "use server";

// import { HubSpotContact } from "@/types/hubspot";

// export async function fetchAllContactsByEmail(
//   email: string
// ): Promise<{ results: HubSpotContact[] }> {
//   const baseUrl = process.env.HUBSPOT_API_BASE;
//   const token = process.env.HUBSPOT_ACCESS_TOKEN;

//   if (!baseUrl || !token) {
//     throw new Error("Missing HubSpot API credentials");
//   }

//   const url = `${baseUrl}/crm/v3/objects/contacts/search`;

//   const res = await fetch(url, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       filterGroups: [
//         {
//           filters: [
//             {
//               propertyName: "email",
//               operator: "EQ",
//               value: email,
//             },
//           ],
//         },
//       ],
//       properties: [
//         "firstname",
//         "lastname",
//         "email",
//         "company",
//         "phone",
//         "address",
//         "city",
//         "state",
//         "zip",
//         "hs_lead_status",
//         "l2_lead_status",
//       ],
//       limit: 100, // You can adjust or implement pagination later
//     }),
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`HubSpot Error ${res.status}: ${text}`);
//   }

//   const data = await res.json();

//   return {
//     results: data.results ?? [],
//   };
// }
