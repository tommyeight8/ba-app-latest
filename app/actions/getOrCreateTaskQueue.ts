"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials";

export async function getOrCreateTaskQueue(
  brand: "litto" | "skwezed",
  queueName = "Ba sample drop off"
): Promise<string | null> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  // Step 1: Get existing queues
  const listRes = await fetch(`${baseUrl}/crm/v3/objects/queues`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store", // prevent caching
  });

  const listData = await listRes.json();

  const existing = listData?.results?.find(
    (q: any) =>
      q.properties?.name?.trim().toLowerCase() === queueName.toLowerCase()
  );

  if (existing) return existing.id;

  // Step 2: Create new queue if not found
  const createRes = await fetch(`${baseUrl}/crm/v3/objects/queues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        name: queueName,
      },
    }),
  });

  if (!createRes.ok) {
    console.error("❌ Failed to create queue:", await createRes.text());
    return null;
  }

  const createData = await createRes.json();
  return createData.id;
}
