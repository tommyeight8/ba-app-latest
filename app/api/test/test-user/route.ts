// app/api/test-queue/route.ts
import { NextResponse } from "next/server";
import { getHubspotOwners } from "@/app/actions/getHubspotOwners";

// Replace 'litto' with a query param if needed
export async function GET() {
  try {
    const owners = await getHubspotOwners("litto");

    return NextResponse.json({
      success: true,
      owners,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch HubSpot owners",
      },
      { status: 500 }
    );
  }
}
