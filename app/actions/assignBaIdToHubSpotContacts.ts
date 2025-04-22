"use server";

import { prisma } from "@/lib/prisma"; // adjust path as needed
import { revalidatePath } from "next/cache";

export async function assignBaIdToHubSpotContacts({
  contactIds,
  userId,
  baId,
}: {
  contactIds: string[];
  userId: string;
  baId: string;
}) {
  console.log(contactIds, userId, baId);
  // 1. Fetch the user to confirm role + association
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, message: "User not found" };

  // 2. Mark contacts with the selected ba_id (mocked here for HubSpot patching)
  // You would replace this with actual API PATCH calls
  const results = await Promise.all(
    contactIds.map(async (id) => {
      // send PATCH request to HubSpot (this is a placeholder)
      return fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            ba_id: baId,
          },
        }),
      });
    })
  );

  revalidatePath("/dashboard/admin");

  return {
    success: true,
    message: `Assigned BA ID to ${contactIds.length} contacts.`,
  };
}
