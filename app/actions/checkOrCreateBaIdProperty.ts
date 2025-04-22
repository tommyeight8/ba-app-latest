// actions/checkOrCreateBaIdProperty.ts
"use server";

export async function ensureBaIdPropertyExists() {
  const baseUrl = process.env.HUBSPOT_API_BASE;
  const token = process.env.HUBSPOT_ACCESS_TOKEN;

  const propertyName = "ba_id";

  // Step 1: Try to fetch the property
  const getRes = await fetch(
    `${baseUrl}/crm/v3/properties/contacts/${propertyName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  // If property exists, nothing else to do
  if (getRes.ok) return { success: true, message: "Property already exists" };

  // If not found, create it
  if (getRes.status === 404) {
    const createRes = await fetch(`${baseUrl}/crm/v3/properties/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: propertyName,
        label: "BA Id",
        type: "string",
        fieldType: "text",
        groupName: "contactinformation", // default group
      }),
    });

    if (!createRes.ok) {
      const text = await createRes.text();
      return { success: false, error: `Failed to create property: ${text}` };
    }

    return { success: true, message: "Property created" };
  }

  // Something else went wrong
  const errorText = await getRes.text();
  return { success: false, error: `Unexpected error: ${errorText}` };
}
