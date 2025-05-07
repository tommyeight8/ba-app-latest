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

// import { getContactById } from "@/app/actions/getContactById";
// import { useBrand } from "@/context/BrandContext";
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export const dynamic = "force-dynamic";

// export async function GET(
//   request: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await context.params;
//   const cookieStore = await cookies(); // no `await` needed anymore in Next 15
//   const brand = (cookieStore.get("selected_brand")?.value ?? "litto") as
//     | "litto"
//     | "skwezed";

//   const contact = await getContactById(id, brand);

//   if (!contact) {
//     return NextResponse.json({ error: "Contact not found" }, { status: 404 });
//   }

//   return NextResponse.json(contact);
// }
