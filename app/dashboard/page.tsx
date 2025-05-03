"use client";

import { useEffect, useState } from "react";
import {
  fetchHubSpotContactsPaginated,
  searchContactsByCompany,
} from "@/app/actions/actions";
import { searchContactsByStatus } from "@/app/actions/searchContactsByStatus";
import { ContactCardGrid } from "@/components/ContactCardList";
import { EditContactModal } from "@/components/EditContactModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useContactList } from "@/context/ContactListContext";
import { useSession } from "next-auth/react";
import { HubSpotContact } from "@/types/hubspot";
import { useBrand } from "@/context/BrandContext";
import SearchAndFilter from "@/components/SearchAndFilter";
import { useContactEdit } from "@/context/ContactEditContext";

type PaginatedResult = {
  results: HubSpotContact[];
  next: string | null;
};

export default function DashboardPageContent() {
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<Record<string, string | null>>({});
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const { brand } = useBrand();
  const {
    contacts,
    setContacts,
    loadingContacts,
    refetchContacts,
    setLoadingContacts,
  } = useContactList();
  const { data: session, status } = useSession();
  const { setFetchPage, setPage: setModalPage } = useContactEdit();

  console.log(contacts.length)

  const getCursorKey = (page: number, status: string, query: string) =>
    `${page}-${status}-${query || "none"}`;

  const fetchPage = async (
    pageNum: number = 1,
    overrideStatus: string = selectedStatus,
    overrideQuery: string = query,
    optimisticUpdater?: (prev: HubSpotContact[]) => HubSpotContact[]
  ) => {
    if (!session?.user?.email) return;

    if (optimisticUpdater) {
      setContacts((prev) => optimisticUpdater(prev));
      setPage(pageNum);
      return;
    }

    setLoadingContacts(true);
    const cursorKey = getCursorKey(pageNum, overrideStatus, overrideQuery);
    const cursor = cursors[cursorKey] ?? "";

    try {
      let res: PaginatedResult;

      if (overrideQuery.length >= 2) {
        const result = await searchContactsByCompany(
          overrideQuery,
          cursor,
          pageSize,
          session.user.email,
          brand
        );
        res = { results: result.results, next: result.paging ?? null };
      } else if (overrideStatus !== "all") {
        const result = await searchContactsByStatus(
          overrideStatus,
          cursor,
          pageSize,
          session.user.email,
          brand
        );
        res = { results: result.results, next: result.paging ?? null };
      } else {
        res = await fetchHubSpotContactsPaginated(
          pageSize,
          cursor,
          session.user.email,
          brand
        );
      }

      setContacts(res.results ?? []);
      setHasNext(!!res.next);

      if (res.next) {
        setCursors((prev) => ({
          ...prev,
          [getCursorKey(pageNum + 1, overrideStatus, overrideQuery)]: res.next!,
        }));
      }

      setPage(pageNum);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoadingContacts(false);
      setHasLoadedOnce(true);
    }
  };

  const handleSearch = async () => {
    await fetchPage(1, selectedStatus, query);
  };

  const handleClearSearch = async () => {
    setQuery("");
    setSelectedStatus("all");
    await fetchPage(1, "all", "");
  };

  const handleStatusChange = async (val: string) => {
    setSelectedStatus(val);
    await fetchPage(1, val, query);
  };

  useEffect(() => {
    if (status === "authenticated") {
      setContacts([]);
      setCursors({});
      setHasNext(false);
      // fetchPage(1);
      fetchPage(1, "all", "");
    }
  }, [brand, status]);

  return (
    <div className="flex flex-col gap-6 p-1 md:p-6 w-full max-w-[1200px] m-auto min-h-screen h-full">
      <SearchAndFilter
        query={query}
        selectedStatus={selectedStatus}
        onQueryChange={setQuery}
        onStatusChange={handleStatusChange}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      {loadingContacts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(pageSize)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border p-6 space-y-2 animate-pulse bg-white dark:bg-[#333] shadow-sm"
            >
              <div className="h-8 w-1/2 bg-muted rounded" />
              <div className="h-6 w-3/4 bg-muted/60 rounded" />
              <div className="h-6 w-2/3 bg-muted/60 rounded" />
              <div className="h-6 w-full bg-muted/60 rounded" />
            </div>
          ))}
        </div>
      ) : contacts.length === 0 && hasLoadedOnce ? (
        <div className="text-center text-muted-foreground py-10">
          No contacts found.
        </div>
      ) : (
        <>
          <ContactCardGrid contacts={contacts} />

          {/* <EditContactModal fetchPage={fetchPage} page={page} showDetails /> */}
          {/* <EditContactModal showDetails={true} /> */}
          {/* <EditContactModal
            showDetails={true}
            fetchPage={fetchPage}
            page={page}
          /> */}

          <div className="ml-auto flex items-center gap-4 text-sm">
            <Button
              onClick={() => fetchPage(page - 1)}
              disabled={page <= 1 || loadingContacts}
            >
              <ArrowLeft />
            </Button>
            <span className="text-gray-400">Page {page}</span>
            <Button
              onClick={() => fetchPage(page + 1)}
              disabled={!hasNext || loadingContacts}
            >
              <ArrowRight />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
