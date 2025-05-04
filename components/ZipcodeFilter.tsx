"use client";

import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrand } from "@/context/BrandContext";
import clsx from "clsx";
import { useContactContext } from "@/context/ContactContext";
import { useContactList } from "@/context/ContactListContext";

export function ZipCodeListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="p-4">
      <Skeleton className="h-4 w-24 bg-gray-200 mb-3 rounded" />
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-6 rounded-full bg-gray-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    </div>
  );
}

export function ZipcodeFilter() {
  const { allZips, loadingZips } = useContactList();
  const { brand } = useBrand();
  const {
    selectedZip,
    setSelectedZip,
    fetchPage,
    selectedStatus,
    query,
    contacts,
    loadingContacts,
  } = useContactContext();

  // Combine logic: use allZips when status is "all", otherwise derive from contacts
  const zipCodes = useMemo(() => {
    if (selectedStatus === "all") {
      return [...new Set(allZips.filter(Boolean))].sort(sortZips);
    }

    const fromFiltered = new Set<string>();
    contacts.forEach((c) => {
      const zip = c.properties?.zip?.toString().trim();
      if (zip) fromFiltered.add(zip);
    });
    return Array.from(fromFiltered).sort(sortZips);
  }, [selectedStatus, contacts, allZips]);

  function sortZips(a: string, b: string) {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    return isNaN(numA) || isNaN(numB) ? a.localeCompare(b) : numA - numB;
  }

  // if (loadingZips || loadingContacts) return <ZipCodeListSkeleton count={10} />;
  if ((loadingZips || loadingContacts) && selectedStatus !== "all") {
    return <ZipCodeListSkeleton count={10} />;
  }

  return (
    <div className="pt-2">
      <span
        className={clsx(
          "h-[1px] w-full bg-gray-200 dark:bg-zinc-800 block mb-4",
          brand === "skwezed" && "bg-muted/20"
        )}
      />
      <div className="flex items-center justify-between">
        <p
          className={clsx(
            "mb-3 font-semibold text-sm",
            brand === "skwezed" && "text-white"
          )}
        >
          Filter Zipcode
        </p>

        {selectedZip && (
          <button
            onClick={() => {
              setSelectedZip(null);
              fetchPage(1, selectedStatus, query);
            }}
            className="cursor-pointer text-xs text-muted-foreground mb-2 hover:text-black 
            dark:hover:text-white px-2 py-1 hover:bg-gray-200 rounded-sm transition duration-200"
          >
            Clear Zipcode X
          </button>
        )}
      </div>

      {zipCodes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No zip codes available</p>
      ) : (
        <div className="flex flex-wrap gap-2 w-full">
          {zipCodes.map((zip) => {
            const isActive = selectedZip === zip;
            return (
              <button
                key={zip}
                onClick={() => {
                  setSelectedZip(zip);
                  fetchPage(1, selectedStatus, query, undefined, zip);
                }}
                className={clsx(
                  "cursor-pointer text-xs text-center px-3 py-1 rounded-full transition duration-200",
                  isActive
                    ? brand === "skwezed"
                      ? "bg-[#F3DB5B] text-black font-semibold"
                      : "bg-[#333] text-white dark:bg-white dark:text-black font-semibold"
                    : brand === "skwezed"
                    ? "bg-green-900/20 text-white hover:bg-gray-100"
                    : "bg-gray-200 dark:bg-[#1c1c1c] dark:text-gray-300 hover:bg-gray-200 hover:text-black"
                )}
              >
                {zip}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
