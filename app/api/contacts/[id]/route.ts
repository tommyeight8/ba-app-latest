import { getContactById } from "@/app/actions/getContactById";

import { NextResponse } from "next/server";
import { useParams } from "next/navigation";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = useParams();
  const id = params.id as string;
  const contact = await getContactById(id);

  if (!contact) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(contact);
}
