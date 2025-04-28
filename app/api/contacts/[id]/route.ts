import { getContactById } from "@/app/actions/getContactById";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const contact = await getContactById(id);

  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  return NextResponse.json(contact);
}

// import { getContactById } from "@/app/actions/getContactById";
// import { NextResponse } from "next/server";

// export async function GET(req: Request, context: { params: { id: string } }) {
//   const { id } = context.params; // ✅ Not a Promise!
//   const contact = await getContactById(id);

//   if (!contact) {
//     return NextResponse.json({ error: "Not found" }, { status: 404 });
//   }

//   return NextResponse.json(contact);
// }
