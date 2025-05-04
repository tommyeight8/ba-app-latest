"use client";

import { useParams } from "next/navigation";
import { useContactList } from "@/context/ContactListContext";
import { ContactCard } from "@/components/ContactCard";
import { IconMapPin } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";
import { useEffect, useMemo } from "react";

export default function ZipCodeClientPage() {
  const params = useParams();
  const rawZipParam = params?.["zipcode"];
  const zipCode =
    typeof rawZipParam === "string" ? decodeURIComponent(rawZipParam) : "";

  const { contacts, loadingContacts } = useContactList();

  const filtered = useMemo(
    () =>
      contacts.filter(
        (c) => c.properties?.zip?.toString().trim() === zipCode.trim()
      ),
    [contacts, zipCode]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [zipCode]);

  if (!zipCode) {
    return <p className="p-6 text-red-500">Invalid ZIP code.</p>;
  }

  if (loadingContacts) return <Spinner size="8" />;

  return (
    <main className="md:p-6 min-h-screen">
      <h1 className="font-bold mb-4 flex items-center text-xl md:text-2xl">
        <IconMapPin className="text-gray-300 dark:text-zinc-500" />
        <span className="text-gray-300 dark:text-zinc-500">
          Zip Code:&nbsp;
        </span>
        {zipCode}
      </h1>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((contact) => (
            <ContactCard
              key={`${contact.id}-${contact.properties.l2_lead_status}`}
              contact={contact}
              href={contact.id}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No contacts found in this ZIP code.
        </p>
      )}
    </main>
  );
}
