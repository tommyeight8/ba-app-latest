import { NextRequest, NextResponse } from "next/server";
import { fetchMeetingsByContact } from "@/app/actions/fetchMeetingsByContact";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  const { contactId } = await params;
  const cookieStore = await cookies(); // no `await` needed anymore in Next 15
  const brand = (cookieStore.get("selected_brand")?.value ?? "litto") as
    | "litto"
    | "skwezed";

  if (!contactId) {
    return NextResponse.json({ error: "Missing contactId" }, { status: 400 });
  }

  try {
    const meetings = await fetchMeetingsByContact(contactId, brand);
    return NextResponse.json(meetings);
  } catch (error: any) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}
