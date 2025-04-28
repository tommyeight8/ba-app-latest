import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ✅ required for dynamic API routes

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <-- must use Promise<>
) {
  const { id } = await params; // <-- await params here
  const { title, body, outcome } = await req.json();
  const baseUrl = process.env.HUBSPOT_API_BASE!;
  const token = process.env.HUBSPOT_ACCESS_TOKEN!;

  try {
    const res = await fetch(`${baseUrl}/crm/v3/objects/meetings/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          hs_meeting_title: title,
          hs_meeting_body: body,
          hs_meeting_outcome: outcome,
        },
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";

// export async function PUT(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   const { id } = context.params;
//   const { title, body, outcome } = await req.json();
//   const baseUrl = process.env.HUBSPOT_API_BASE!;
//   const token = process.env.HUBSPOT_ACCESS_TOKEN!;

//   try {
//     const res = await fetch(`${baseUrl}/crm/v3/objects/meetings/${id}`, {
//       method: "PATCH",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         properties: {
//           hs_meeting_title: title,
//           hs_meeting_body: body,
//           hs_meeting_outcome: outcome,
//         },
//       }),
//     });

//     const result = await res.json();
//     if (!res.ok) {
//       return NextResponse.json(
//         { error: result.message },
//         { status: res.status }
//       );
//     }

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
