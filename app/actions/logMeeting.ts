"use server";

export async function logMeeting({
  contactId,
  title,
  body,
  meetingDate,
  endDate,
  outcome,
  meetingType,
  newFirstName,
}: {
  contactId: string;
  title: string;
  body: string;
  meetingDate: string;
  endDate: string;
  outcome: string;
  meetingType?: string;
  newFirstName?: string;
}) {
  const baseUrl = process.env.HUBSPOT_API_BASE || "https://api.hubapi.com";
  const token = process.env.HUBSPOT_ACCESS_TOKEN!;

  let finalFirstName = "Contact";

  // 🛠 Fetch contact's current first name
  const contactRes = await fetch(
    `${baseUrl}/crm/v3/objects/contacts/${contactId}?properties=firstname`,
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

    // 🛠 Only PATCH if the newFirstName is different
    if (newFirstName && newFirstName !== existingFirstName) {
      const updateRes = await fetch(
        `${baseUrl}/crm/v3/objects/contacts/${contactId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties: {
              firstname: newFirstName,
            },
          }),
        }
      );

      if (!updateRes.ok) {
        const err = await updateRes.json();
        console.error("Failed to update first name:", err);
      } else {
        finalFirstName = newFirstName;
      }
    } else {
      // No change needed, use existing
      finalFirstName = existingFirstName ?? "Contact";
    }
  } else {
    console.error("Failed to fetch contact data");
  }

  // 🛠 Create the meeting
  const response = await fetch(`${baseUrl}/crm/v3/objects/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        hs_meeting_title: `${title} with ${finalFirstName}`,
        hs_meeting_body: `Meeting with ${finalFirstName}: ${body}`,
        hs_timestamp: meetingDate,
        hs_meeting_start_time: new Date(meetingDate).toISOString(),
        hs_meeting_end_time: new Date(endDate).toISOString(),
        hs_meeting_outcome: outcome,
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

  return data;
}

// "use server";

// export async function logMeeting({
//   contactId,
//   title,
//   body,
//   meetingDate,
//   endDate,
//   outcome,
//   meetingType,
//   newFirstName,
// }: {
//   contactId: string;
//   title: string;
//   body: string;
//   meetingDate: string;
//   endDate: string;
//   outcome: string;
//   meetingType?: string; // ✅ make it optional
//   newFirstName?: string;
// }) {
//   const baseUrl = process.env.HUBSPOT_API_BASE || "https://api.hubapi.com";
//   const token = process.env.HUBSPOT_ACCESS_TOKEN!;

//   // 1. Update contact's first name if provided
//   if (newFirstName) {
//     const updateRes = await fetch(
//       `${baseUrl}/crm/v3/objects/contacts/${contactId}`,
//       {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           properties: {
//             firstname: newFirstName,
//           },
//         }),
//       }
//     );

//     if (!updateRes.ok) {
//       const err = await updateRes.json();
//       console.error("Failed to update first name:", err);
//     }
//   }

//   const firstName = newFirstName ?? "Contact";

//   // 2. Create the meeting and associate it with the contact
//   const response = await fetch(`${baseUrl}/crm/v3/objects/meetings`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       properties: {
//         hs_meeting_title: `${title} with ${firstName}`,
//         hs_meeting_body: `Meeting with ${firstName}: ${body}`,
//         hs_timestamp: meetingDate,
//         hs_meeting_start_time: new Date(meetingDate).toISOString(),
//         hs_meeting_end_time: new Date(endDate).toISOString(),
//         hs_meeting_outcome: outcome,
//       },
//       associations: [
//         {
//           to: { id: contactId },
//           types: [
//             {
//               associationCategory: "HUBSPOT_DEFINED",
//               associationTypeId: 200,
//             },
//           ],
//         },
//       ],
//     }),
//   });

//   const data = await response.json();
//   if (!response.ok) {
//     console.error("Meeting log failed:", data);
//     throw new Error(data.message || "Failed to log meeting");
//   }

//   return data;
// }
