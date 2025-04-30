// app/actions/updateL2LeadStatus.ts
"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials"; // ✅ central helper

export async function updateL2LeadStatus(
  contactId: string,
  status: string,
  brand: "litto" | "skwezed" = "litto" // ✅ optional brand parameter
) {
  const { baseUrl, token } = getHubspotCredentials(brand);

  console.log(brand, contactId);

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
            l2_lead_status: status,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return { success: true };
  } catch (error) {
    // return {
    //   success: false,
    //   message: `Failed to update l2_lead_status: ${(error as Error).message}`,
    // };
    console.error("❌ Full Error Object:", error); // full stack trace if available

    // If it's a Response object error, log more detail
    if (error instanceof Error) {
      console.error("❌ Error Message:", error.message);
    }

    return {
      success: false,
      message: `Failed to update l2_lead_status: ${
        error instanceof Error ? error.message : JSON.stringify(error)
      }`,
    };
  }
}
