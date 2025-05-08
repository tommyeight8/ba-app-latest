"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials"; // ✅ import central helper

export async function fetchMeetingsByContact(
  contactId: string,
  brand: "litto" | "skwezed"
) {
  const { baseUrl, token } = getHubspotCredentials(brand);

  // Step 1: Fetch associated meeting IDs for the contact
  const assocRes = await fetch(
    `${baseUrl}/crm/v3/objects/contacts/${contactId}/associations/meetings`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const assocData = await assocRes.json();

  if (!assocRes.ok) {
    throw new Error(
      assocData.message || "Failed to fetch meeting associations"
    );
  }

  const meetingIds = assocData.results?.map((r: any) => r.id) ?? [];
  if (!meetingIds.length) return [];

  // Step 2: Fetch full meeting data using batch read
  const detailsRes = await fetch(
    `${baseUrl}/crm/v3/objects/meetings/batch/read`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: [
          "hs_meeting_title",
          "hs_meeting_body",
          "hs_timestamp",
          "hs_meeting_outcome",
        ],
        inputs: meetingIds.map((id: string) => ({ id })),
      }),
    }
  );

  const detailsData = await detailsRes.json();

  if (!detailsRes.ok) {
    throw new Error(detailsData.message || "Failed to fetch meeting details");
  }

  return (detailsData.results ?? []).sort((a: any, b: any) => {
    const timeA = new Date(a.properties?.hs_timestamp || 0).getTime();
    const timeB = new Date(b.properties?.hs_timestamp || 0).getTime();
    return timeB - timeA; // DESCENDING
  });
}
