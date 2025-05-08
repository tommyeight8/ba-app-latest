"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getHubspotCredentials } from "@/lib/getHubspotCredentials";
import { ContactSchema, CreateContactFormValues } from "@/lib/schemas";
import { getHubspotOwners } from "./getHubspotOwners";

export async function createNewContact(
  input: CreateContactFormValues,
  brand: "litto" | "skwezed" = "litto"
) {
  const session = await getServerSession(authOptions);
  const baEmail = session?.user?.email;

  if (!baEmail) {
    return { success: false, message: "Unauthorized: You must be logged in." };
  }

  // ✅ Get preferred or fallback owner
  let selectedOwnerId: string | undefined;

  try {
    const owners = await getHubspotOwners(brand);
    const hempOwner = owners.find(
      (owner: any) => owner.email?.toLowerCase() === "hemp@itslitto.com"
    );

    selectedOwnerId = hempOwner?.id || owners?.[0]?.id;

    if (!selectedOwnerId) {
      return { success: false, message: "No HubSpot owners found." };
    }
  } catch (error) {
    return { success: false, message: "Failed to fetch HubSpot owners." };
  }

  // ✅ Validate input
  const parse = ContactSchema.safeParse({
    ...input,
    ba_email: baEmail,
    hs_lead_status: "Samples",
    l2_lead_status: "pending visit",
    hubspot_owner_id: selectedOwnerId,
  });

  if (!parse.success) {
    const message = parse.error.errors[0]?.message || "Invalid input";
    return { success: false, message };
  }

  const { baseUrl, token } = getHubspotCredentials(brand);

  try {
    const response = await fetch(`${baseUrl}/crm/v3/objects/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties: parse.data }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, message: `Create failed: ${error}` };
    }

    const created = await response.json();
    return { success: true, contactId: created.id };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Unexpected error creating contact.",
    };
  }
}

// // app/actions/createNewContact.ts
// "use server";

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { getHubspotCredentials } from "@/lib/getHubspotCredentials";
// import { ContactSchema, CreateContactFormValues } from "@/lib/schemas";

// export async function createNewContact(
//   input: CreateContactFormValues,
//   brand: "litto" | "skwezed" = "litto"
// ) {
//   const session = await getServerSession(authOptions);
//   const baEmail = session?.user?.email;

//   if (!baEmail) {
//     return { success: false, message: "Unauthorized: You must be logged in." };
//   }

//   // Validate and enrich input with required defaults
//   const parse = ContactSchema.safeParse({
//     ...input,
//     ba_email: baEmail,
//     hs_lead_status: "Samples",
//     l2_lead_status: "pending visit",
//   });

//   if (!parse.success) {
//     const message = parse.error.errors[0]?.message || "Invalid input";
//     return { success: false, message };
//   }

//   const { baseUrl, token } = getHubspotCredentials(brand);

//   try {
//     const response = await fetch(`${baseUrl}/crm/v3/objects/contacts`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ properties: parse.data }),
//     });

//     if (!response.ok) {
//       const error = await response.text();
//       return { success: false, message: `Create failed: ${error}` };
//     }

//     const created = await response.json();
//     return { success: true, contactId: created.id };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error?.message || "Unexpected error creating contact.",
//     };
//   }
// }
