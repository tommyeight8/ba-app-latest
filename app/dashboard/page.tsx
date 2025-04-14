"use client";

import { useEffect, useState, useTransition } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { NavMain } from "@/components/nav-main";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { contactColumns } from "@/components/ContactColumns";
import {
  fetchHubSpotContacts,
  fetchHubSpotContactsPaginated,
  searchContactsByCompany,
  fetchHubSpotContactsTotalCount,
} from "@/app/actions/actions";
import { HubSpotContact } from "@/types/hubspot";
import { IconUsers, IconHome2, IconClipboardList } from "@tabler/icons-react";

import { PaginationControls } from "@/components/PaginationControl";
import { ContactCardGrid } from "@/components/ContactCardList";
import { EditContactModal } from "@/components/EditContactModal";

export default function DashboardPage() {
  const [contacts, setContacts] = useState<HubSpotContact[]>([]);
  const [query, setQuery] = useState("");
  const [prevStack, setPrevStack] = useState<string[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [lastNonSearchAfter, setLastNonSearchAfter] = useState<string>("");

  const pageSize = 12;

  const pageCount =
    totalCount && totalCount > 0 ? Math.ceil(totalCount / pageSize) : undefined; // ✅ use undefined instead of null

  const loadContacts = (afterCursor = "") => {
    startTransition(async () => {
      try {
        const res = await fetchHubSpotContactsPaginated(12, afterCursor);
        setContacts(res.results);
        setAfter(res.paging);

        // ✅ Save this page so we can go back after search clears
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
    loadContacts(); // initial load
  }, []);

  useEffect(() => {
    if (query === "") {
      setIsSearching(false);
      loadContacts(lastNonSearchAfter); // ✅ return to last known paginated state
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
      else loadContacts(); // back to first page
    }
  };

  const data = {
    navMain: [
      { title: "Dashboard", url: "/dashboard", icon: IconHome2 },
      { title: "Tasks", url: "/tasks", icon: IconClipboardList },
      { title: "Team", url: "/team", icon: IconUsers },
    ],
  };

  const runSearch = () => {
    if (query.length < 2) return;

    setIsSearching(true);
    startTransition(async () => {
      const res = await searchContactsByCompany(query);
      setContacts(res.results);
      setAfter(res.paging);
      setPrevStack([]);
    });
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar>
        <NavMain
          items={data.navMain}
          query={query}
          setQuery={setQuery}
          runSearch={runSearch}
          isPending={isPending}
        />
      </AppSidebar>

      <SidebarInset>
        <SiteHeader
          user={{
            name: "Tommy",
            email: "tommy@example.com",
            avatar: "",
          }}
        />
        <main className="flex flex-col gap-6 p-6 w-full max-w-[1200px] m-auto">
          {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border p-4 space-y-2 animate-pulse bg-white shadow-sm"
                >
                  <div className="h-4 w-1/2 bg-muted rounded" />{" "}
                  {/* Company name */}
                  <div className="h-3 w-3/4 bg-muted/60 rounded" />{" "}
                  {/* Email */}
                  <div className="h-3 w-2/3 bg-muted/60 rounded" />{" "}
                  {/* Phone */}
                  <div className="h-3 w-full bg-muted/60 rounded" />{" "}
                  {/* Address */}
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
      </SidebarInset>
    </SidebarProvider>
  );
}
