"use server";

import { getHubspotCredentials } from "@/lib/getHubspotCredentials";

type CreateTaskOptions = {
  brand: "litto" | "skwezed";
  contactId: string;
  title: string;
  dueDate: Date;
  time?: string;
  priority?: "HIGH" | "MEDIUM" | "LOW" | "NONE";
  notes?: string;
  ownerId?: string;
};

export async function createTask({
  brand,
  contactId,
  title,
  dueDate,
  time = "08:00",
  priority = "NONE",
  notes = "",
  ownerId,
}: CreateTaskOptions) {
  const { baseUrl, token } = getHubspotCredentials(brand);

  // Set due date time
  const dueDateTime = new Date(dueDate);
  const [hour, minute] = time.split(":").map(Number);
  dueDateTime.setHours(hour, minute, 0, 0);

  const properties: Record<string, any> = {
    hs_task_subject: title,
    hs_task_body: notes,
    hs_timestamp: dueDateTime.toISOString(),
    hs_task_priority: priority,
    hs_task_status: "NOT_STARTED",
    hs_task_type: "TODO",
    hubspot_owner_id: ownerId || process.env.DEFAULT_OWNER_ID, // ✅ fallback if ownerId is missing
  };

  // Step 1: Create the task (no associations)
  const taskRes = await fetch(`${baseUrl}/crm/v3/objects/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });

  const taskData = await taskRes.json();

  if (!taskRes.ok) {
    console.error("❌ Failed to create task:", taskData);
    throw new Error(taskData.message || "Task creation failed");
  }

  const taskId = taskData.id;

  // Step 2: Associate task with contact using v4 default association
  const assocRes = await fetch(
    `${baseUrl}/crm/v4/objects/task/${taskId}/associations/default/contact/${contactId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!assocRes.ok) {
    const assocErr = await assocRes.text();
    console.error("❌ Failed to associate task with contact:", assocErr);
    throw new Error("Task created but association to contact failed");
  }

  return taskData;
}
