"use client";

import { useState, useEffect } from "react";
import { useContactList } from "@/context/ContactListContext";
import { ContactCard } from "@/components/ContactCard";
import { HubSpotContact } from "@/types/hubspot";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ZipCodeContactList({ zipCode }: { zipCode: string }) {
  const pageSize = 12;
  const { contacts } = useContactList();
  const [filtered, setFiltered] = useState<HubSpotContact[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const filteredByZip = contacts.filter(
      (c) => c.properties?.zip?.toLowerCase() === zipCode.toLowerCase()
    );
    setFiltered(filteredByZip);
    setPage(1); // ✅ Reset page on zip change
  }, [contacts, zipCode]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  // ✅ Optional scroll to top on page change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  return (
    <>
      {paginated.length === 0 ? (
        <div className="text-muted-foreground mt-6">No contacts found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {paginated.map((contact) => (
              <ContactCard
                key={`${contact.id}-${contact.properties.l2_lead_status}`}
                contact={contact}
                href={contact.id}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="ml-auto mt-4 flex items-center gap-4 text-sm">
              <Button onClick={() => setPage((p) => p - 1)} disabled={!hasPrev}>
                <ArrowLeft />
              </Button>
              <span className="text-gray-400">Page {page}</span>
              <Button onClick={() => setPage((p) => p + 1)} disabled={!hasNext}>
                <ArrowRight />
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
