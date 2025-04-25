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
  const [cursors, setCursors] = useState<{ [page: number]: string | null }>({ 1: "" });
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const { contacts, setContacts } = useContactList();
  const { data: session, status } = useSession();

  const fetchPage = async (
    pageNum = 1,
    overrideStatus = selectedStatus,
    overrideQuery = query
  ) => {
    if (!session?.user?.email) return;

    setLoading(true);
    try {
      const cursor = cursors[pageNum] ?? "";
      const isSearch = overrideQuery.length >= 2;
      const isStatusFilter = overrideStatus !== "all";

      let res: PaginatedResult;

      if (isSearch) {
        const result = await searchContactsByCompany(overrideQuery, cursor, pageSize, session.user.email);
        res = { results: result.results, next: result.paging ?? null };
      } else if (isStatusFilter) {
        const result = await searchContactsByStatus(overrideStatus, cursor, pageSize, session.user.email);
        res = { results: result.results, next: result.paging ?? null };
      } else {
        res = await fetchHubSpotContactsPaginated(pageSize, cursor, session.user.email);
      }

      setContacts(res.results ?? []);
      const nextCursor = res.next;
      if (nextCursor) {
        setCursors((prev) => ({ ...prev, [pageNum + 1]: nextCursor }));
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
    setCursors({ 1: "" });
    await fetchPage(1, selectedStatus, query);
  };

  const handleClearSearch = async () => {
    setQuery("");
    setSelectedStatus("all");
    setCursors({ 1: "" });
    await fetchPage(1, "all", "");
  };

  const handleStatusChange = async (val: string) => {
    setSelectedStatus(val);
    setCursors({ 1: "" });
    await fetchPage(page, val, query); 
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchHubSpotContactsTotalCount().then(setTotalCount);
      fetchPage(1);
    }
  }, [status]);

  return (
    <div className="flex flex-col gap-6 p-1 md:p-6 w-full max-w-[1200px] m-auto min-h-screen h-full">
      <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:justify-between">
        <div className="flex items-center gap-2">
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending visit">Pending Visit</SelectItem>
              <SelectItem value="visit requested by rep">Visit Requested</SelectItem>
              <SelectItem value="dropped off">Dropped Off</SelectItem>
              <SelectItem value="none">No Status</SelectItem>
            </SelectContent>
          </Select>
          {selectedStatus !== "all" && (
            <Button variant="outline" onClick={handleClearSearch}>Clear Status</Button>
          )}
        </div>

        <div className="flex w-full md:flex-1 justify-end gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search store"
            className="w-full md:max-w-1/2"
          />
          {query && <Button variant="outline" onClick={handleClearSearch}>Clear</Button>}
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {loading && !hasLoadedOnce ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Skeleton key={i} className="rounded-lg border p-6 space-y-2 h-36 bg-white dark:bg-[#333]" />
          ))}
        </div>
      ) : (
        <>
          {!loading && hasLoadedOnce && contacts.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">No contacts found.</div>
          ) : (
            <ContactCardGrid contacts={contacts} />
          )}

          <EditContactModal fetchPage={fetchPage} page={page} /> {/* ✅ Pass current page + fetch method */}

          <div className="ml-auto flex items-center gap-4 text-sm">
            <Button onClick={() => fetchPage(page - 1)} disabled={page <= 1 || loading} className="w-6 h-6">
              <ArrowLeft />
            </Button>
            <span className="text-gray-400">Page {page}</span>
            <Button onClick={() => fetchPage(page + 1)} disabled={!cursors[page + 1] || loading} className="w-6 h-6">
              <ArrowRight />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
