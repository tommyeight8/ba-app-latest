import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Safely access the API URL or throw an error if undefined
    const hubSpotApiUrl = process.env.HUBSPOT_API_URL;
    if (!hubSpotApiUrl) {
      throw new Error(
        "HubSpot API URL is not defined in environment variables"
      );
    }

    const response = await fetch(hubSpotApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching contacts: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, contacts: data.results });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
