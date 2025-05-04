"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useBrand } from "@/context/BrandContext";
import { useContactList } from "@/context/ContactListContext";
import { ContactCardGrid } from "@/components/ContactCardList";
import { EditContactModal } from "@/components/EditContactModal";
import Spinner from "@/components/Spinner";

export default function ContactsByZipPage() {
  const { status } = useSession();
  const { brand } = useBrand();
  const { contacts, loadingContacts } = useContactList();
  const params = useParams();
  const zip = typeof params?.zip === "string" ? params.zip : null;

  const filteredContacts = useMemo(() => {
    if (!zip) return [];
    return contacts.filter((c) => c.properties?.zip?.toString().trim() === zip);
  }, [contacts, zip]);

  if (!zip) return <p className="p-6 text-red-500">Invalid ZIP code.</p>;
  if (loadingContacts) return <Spinner size="8" />;

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-xl font-bold mb-4">Contacts in ZIP: {zip}</h1>
      {filteredContacts.length > 0 ? (
        <>
          <ContactCardGrid contacts={filteredContacts} />
          <EditContactModal showDetails />
        </>
      ) : (
        <p className="text-muted-foreground">
          No contacts found for this ZIP code.
        </p>
      )}
    </div>
  );
}
