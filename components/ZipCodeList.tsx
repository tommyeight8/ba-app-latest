"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useContactList } from "@/context/ContactListContext";
import { Skeleton } from "@/components/ui/skeleton";

export function ZipCodeListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="p-4 border-t border-white/10">
      <Skeleton className="h-4 w-24 mb-3 rounded" />
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
  const { allZips } = useContactList();
  const pathname = usePathname();
  const [zipCount, setZipCount] = useState<number>(10);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (allZips.length > 0) {
      setZipCount(allZips.length);
      setReady(true);
    }
  }, [allZips]);

  // 🛠 Sort zips numerically (conical order)
  const uniqueZips = Array.from(new Set(allZips.filter(Boolean))).sort(
    (a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (isNaN(numA) || isNaN(numB)) {
        return a.localeCompare(b); // fallback alphabetical if not numbers
      }
      return numA - numB;
    }
  );

  if (!ready) {
    return <ZipCodeListSkeleton count={zipCount} />;
  }

  return (
    <div className="p-4 border-t border-white/10">
      <p className="mb-3 font-semibold text-sm">Zip Codes</p>
      <div className="grid grid-cols-2 gap-2">
        {uniqueZips.map((zip) => {
          const isActive = pathname === `/dashboard/zip-code/${zip}`;
          return (
            <Link
              key={zip}
              href={`/dashboard/zip-code/${zip}`}
              className={`text-xs w-full text-center px-3 py-1 rounded-full hover:opacity-70 transition duration-200 ${
                isActive
                  ? "dark:bg-white dark:text-black bg-[#333] text-white font-semibold"
                  : "bg-gray-200 dark:bg-[#333] dark:text-gray-300 hover:bg-gray-200 hover:text-black"
              }`}
            >
              {zip}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
