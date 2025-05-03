"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials";

export async function getHubspotQueueId(
  brand: "litto" | "skwezed",
  queueLabel: string = "Ba sample drop off"
): Promise<string | null> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const res = await fetch(`${baseUrl}/crm/v3/objects/task_queues`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Failed to fetch task queues:", errorText);
    throw new Error("Failed to fetch task queues");
  }

  const data = await res.json();

  const match = data.results.find(
    (q: any) => q.properties?.name?.toLowerCase() === queueLabel.toLowerCase()
  );

  return match?.id || null;
}
