// app/zip/[zip-code]/page.tsx
import { searchContactsByPostalCode } from "@/app/actions/actions";
import { HubSpotContact } from "@/types/hubspot";
import { notFound } from "next/navigation";
import { IconMapPin } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

import Link from "next/link";
import { StatusBadgeContactDetails } from "@/components/StatusBadgeContactDetails";

import { cookies } from "next/headers";
import { ContactCard } from "@/components/ContactCard";

export const dynamic = "force-dynamic";

type Props = {
  params: { "zip-code": string };
  searchParams?: { page?: string };
};

const PAGE_SIZE = 12;

export default async function ZipCodePage({ params, searchParams }: Props) {
  const { "zip-code": zipCodeRaw } = await params; // ✅ await the params
  const zipCode = decodeURIComponent(zipCodeRaw);
  const currentPage = parseInt(searchParams?.page || "1", 10);

  const cookieStore = await cookies(); // no `await` needed anymore in Next 15
  const brand = (cookieStore.get("selected_brand")?.value ?? "litto") as
    | "litto"
    | "skwezed";

  // ✨ Map pages to cursors
  const cursors: string[] = [""];
  let after = "";

  // Fetch forward until reaching the desired page
  for (let i = 1; i < currentPage; i++) {
    const res = await searchContactsByPostalCode(
      zipCode,
      after,
      PAGE_SIZE,
      brand
    );
    after = res.paging ?? "";
    cursors.push(after);
    if (!after) break; // No more pages
  }

  const { results, paging } = await searchContactsByPostalCode(
    zipCode,
    after,
    PAGE_SIZE,
    brand
  );

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

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-stretch"> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((contact: HubSpotContact) => (
          <ContactCard
            key={`${contact.id}-${contact.properties.l2_lead_status}`}
            contact={contact}
            href={contact.id}
          />
        ))}
      </div>
    </main>
  );
}
