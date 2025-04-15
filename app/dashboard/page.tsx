"use client";

import { startTransition, useEffect, useState, useTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactCardGrid } from "@/components/ContactCardList";
import { EditContactModal } from "@/components/EditContactModal";
import { PaginationControls } from "@/components/PaginationControl";
import { HubSpotContact } from "@/types/hubspot";
import {
  fetchHubSpotContactsPaginated,
  fetchHubSpotContactsTotalCount,
  searchContactsByCompany,
} from "@/app/actions/actions";
import { useSearchContext } from "@/contexts/SearchContext";

export default function DashboardPageContent() {
  const [prevStack, setPrevStack] = useState<string[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [lastNonSearchAfter, setLastNonSearchAfter] = useState<string>("");
  const {
    query,
    setQuery,
    runSearch,
    isPending,
    contacts,
    setContacts,
    isSearching,
    setIsSearching,
  } = useSearchContext();

  const pageSize = 12;

  const loadContacts = (afterCursor = "") => {
    startTransition(async () => {
      try {
        const res = await fetchHubSpotContactsPaginated(pageSize, afterCursor);
        setContacts(res.results);
        setAfter(res.paging);
        setLastNonSearchAfter(afterCursor);

        if (afterCursor && !prevStack.includes(afterCursor)) {
          setPrevStack((prev) => [...prev, afterCursor]);
        }
      } catch (err) {
        console.error("Pagination error", err);
      }
    });
  };

  useEffect(() => {
    startTransition(async () => {
      const count = await fetchHubSpotContactsTotalCount();
      setTotalCount(count);
    });
  }, []);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (query === "") {
      setIsSearching(false);
      loadContacts(lastNonSearchAfter);
    }
  }, [query]);

  const handleNextPage = () => {
    if (!after) return;
    if (isSearching) {
      searchContactsByCompany(query, after).then((res) => {
        setContacts(res.results);
        setAfter(res.paging ?? null);
        setPrevStack((prev) => [...prev, after]);
      });
    } else {
      loadContacts(after);
    }
  };

  const handlePrevPage = () => {
    const prev = [...prevStack];
    prev.pop(); // current
    const prevCursor = prev.pop(); // previous
    setPrevStack(prev);

    if (isSearching) {
      if (prevCursor) {
        searchContactsByCompany(query, prevCursor).then((res) => {
          setContacts(res.results);
          setAfter(res.paging ?? null);
        });
      } else {
        runSearch();
      }
    } else {
      if (prevCursor) loadContacts(prevCursor);
      else loadContacts();
    }
  };

  return (
    <main className="flex flex-col gap-6 p-6 w-full max-w-[1200px] m-auto">
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border p-4 space-y-2 animate-pulse bg-white shadow-sm"
            >
              <div className="h-4 w-1/2 bg-muted rounded" />
              <div className="h-3 w-3/4 bg-muted/60 rounded" />
              <div className="h-3 w-2/3 bg-muted/60 rounded" />
              <div className="h-3 w-full bg-muted/60 rounded" />
            </div>
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          No contacts found.
        </div>
      ) : (
        <>
          <ContactCardGrid contacts={contacts} />
          <EditContactModal />
          {!isSearching && (
            <PaginationControls
              page={prevStack.length + 1}
              pageCount={undefined}
              onNext={handleNextPage}
              onPrev={handlePrevPage}
              hasNext={!!after}
            />
          )}
        </>
      )}
    </main>
  );
}
