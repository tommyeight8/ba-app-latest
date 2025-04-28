import { getContactById } from "@/app/actions/getContactById";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest, // ✅ Properly typed
  { params }: { params: { id: string } } // ✅ Correct context typing
) {
  const { id } = params;
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
