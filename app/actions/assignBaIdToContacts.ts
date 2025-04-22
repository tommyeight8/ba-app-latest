// actions/assignBaIdToContacts.ts
"use server";

export async function assignBaIdToContacts(contactIds: string[], baId: string) {
  const baseUrl = process.env.HUBSPOT_API_BASE;
  const token = process.env.HUBSPOT_ACCESS_TOKEN;

  const results = await Promise.allSettled(
    contactIds.map((id) =>
      fetch(`${baseUrl}/crm/v3/objects/contacts/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            ba_id: baId,
          },
        }),
      })
    )
  );

  const failed = results.filter((r) => r.status === "rejected");
  return {
    success: failed.length === 0,
    message: `${contactIds.length - failed.length} updated, ${
      failed.length
    } failed`,
  };
}
