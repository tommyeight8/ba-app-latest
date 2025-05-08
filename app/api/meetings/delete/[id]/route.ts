import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getHubspotCredentials } from "@/lib/getHubspotCredentials";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await the promise
  const cookieStore = await cookies();
  const brand = (cookieStore.get("selected_brand")?.value ?? "litto") as
    | "litto"
    | "skwezed";

  const { baseUrl, token } = getHubspotCredentials(brand);

  try {
    const res = await fetch(`${baseUrl}/crm/v3/objects/meetings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.message }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete meeting" },
      { status: 500 }
    );
  }
}
