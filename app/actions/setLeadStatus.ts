"use server";

const baseUrl = process.env.HUBSPOT_API_BASE;
const token = process.env.HUBSPOT_ACCESS_TOKEN;

import { revalidatePath } from "next/cache";

export async function setLeadStatusToSamples(contactId: string) {
  try {
    const response = await fetch(
      `${baseUrl}/crm/v3/objects/contacts/${contactId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            hs_lead_status: "Samples",
            l2_lead_status: "pending visit",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    // Optional: revalidate UI
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `Failed to update lead_status: ${error}`,
    };
  }
}
