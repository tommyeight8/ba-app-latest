// app/actions/getHubspotTaskQueues.ts
"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials";

export async function getHubspotTaskQueues(brand: "litto" | "skwezed") {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const res = await fetch(`${baseUrl}/crm/v3/owners/queues`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Failed to fetch queues:", errorText);
    throw new Error("Failed to fetch task queues");
  }

  const data = await res.json();

  return data.results.map((queue: any) => ({
    id: queue.id,
    name: queue.name || `Queue ${queue.id}`,
  }));
}
