"use server";

const baseUrl = process.env.HUBSPOT_API_BASE;
const token = process.env.HUBSPOT_ACCESS_TOKEN;

export async function fetchContactById(id: string) {
  const props = [
    "firstname",
    "lastname",
    "email",
    "company",
    "phone",
    "address",
    "city",
    "state",
    "zip",
    "hs_lead_status",
    "l2_lead_status", // ✅ needed for badge
  ];

  const url = `${baseUrl}/crm/v3/objects/contacts/${id}?properties=${props.join(
    ","
  )}`;

  const res = await fetch(
    `${baseUrl}/crm/v3/objects/contacts/${id}?properties=${props.join(",")}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch contact by ID");
  }

  const contact = await res.json();
  return contact;
}
