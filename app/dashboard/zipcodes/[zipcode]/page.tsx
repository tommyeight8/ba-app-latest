// app/zip/[zip-code]/page.tsx
import { searchContactsByPostalCode } from "@/app/actions/actions";
import { HubSpotContact } from "@/types/hubspot";
import { notFound } from "next/navigation";
import { IconMapPin } from "@tabler/icons-react";
import { cookies } from "next/headers";
import { ContactCard } from "@/components/ContactCard";

export const dynamic = "force-dynamic";

type Props = {
  params: { zipcode: string };
  searchParams?: { page?: string };
};

const PAGE_SIZE = 12;

export default async function ContactsByZipPage({
  params,
  searchParams,
}: Props) {
  const { zipcode: zipRaw } = params;
  const zipCode = decodeURIComponent(zipRaw);
  const currentPage = parseInt(searchParams?.page || "1", 10);

  const cookieStore = await cookies();
  const brand = (cookieStore.get("selected_brand")?.value ?? "litto") as
    | "litto"
    | "skwezed";

  // Fetch paginated cursor until desired page
  const cursors: string[] = [""];
  let after = "";

  for (let i = 1; i < currentPage; i++) {
    const res = await searchContactsByPostalCode(
      zipCode,
      after,
      PAGE_SIZE,
      brand
    );
    after = res.paging ?? "";
    cursors.push(after);
    if (!after) break;
  }

  const { results, paging } = await searchContactsByPostalCode(
    zipCode,
    after,
    PAGE_SIZE,
    brand
  );

  console.log(results)

  if (!results || results.length === 0) {
    notFound();
  }

  return (
    <main className="md:p-6 min-h-screen">
      <h1 className="font-bold mb-4 flex items-center text-xl md:text-2xl">
        <IconMapPin className="text-gray-300 dark:text-zinc-500" />
        <span className="text-gray-300 dark:text-zinc-500">
          Zip Code:&nbsp;
        </span>
        {zipCode}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((contact: HubSpotContact) => {
          console.log(contact.id)
          return (
            <ContactCard
            key={`${contact.id}-${contact.properties.l2_lead_status}`}
            contact={contact}
            href={contact.id}
          />
          )
        })}
      </div>
    </main>
  );
}
