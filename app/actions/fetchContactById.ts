"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials";

export async function fetchContactById(id: string, brand: "litto" | "skwezed") {
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
    "l2_lead_status", // ✅ needed for badge
  ];

  const url = `${baseUrl}/crm/v3/objects/contacts/${id}?properties=${props.join(
    ","
  )}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch contact by ID: ${await res.text()}`);
  }

  const contact = await res.json();
  return contact;
}
