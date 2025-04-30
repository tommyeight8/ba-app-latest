"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials"; // ✅ import central helper

export async function fetchMeetingsByContact(
  contactId: string,
  brand: "litto" | "skwezed"
) {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const response = await fetch(
    `${baseUrl}/crm/v3/objects/meetings?associations=contact&properties=hs_meeting_title,hs_meeting_body,hs_timestamp,hs_meeting_outcome&limit=50`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch meetings");
  }

  const meetings = data.results
    .filter((meeting: any) => {
      return meeting.associations?.contacts?.results?.some(
        (c: any) => c.id === contactId
      );
    })
    .sort((a: any, b: any) => {
      const timeA = new Date(a.properties?.hs_timestamp || 0).getTime();
      const timeB = new Date(b.properties?.hs_timestamp || 0).getTime();
      return timeB - timeA; // DESCENDING
    });

  return meetings;
}
