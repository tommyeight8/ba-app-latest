// app/actions/getTaskQueueIdByName.ts
"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials";
import { getContactById } from "@/app/actions/getContactById";

export async function getTaskQueueIdAndOwner(
  brand: "litto" | "skwezed",
  contactId: string
): Promise<any> {
  const { baseUrl, token } = getHubspotCredentials(brand);

  // Step 1: Get owner from contact
  const contact = await getContactById(contactId, brand);
  const ownerId = contact?.properties?.hubspot_owner_id;
  console.log("✅ Owner ID:", ownerId);

  // Step 2: Get tasks with queue membership info
  const res = await fetch(
    `${baseUrl}/crm/v3/objects/tasks?properties=hs_queue_membership_ids,hs_task_subject`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ Failed to fetch tasks:", data);
    throw new Error(data.message || "Failed to fetch tasks");
  }

  return {
    ownerId,
    tasks: data.results?.map((task: any) => ({
      id: task.id,
      subject: task.properties?.hs_task_subject,
      queueId: task.properties?.hs_queue_membership_ids ?? null,
    })),
  };
}

// // app/api/test/test-user/route.ts
// import { NextResponse } from "next/server";
// import { getHubspotCredentials } from "@/lib/getHubspotCredentials";

// export async function GET() {
//   const { baseUrl, token } = getHubspotCredentials("litto");

//   // Fetch users
//   const userRes = await fetch(`${baseUrl}/settings/v3/users`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   const userData = await userRes.json();
//   console.log("🔍 Users Response", JSON.stringify(userData, null, 2));

//   const ownerId =
//     userData?.results?.find((user: any) => user.active)?.id ?? null;

//   let queueId: string | null = null;

//   try {
//     const queueRes = await fetch(`${baseUrl}/crm/v3/objects/task_queues`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const queueData = await queueRes.json();
//     console.log("📦 Raw Queue Response:", JSON.stringify(queueData, null, 2));
//     console.log(
//       "📦 Queue results length:",
//       queueData?.results?.length ?? "undefined"
//     );

//     // Fallback: just grab first queue if none match owner
//     queueId =
//       queueData?.results?.find(
//         (queue: any) => queue?.properties?.ownerId === ownerId
//       )?.id ??
//       queueData?.results?.[0]?.id ??
//       null;
//   } catch (err) {
//     console.error("❌ Failed to fetch task queues", err);
//   }

//   return NextResponse.json({ ownerId, queueId });
// }
