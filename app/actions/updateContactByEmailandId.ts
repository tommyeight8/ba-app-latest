// app/actions/updateContactIfMatch.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // adjust if needed

export async function updateContactIfMatch(
  contactId: string,
  updates: Record<string, string>
) {
  const baseUrl = process.env.HUBSPOT_API_BASE;
  const token = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!baseUrl || !token) {
    throw new Error("Missing HubSpot API credentials");
  }

  const session = await getServerSession(authOptions);
  const sessionEmail = session?.user?.email;
  if (!sessionEmail) {
    return { success: false, message: "You must be logged in." };
  }

  // Fetch contact by ID
  const res = await fetch(
    `${baseUrl}/crm/v3/objects/contacts/${contactId}?properties=ba_email`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const error = await res.text();
    return { success: false, message: `Failed to fetch contact: ${error}` };
  }

  const data = await res.json();
  const baEmail = data?.properties?.ba_email;

  if (!baEmail || baEmail.toLowerCase() !== sessionEmail.toLowerCase()) {
    return {
      success: false,
      message: `Unauthorized. Your email does not match the contact's ba_email.`,
    };
  }

  // Perform the update
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
    const error = await updateRes.text();
    return { success: false, message: `Update failed: ${error}` };
  }

  return { success: true };
}
