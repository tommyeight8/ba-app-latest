"use client";

import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrand } from "@/context/BrandContext";
import clsx from "clsx";
import { useContactContext } from "@/context/ContactContext";
import { useContactList } from "@/context/ContactListContext";
import { X } from "lucide-react";
import { memo } from "react";
import { motion } from "framer-motion";

export function ZipCodeListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="p-4">
      <span className="h-[1px] w-full bg-gray-200 dark:bg-zinc-800 block mb-4" />
      <div className="flex items-center justify-between mb-2">
        {/* <p className="font-semibold text-sm">Filter Zipcode</p> */}
        <Skeleton className="h-6 w-24 rounded-xs" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-2">
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

const ZipButton = memo(function ZipButton({
  zip,
  isActive,
  onClick,
  brand,
}: {
  zip: string;
  isActive: boolean;
  onClick: () => void;
  brand: string;
}) {
  return (
    <div className="relative">
      {isActive && (
        <motion.div
          layoutId="zip-pill"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={clsx(
            "absolute inset-0 rounded-full z-0",
            brand === "skwezed" ? "bg-[#F3DB5B]" : "bg-[#1c1c1c] dark:bg-white"
          )}
        />
      )}
      <button
        onClick={onClick}
        className={clsx(
          "cursor-pointer relative z-10 px-3 py-1 text-xs text-center rounded-full transition duration-200",
          isActive
            ? brand === "skwezed"
              ? "text-black font-semibold"
              : "text-white dark:text-black font-semibold"
            : brand === "skwezed"
            ? "bg-green-900/20 text-white hover:bg-gray-100"
            : "bg-transparent hover:bg-gray-200 hover:text-black"
        )}
      >
        {zip}
      </button>
    </div>
  );
});

export function SideZipcodeFilter() {
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
    <div className="p-4">
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
              fetchPage(1, selectedStatus, query, undefined, null);
            }}
            className="cursor-pointer text-xs text-muted-foreground mb-2 hover:text-gray-200 dark:hover:bg-[#333]
            dark:hover:text-white px-2 py-1 hover:bg-[#1c1c1c] rounded-xs transition duration-200
            flex items-center gap-1 group"
          >
            Clear Zipcode{" "}
            <X
              className="text-white bg-[#1c1c1c] p-[2px] w-4 h-4 rounded-xs
            dark:bg-gray-200 dark:text-black group-hover:bg-gray-200 group-hover:text-black"
            />
          </button>
        )}
      </div>

      {zipCodes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No zip codes available</p>
      ) : (
        // <div className="p-3 md:p-0 flex md:flex-wrap gap-2 w-full py-1 sm:flex-nowrap overflow-x-auto sm:whitespace-nowrap sm:scrollbar-hide">
        <div className="text-center p-3 md:p-0 grid grid-cols-2 md:flex md:flex-wrap gap-2 w-full py-1">
          {zipCodes.map((zip) => {
            const isActive = selectedZip === zip;
            return (
              <div key={zip} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="zip-pill"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={clsx(
                      "absolute inset-0 rounded-full z-0",
                      brand === "skwezed"
                        ? "bg-[#F3DB5B]"
                        : "bg-[#1c1c1c] dark:bg-white"
                    )}
                  />
                )}
                <ZipButton
                  key={zip}
                  zip={zip}
                  isActive={selectedZip === zip}
                  onClick={() => {
                    setSelectedZip(zip);
                    fetchPage(1, selectedStatus, query, undefined, zip);
                  }}
                  brand={brand}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
