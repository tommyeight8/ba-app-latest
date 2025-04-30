"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useContactList } from "@/context/ContactListContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrand } from "@/context/BrandContext";
import clsx from "clsx";

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

export function ZipCodeList() {
  const { allZips, loading } = useContactList();
  const pathname = usePathname();
  const [zipCount, setZipCount] = useState<number>(10);
  const [ready, setReady] = useState(false);
  const { brand } = useBrand();

  useEffect(() => {
    if (allZips.length > 0) {
      setZipCount(allZips.length);
      setReady(true);
    }
  }, [allZips]);

  const uniqueZips = Array.from(new Set(allZips.filter(Boolean))).sort(
    (a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (isNaN(numA) || isNaN(numB)) {
        return a.localeCompare(b);
      }
      return numA - numB;
    }
  );

  if (loading || allZips.length === 0) {
    return <ZipCodeListSkeleton count={10} />;
  }

  return (
    <div className="p-4">
      <span
        className={clsx(
          "h-[1px] w-full bg-gray-200 dark:bg-zinc-800 block mb-4",
          brand === "skwezed" && "bg-muted/20"
        )}
      ></span>
      <p
        className={clsx(
          "mb-3 font-semibold text-sm",
          brand === "skwezed" && "text-white"
        )}
      >
        Zip Codes
      </p>
      {uniqueZips.length === 0 ? (
        <p className="text-sm text-muted-foreground">No zip codes available</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {uniqueZips.map((zip) => {
            const isActive = pathname === `/dashboard/zip-code/${zip}`;
            return (
              <Link
                key={zip}
                href={`/dashboard/zip-code/${zip}`}
                className={`text-xs w-full text-center px-3 py-1 rounded-full hover:opacity-70 transition duration-200 ${
                  isActive
                    ? `${
                        brand === "skwezed"
                          ? "bg-[#F3DB5B]"
                          : "bg-[#333] text-white"
                      } dark:bg-white dark:text-black font-semibold`
                    : `${
                        brand === "skwezed"
                          ? "bg-green-900/20 text-white hover:bg-gray-100"
                          : "bg-gray-200"
                      } dark:bg-[#333] dark:text-gray-300 hover:bg-gray-200 hover:text-black`
                }`}
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
