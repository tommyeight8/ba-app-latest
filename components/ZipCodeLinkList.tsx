"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useContactList } from "@/context/ContactListContext";
import { useBrand } from "@/context/BrandContext";
import clsx from "clsx";
import { Skeleton } from "@/components/ui/skeleton";

export function ZipCodeLinkListSkeleton({ count = 10 }: { count?: number }) {
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

export function ZipCodeLinkList() {
  const { allZips, loadingZips } = useContactList();
  const { brand } = useBrand();
  const pathname = usePathname();

  const zipCodes = useMemo(() => {
    return [...new Set(allZips.filter(Boolean))].sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      return isNaN(numA) || isNaN(numB) ? a.localeCompare(b) : numA - numB;
    });
  }, [allZips]);

  if (loadingZips) return <ZipCodeLinkListSkeleton />;

  return (
    <div className="p-4">
      <h2
        className={clsx(
          "mb-3 font-semibold text-sm",
          brand === "skwezed" && "text-white"
        )}
      >
        Zipcodes
      </h2>

      {zipCodes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No zipcodes available</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 text-center">
          {zipCodes.map((zip) => {
            const isActive = pathname.endsWith(`/zipcodes/${zip}`);
            return (
              <Link
                key={zip}
                href={`/dashboard/zipcodes/${zip}`}
                className={clsx(
                  "text-xs px-3 py-1 rounded-full transition duration-200",
                  brand === "skwezed"
                    ? isActive
                      ? "bg-[#F3DB5B] text-black font-semibold"
                      : "bg-green-900/20 text-white hover:bg-[#F3DB5B] hover:text-black"
                    : isActive
                    ? "bg-zinc-700 text-white dark:bg-gray-200 dark:text-black font-semibold"
                    : "bg-gray-200 dark:bg-[#333] dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white dark:hover:text-black"
                )}
              >
                {zip}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
