import { getContactById } from "@/app/actions/getContactById";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const brand = (cookieStore.get("selected_brand")?.value ?? "litto") as
    | "litto"
    | "skwezed";

  const contact = await getContactById(params.id, brand);
  if (!contact)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(contact);
}
