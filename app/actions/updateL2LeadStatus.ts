"use server";

const baseUrl = process.env.HUBSPOT_API_BASE;
const token = process.env.HUBSPOT_ACCESS_TOKEN;

export async function updateL2LeadStatus(contactId: string, status: string) {
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
    return {
      success: false,
      message: `Failed to update l2_lead_status: ${error}`,
    };
  }
}
