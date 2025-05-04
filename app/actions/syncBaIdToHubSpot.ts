// app/actions/syncBaEmailDropdown.ts
"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials"; // ✅ import

export async function syncBaEmailDropdown(
  brand: "litto" | "skwezed",
  email: string
) {
  const { baseUrl, token } = getHubspotCredentials(brand);
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const propertyName = "ba_email";

  try {
    const exists = await checkDropdownPropertyExists(
      baseUrl,
      headers,
      propertyName
    );

    if (!exists) {
      await createDropdownProperty(baseUrl, headers, propertyName);
    }

    await addEmailAsDropdownOption(baseUrl, headers, propertyName, email);

    return { success: true };
  } catch (err) {
    console.error("❌ Failed to sync BA Email dropdown:", err);
    return { error: "Failed to sync to HubSpot" };
  }
}

async function checkDropdownPropertyExists(
  baseUrl: string,
  headers: HeadersInit,
  propertyName: string
): Promise<boolean> {
  const res = await fetch(
    `${baseUrl}/crm/v3/properties/contacts/${propertyName}`,
    {
      headers,
    }
  );

  const json = await res.json();

  return res.status !== 404;
}

async function createDropdownProperty(
  baseUrl: string,
  headers: HeadersInit,
  propertyName: string
) {
  const res = await fetch(`${baseUrl}/crm/v3/properties/contacts`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: propertyName,
      label: "BA Email",
      type: "enumeration",
      fieldType: "select",
      groupName: "contactinformation",
      options: [],
    }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Failed to create dropdown: ${text}`);
  }
}

async function addEmailAsDropdownOption(
  baseUrl: string,
  headers: HeadersInit,
  propertyName: string,
  email: string
) {
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

  if (!patchRes.ok) {
    throw new Error(`❌ Failed to patch dropdown options: ${resText}`);
  }
}
