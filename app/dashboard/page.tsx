"use client";

import { useEffect, useState } from "react";
import {
  fetchHubSpotContactsPaginated,
  fetchHubSpotContactsTotalCount,
  searchContactsByCompany,
} from "@/app/actions/actions";

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
import { HubSpotContact } from "@/types/hubspot";
import { searchContactsByStatus } from "@/app/actions/searchContactsByStatus";

import { useContactList } from "@/context/ContactListContext";

export default function DashboardPageContent() {
  const pageSize = 12;
  // const [contacts, setContacts] = useState<HubSpotContact[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [cursors, setCursors] = useState<{ [page: number]: string | null }>({
    1: "",
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const { contacts, setContacts, refetchContacts } = useContactList();

  const fetchPage = async (pageNum: number, overrideStatus?: string) => {
    setLoading(true);
    try {
      const cursor = cursors[pageNum] ?? "";

      let res: {
        results: HubSpotContact[];
        paging?: string | null;
        next?: string | null;
      };

      const activeStatus = overrideStatus ?? selectedStatus;
      const isStatusFilter = activeStatus !== "all";
      const isSearch = query.length >= 2;

      if (isSearch) {
        res = await searchContactsByCompany(query, cursor, pageSize);
      } else if (isStatusFilter) {
        res = await searchContactsByStatus(activeStatus, cursor, pageSize);
      } else {
        res = await fetchHubSpotContactsPaginated(pageSize, cursor);
      }

      const data = res.results ?? [];
      setContacts(data);

      const nextCursor = res.paging ?? res.next ?? null;
      setAfter(nextCursor);

      if (nextCursor) {
        setCursors((prev) => ({
          ...prev,
          [pageNum + 1]: nextCursor,
        }));
      }

      setPage(pageNum);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
      setHasLoadedOnce(true);
    }
  };

  const handleSearch = async () => {
    setIsSearching(query.length >= 2);
    setCursors({ 1: "" });
    await fetchPage(1);
  };

  const handleStatusChange = async (val: string) => {
    setSelectedStatus(val);
    setCursors({ 1: "" });
    await fetchPage(1, val); // ✅ explicitly pass the new value
  };

  useEffect(() => {
    fetchHubSpotContactsTotalCount().then(setTotalCount);
    fetchPage(1);
  }, []);

  useEffect(() => {
    if (query === "") {
      setIsSearching(false);
      setCursors({ 1: "" });
      fetchPage(1);
    }
  }, [query]);

  // const handleClearSearch = async () => {
  //   setQuery("");
  //   setSelectedStatus("all");
  //   setIsSearching(false);
  //   setCursors({ 1: "" });
  //   await fetchPage(1);
  // };

  const handleClearSearch = async () => {
    setQuery("");
    setIsSearching(false);
    setCursors({ 1: "" });
    await fetchPage(1);
  };

  const handleClearStatus = async () => {
    setSelectedStatus("all");
    setCursors({ 1: "" });
    await fetchPage(1, "all"); // explicitly tell fetchPage to reset filter
  };

  return (
    <main className="flex flex-col gap-6 p-6 w-full max-w-[1200px] m-auto min-h-screen h-full">
      {/* Search & Filter */}

      <div className="flex flex-col md:flex-row items-center gap-2 w-full justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending visit">Pending Visit</SelectItem>
              <SelectItem value="visit requested by rep">
                Visit Requested by Rep
              </SelectItem>
              <SelectItem value="dropped off">Dropped Off</SelectItem>
              <SelectItem value="none">No status yet</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Status */}
          {selectedStatus !== "all" && (
            <Button variant="outline" onClick={handleClearStatus}>
              Clear Status
            </Button>
          )}
        </div>
        <div className="flex gap-2 w-1/2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search store"
            className="w-full max-w-md"
          />

          {query && (
            <Button variant="outline" onClick={handleClearSearch}>
              Clear
            </Button>
          )}

          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {/* Content */}
      {loading && !hasLoadedOnce ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(pageSize)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border p-4 space-y-2 animate-pulse bg-white shadow-sm"
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
          {!loading && hasLoadedOnce && contacts.length === 0 && (
            <div className="text-center text-muted-foreground py-10">
              No contacts found.
            </div>
          )}

          <ContactCardGrid contacts={contacts} />
          <EditContactModal />
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
              disabled={!cursors[page + 1] || loading}
              className="w-6 h-6"
            >
              <ArrowRight />
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
