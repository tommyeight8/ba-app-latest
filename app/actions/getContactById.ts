// app/actions/getContactById.ts
import { HubSpotContact } from "@/types/hubspot";

export async function getContactById(
  id: string
): Promise<HubSpotContact | null> {
  const baseUrl = process.env.HUBSPOT_API_BASE;
  const token = process.env.HUBSPOT_ACCESS_TOKEN;

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

// import { HubSpotContact } from "@/types/hubspot";

// export async function getContactById(
//   id: string
// ): Promise<HubSpotContact | null> {
//   const baseUrl = process.env.HUBSPOT_API_BASE;
//   const token = process.env.HUBSPOT_ACCESS_TOKEN;

//   const res = await fetch(
//     `${baseUrl}/crm/v3/objects/contacts/${id}?properties=firstname,lastname,email,phone,company,address,city,zip`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   if (!res.ok) return null;

//   const data = await res.json();
//   return data;
// }
