"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials";
import { createTask } from "./createTask";

export async function logMeeting({
  brand,
  contactId,
  title,
  body,
  newFirstName,
  jobTitle,
  l2Status, // ✅ new
  ownerId, // Owner Id
}: {
  brand: "litto" | "skwezed";
  contactId: string;
  title: string;
  body: string;
  newFirstName?: string;
  jobTitle: string;
  ownerId?: string;
  l2Status: "pending visit" | "visit requested by rep" | "dropped off";
}) {
  const { baseUrl, token } = getHubspotCredentials(brand);

  let finalFirstName = "Contact";
  let finalJobTitle = "Staff";
  let existingCompany = "Store"; // ✅ moved here so it's accessible later

  // Fetch contact data
  const contactRes = await fetch(
    `${baseUrl}/crm/v3/objects/contacts/${contactId}?properties=firstname,jobtitle,company`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (contactRes.ok) {
    const contactData = await contactRes.json();
    const existingFirstName = contactData?.properties?.firstname || null;
    const existingJobTitle = contactData?.properties?.jobtitle || null;
    const existingL2Status = contactData?.properties?.l2_lead_status || null;

    existingCompany = contactData?.properties?.company || "Store"; // ✅ now correctly scoped

    const updates: Record<string, string> = {};

    if (newFirstName && newFirstName !== existingFirstName) {
      updates.firstname = newFirstName;
      finalFirstName = newFirstName;
    } else {
      finalFirstName = existingFirstName ?? "Contact";
    }

    if (jobTitle && jobTitle !== existingJobTitle) {
      updates.jobtitle = jobTitle;
      finalJobTitle = jobTitle;
    } else {
      finalJobTitle = existingJobTitle ?? "Staff";
    }

    if (l2Status && l2Status !== existingL2Status) {
      updates.l2_lead_status = l2Status;
    }

    if (Object.keys(updates).length > 0) {
      const updateRes = await fetch(
        `${baseUrl}/crm/v3/objects/contacts/${contactId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ properties: updates }),
        }
      );

      if (!updateRes.ok) {
        const err = await updateRes.json();
        console.error("Failed to update contact properties:", err);
      }
    }
  } else {
    console.error("Failed to fetch contact data");
  }

  // Create the meeting
  const now = new Date();
  const startTime = now.toISOString();
  const endTime = new Date(now.getTime() + 30 * 60 * 1000).toISOString(); // 30 min
  const generatedTitle = `Met with ${finalFirstName} at ${existingCompany}`;

  // 🆕 create follow-up task 3 business days later at 8AM
  let dueDate = new Date(now);
  let added = 0;
  while (added < 3) {
    dueDate.setDate(dueDate.getDate() + 1);
    if (![0, 6].includes(dueDate.getDay())) added++; // skip weekends
  }
  dueDate.setHours(8, 0, 0, 0); // 8:00 AM

  await createTask({
    brand,
    contactId,
    title: "Follow up with BA sample drop off",
    dueDate, // already set to correct time
    time: "08:00", // optional if date includes time
    priority: "NONE",
    notes: `Meeting summary:\n${body}`,
    ownerId,
  });

  const response = await fetch(`${baseUrl}/crm/v3/objects/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        hs_meeting_title: generatedTitle, // Title
        hs_meeting_body: `Meeting with ${finalFirstName} (${finalJobTitle}): ${body}`, // Meeting notes
        hs_meeting_start_time: startTime, // Duration start
        hs_meeting_end_time: endTime, // Duration end
        hs_timestamp: now.getTime(), // Date
        hs_meeting_outcome: "COMPLETED", // Outcome
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 200,
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Meeting log failed:", data);
    throw new Error(data.message || "Failed to log meeting");
  }

  // return data;
  // ✅ Fetch full meeting details by ID for optimistic update
  const meetingId = data.id;
  const detailRes = await fetch(
    `${baseUrl}/crm/v3/objects/meetings/${meetingId}?properties=hs_meeting_title,hs_meeting_body,hs_timestamp,hs_meeting_outcome`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!detailRes.ok) {
    const err = await detailRes.json();
    console.error("Failed to fetch full meeting details:", err);
    throw new Error(err.message || "Failed to fetch meeting details");
  }

  const fullMeeting = await detailRes.json();
  return {
    ...fullMeeting,
    properties: {
      ...fullMeeting.properties,
      l2Status, // manually add it back in
    },
  };
}
