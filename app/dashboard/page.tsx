"use client";

import { useEffect, useState } from "react";
import {
  fetchHubSpotContactsPaginated,
  fetchHubSpotContactsTotalCount,
  searchContactsByCompany,
} from "@/app/actions/actions";
import { searchContactsByStatus } from "@/app/actions/searchContactsByStatus";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactCardGrid } from "@/components/ContactCardList";
import { EditContactModal } from "@/components/EditContactModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useContactList } from "@/context/ContactListContext";
import { useSession } from "next-auth/react";
import { HubSpotContact } from "@/types/hubspot";

type PaginatedResult = {
  results: HubSpotContact[];
  next: string | null;
};

export default function DashboardPageContent() {
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const { contacts, setContacts } = useContactList();
  const { data: session, status } = useSession();

  const getCursorKey = (page: number, status: string, query: string) =>
    `${page}-${status}-${query || "none"}`;

  const fetchPage = async (
    pageNum: number = 1,
    overrideStatus: string = selectedStatus,
    overrideQuery: string = query,
    optimisticUpdater?: (prev: HubSpotContact[]) => HubSpotContact[] // <-- function, not array
  ) => {
    if (!session?.user?.email) return;

    if (optimisticUpdater) {
      setContacts((prev) => optimisticUpdater(prev));
      setPage(pageNum);
      return;
    }

    setLoading(true);
    try {
      const cursorKey = getCursorKey(pageNum, overrideStatus, overrideQuery);
      const cursor = cursors[cursorKey] ?? "";

      let res: PaginatedResult;
      if (overrideQuery.length >= 2) {
        const result = await searchContactsByCompany(
          overrideQuery,
          cursor,
          pageSize,
          session.user.email
        );
        res = { results: result.results, next: result.paging ?? null };
      } else if (overrideStatus !== "all") {
        const result = await searchContactsByStatus(
          overrideStatus,
          cursor,
          pageSize,
          session.user.email
        );
        res = { results: result.results, next: result.paging ?? null };
      } else {
        res = await fetchHubSpotContactsPaginated(
          pageSize,
          cursor,
          session.user.email
        );
      }

      setContacts(res.results ?? []);
      const nextCursor = res.next;

      setCursors((prev) => ({
        ...prev,
        [cursorKey]: cursor,
        ...(nextCursor
          ? {
              [getCursorKey(pageNum + 1, overrideStatus, overrideQuery)]:
                nextCursor,
            }
          : {}),
      }));

      setPage(pageNum);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
      setHasLoadedOnce(true);
    }
  };

  const handleSearch = async () => {
    await fetchPage(1, selectedStatus, query);
  };

  const handleClearSearch = async () => {
    setQuery("");
    setSelectedStatus("all");
    await fetchPage(1, "all", ""); // ✅ Reset to page 1 after clearing
  };

  const handleStatusChange = async (val: string) => {
    setSelectedStatus(val);
    await fetchPage(1, val, query); // ✅ Reset to page 1 after changing status
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchHubSpotContactsTotalCount().then(setTotalCount);
      fetchPage(1);
    }
  }, [status]);

  const hasNextPage = !!cursors[getCursorKey(page + 1, selectedStatus, query)];

  return (
    <div className="flex flex-col gap-6 p-1 md:p-6 w-full max-w-[1200px] m-auto min-h-screen h-full">
      <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:justify-between">
        <div className="flex items-center gap-2">
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending visit">Pending Visit</SelectItem>
              <SelectItem value="visit requested by rep">
                Visit Requested
              </SelectItem>
              <SelectItem value="dropped off">Dropped Off</SelectItem>
            </SelectContent>
          </Select>
          {selectedStatus !== "all" && (
            <Button variant="outline" onClick={handleClearSearch}>
              Clear Status
            </Button>
          )}
        </div>

        <div className="relative w-full md:max-w-[50%]">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search store"
            className="w-full pr-20"
          />

          {query && (
            <button
              onClick={handleClearSearch}
              className="cursor-pointer absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <button
            onClick={handleSearch}
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </button>
        </div>

        {/* <div className="flex w-full md:flex-1 justify-end gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search store"
            className="w-full md:max-w-1/2"
          />
          {query && (
            <Button variant="outline" onClick={handleClearSearch}>
              Clear
            </Button>
          )}
          <Button onClick={handleSearch}>Search</Button>
        </div> */}
      </div>

      {loading && !hasLoadedOnce ? (
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
      ) : (
        <>
          {!loading && hasLoadedOnce && contacts.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              No contacts found.
            </div>
          ) : (
            <ContactCardGrid contacts={contacts} />
          )}

          {/* Edit modal */}
          <EditContactModal
            fetchPage={fetchPage}
            page={page}
            showDetails={true}
          />

          <div className="ml-auto flex items-center gap-4 text-sm">
            <Button
              onClick={() => fetchPage(page - 1)}
              disabled={page <= 1 || loading}
              className="w-6 h-6"
            >
              <ArrowLeft />
            </Button>
            <span className="text-gray-400">Page {page}</span>
            <Button
              onClick={() => fetchPage(page + 1)}
              disabled={!hasNextPage || loading}
              className="w-6 h-6"
            >
              <ArrowRight />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
