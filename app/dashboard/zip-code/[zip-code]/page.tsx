// app/zip/[zip-code]/page.tsx
import { searchContactsByPostalCode } from "@/app/actions/actions";
import { HubSpotContact } from "@/types/hubspot";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { IconMapPin, IconLocationPin } from "@tabler/icons-react";
import Link from "next/link";
import { StatusBadgeContactDetails } from "@/components/StatusBadgeContactDetails";

type Props = {
  params: {
    "zip-code": string;
  };
};

export default async function ZipCodePage({ params }: Props) {
  const zipCode = decodeURIComponent(params["zip-code"]);

  const { results } = await searchContactsByPostalCode(zipCode);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-stretch">
        {results.map((contact: HubSpotContact) => (
          <Link
            key={contact.id}
            href={`/dashboard/contacts/${contact.id}`}
            className="block h-full" // ✅ make Link stretch
          >
            <Card className="h-full flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow p-0">
              <CardContent className="flex flex-col flex-grow p-4 space-y-2 relative">
                <div className="flex items-center gap-2 text-lg font-semibold bg-gray-100 dark:bg-[#333] dark:text-white text-black p-2 rounded-t-md">
                  <span className="uppercase">
                    {contact.properties?.company ?? "-"}
                  </span>
                </div>

                <div className="flex-1 flex flex-col space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{contact.properties?.email ?? "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{contact.properties?.phone ?? "-"}</span>
                  </div>
                </div>

                {/* ✅ Push StatusBadge to bottom */}
                <div className="mt-auto">
                  <StatusBadgeContactDetails
                    status={contact.properties.l2_lead_status || "unknown"}
                  />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
