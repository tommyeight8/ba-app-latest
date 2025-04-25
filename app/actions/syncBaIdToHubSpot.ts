// app/actions/syncBaEmailDropdown.ts
"use server";

const baseUrl = process.env.HUBSPOT_API_BASE!;
const token = process.env.HUBSPOT_ACCESS_TOKEN!;
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

export async function syncBaEmailDropdown(email: string) {
  const propertyName = "ba_email";

  try {
    const exists = await checkDropdownPropertyExists(propertyName);

    if (!exists) {
      await createDropdownProperty(propertyName); // No email passed here
    }

    // Always try to add the email — it will silently skip if it already exists
    await addEmailAsDropdownOption(propertyName, email);

    return { success: true };
  } catch (err) {
    console.error("❌ Failed to sync BA Email dropdown:", err);
    return { error: "Failed to sync to HubSpot" };
  }
}

async function checkDropdownPropertyExists(
  propertyName: string
): Promise<boolean> {
  const res = await fetch(
    `${baseUrl}/crm/v3/properties/contacts/${propertyName}`,
    {
      headers,
    }
  );

  const json = await res.json();
  console.log("📋 Property check result:", res.status, json); // <-- DEBUG

  return res.status !== 404;
}

async function createDropdownProperty(propertyName: string) {
  const res = await fetch(`${baseUrl}/crm/v3/properties/contacts`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: propertyName,
      label: "BA Email",
      type: "enumeration",
      fieldType: "select",
      groupName: "contactinformation",
      options: [], // ⬅️ initially empty
    }),
  });

  const text = await res.text();
  console.log("HubSpot Create Property Response:", res.status, text);

  if (!res.ok) {
    throw new Error(`Failed to create dropdown: ${text}`);
  }
}

async function addEmailAsDropdownOption(propertyName: string, email: string) {
  // First, get existing options
  const res = await fetch(
    `${baseUrl}/crm/v3/properties/contacts/${propertyName}`,
    {
      headers,
    }
  );

  if (!res.ok) throw new Error("Failed to fetch existing dropdown options");

  const property = await res.json();

  const exists = property.options.some((opt: any) => opt.value === email);
  if (exists) {
    console.log("✅ Email already exists as option");
    return;
  }

  // Append new email option
  const updatedOptions = [...property.options, { label: email, value: email }];

  const patchRes = await fetch(
    `${baseUrl}/crm/v3/properties/contacts/${propertyName}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        options: updatedOptions,
      }),
    }
  );

  const resText = await patchRes.text();
  console.log(
    "📥 HubSpot Patch Option (v3) Response:",
    patchRes.status,
    resText
  );

  if (!patchRes.ok) {
    throw new Error(`❌ Failed to patch dropdown options: ${resText}`);
  }
}
