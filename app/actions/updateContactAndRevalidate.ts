// app/actions/updateContactAndRevalidate.ts
"use server";
import { revalidatePath } from "next/cache";
import { updateContactIfMatch } from "./updateContactByEmailandId";
import { useBrand } from "@/context/BrandContext";

export async function updateAndRevalidateZipPath(
  contactId: string,
  fields: any,
  brand: "litto" | "skwezed" = "litto",
  zip: string
) {
  const result = await updateContactIfMatch(contactId, fields, brand);
  if (result.success) {
    revalidatePath(`/dashboard/zipcodes/${zip}`, "page");
  }
  return result;
}
