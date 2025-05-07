import { getHubspotCredentials } from "@/lib/getHubspotCredentials";

export async function searchContactsByPostalCodeAndStatus(
  zipCode: string,
  status: string,
  query: string,
  after: string,
  limit: number,
  brand: "litto" | "skwezed"
) {
  const { baseUrl, token } = getHubspotCredentials(brand);

  const contacts = await fetch(`${baseUrl}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "zip",
              operator: "EQ",
              value: zipCode,
            },
            status !== "all" && {
              propertyName: "l2_lead_status",
              operator: "EQ",
              value: status,
            },
            query && {
              propertyName: "email",
              operator: "CONTAINS",
              value: query,
            },
          ].filter(Boolean),
        },
      ],
      sorts: [],
      properties: ["email", "firstname", "lastname", "l2_lead_status"],
      limit,
      after,
    }),
  });

  const data = await contacts.json();
  return {
    results: data.results,
    paging: data.paging?.next?.after,
  };
}
