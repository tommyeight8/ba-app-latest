"use client";

import { useEffect, useState, startTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactCardGrid } from "@/components/ContactCardList";
import { EditContactModal } from "@/components/EditContactModal";
import { PaginationControls } from "@/components/PaginationControl";
import {
  fetchHubSpotContactsPaginated,
  fetchHubSpotContactsTotalCount,
  searchContactsByCompany,
} from "@/app/actions/actions";
import { useSearchContext } from "@/contexts/SearchContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HubSpotContact } from "@/types/hubspot";

export default function DashboardPageContent() {
  const [prevStack, setPrevStack] = useState<string[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [lastNonSearchAfter, setLastNonSearchAfter] = useState<string>("");
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [allContacts, setAllContacts] = useState<HubSpotContact[]>([]); // 👈 new

  const {
    query,
    setQuery,
    runSearch,
    isPending,
    contacts,
    setContacts,
    isSearching,
    setIsSearching,
    loadInitialContacts,
  } = useSearchContext();

  const pageSize = 12;

  const loadContacts = (afterCursor = "") => {
    startTransition(async () => {
      try {
        const res = await fetchHubSpotContactsPaginated(pageSize, afterCursor);
        setContacts(res.results);
        setAllContacts(res.results); // 👈 cache unfiltered
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
    const loadContactsInitially = async () => {
      setLoadingInitial(true);
      await loadInitialContacts();
      setLoadingInitial(false);
    };
    loadContactsInitially();
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
    prev.pop();
    const prevCursor = prev.pop();
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

  // 👇 Filter when status changes
  useEffect(() => {
    if (selectedStatus === "all") {
      setContacts(allContacts);
    } else {
      const filtered = allContacts.filter(
        (c) => c.properties.l2_lead_status === selectedStatus
      );
      setContacts(filtered);
    }
  }, [selectedStatus]);

  return (
    <main className="flex flex-col gap-6 p-6 w-full max-w-[1200px] m-auto">
      {isPending || loadingInitial ? (
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
          {/* Status Filter */}
          <div className="w-full max-w-xs">
            <Select
              value={selectedStatus}
              onValueChange={(val) => setSelectedStatus(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status</SelectItem>
                <SelectItem value="pending visit">Pending Visit</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="dropped off">Dropped Off</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
