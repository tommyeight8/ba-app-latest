"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials";

export async function getHubspotOwners(brand: "litto" | "skwezed") {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const res = await fetch(`${baseUrl}/crm/v3/owners/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store", // optional but recommended
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Failed to fetch owners:", errorText);
    throw new Error("Failed to fetch owners");
  }

  const data = await res.json();

  return data.results.map((owner: any) => ({
    id: owner.id,
    name:
      owner.firstName && owner.lastName
        ? `${owner.firstName} ${owner.lastName}`
        : owner.email || `Owner ${owner.id}`,
  }));
}
