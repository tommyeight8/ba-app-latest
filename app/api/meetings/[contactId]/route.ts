import { NextRequest, NextResponse } from "next/server";
import { fetchMeetingsByContact } from "@/app/actions/fetchMeetingsByContact";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  const { contactId } = await params;

  if (!contactId) {
    return NextResponse.json({ error: "Missing contactId" }, { status: 400 });
  }

  try {
    const meetings = await fetchMeetingsByContact(contactId);
    return NextResponse.json(meetings);
  } catch (error: any) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { fetchMeetingsByContact } from "@/app/actions/fetchMeetingsByContact";

// export async function GET(
//   req: NextRequest,
//   context: { params: { contactId: string } }
// ) {
//   const { contactId } = await context.params;

//   if (!contactId) {
//     return NextResponse.json({ error: "Missing contactId" }, { status: 400 });
//   }

//   try {
//     const meetings = await fetchMeetingsByContact(contactId);
//     return NextResponse.json(meetings);
//   } catch (error: any) {
//     console.error("Error fetching meetings:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to fetch meetings" },
//       { status: 500 }
//     );
//   }
// }
