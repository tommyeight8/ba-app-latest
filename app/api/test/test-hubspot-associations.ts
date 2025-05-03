// app/api/test-hubspot-associations/route.ts

export async function GET() {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;

  if (!token) {
    return Response.json(
      { error: "Missing HUBSPOT_PRIVATE_APP_TOKEN" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      "https://api.hubapi.com/crm/v4/associations/task/contact/types",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("❌ Failed to fetch association types:", error);
      return Response.json(
        { error: error || "Failed to fetch types" },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("✅ Available Task → Contact associations:", data);

    return Response.json({ associations: data }, { status: 200 });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return Response.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
