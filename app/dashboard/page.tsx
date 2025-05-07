"use client";
// UPdated redo
import { useEffect, useState } from "react";
import { useContactContext } from "@/context/ContactContext";
import { ContactCardGrid } from "@/components/ContactCardList";
import SearchAndFilter from "@/components/SearchAndFilter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CreateContactModal } from "@/components/CreateContactModal";
import { Icon123 } from "@tabler/icons-react";

export default function DashboardPageContent() {
  const {
    contacts,
    fetchPage,
    loadingContacts,
    page,
    hasNext,
    query,
    setQuery,
    selectedStatus,
    setSelectedStatus,
    setSelectedZip,
    selectedZip,
  } = useContactContext();

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);

  useEffect(() => {
    // fetchPage(1, "all", "").then(() => setHasLoadedOnce(true));
    fetchPage(1, selectedStatus, query, undefined, selectedZip).then(() =>
      setHasLoadedOnce(true)
    );
  }, []);

  return (
    <div className="flex flex-col gap-6 p-1 md:p-6 w-full max-w-[1200px] m-auto min-h-screen h-full">
      <SearchAndFilter />

      {loadingContacts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => (
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
        <div className="text-center py-10 flex flex-col justify-center items-center gap-2">
          No contacts found.
          <>
            <button
              onClick={() => setOpenContactModal(true)}
              className="cursor-pointer px-3 py-1 border border-green-400 text-green-400 
              hover:bg-green-400 hover:text-black transition duration-200 rounded-sm"
            >
              + New Contact
            </button>
            <CreateContactModal
              open={openContactModal}
              setOpen={setOpenContactModal}
            />
          </>
        </div>
      ) : (
        <>
          <ContactCardGrid contacts={contacts} />

          <div className="ml-auto flex items-center gap-4 text-sm">
            <Button
              onClick={() => {
                setSelectedZip(null); // ← clear ZIP filtering
                // fetchPage(page - 1, selectedStatus, query);
                fetchPage(
                  page - 1,
                  selectedStatus,
                  query,
                  undefined,
                  selectedZip
                );
              }}
              disabled={page <= 1 || loadingContacts}
            >
              <ArrowLeft />
            </Button>
            <span className="text-gray-400">Page {page}</span>
            <Button
              onClick={() => {
                if (selectedZip) return;
                // fetchPage(page + 1, selectedStatus, query);
                fetchPage(
                  page + 1,
                  selectedStatus,
                  query,
                  undefined,
                  selectedZip
                );
              }}
              disabled={!hasNext || loadingContacts || !!selectedZip}
            >
              <ArrowRight />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
