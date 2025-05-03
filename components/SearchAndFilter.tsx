// components/SearchAndFilter.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { useBrand } from "@/context/BrandContext";

interface Props {
  query: string;
  selectedStatus: string;
  onQueryChange: (q: string) => void;
  onStatusChange: (val: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export default function SearchAndFilter({
  query,
  selectedStatus,
  onQueryChange,
  onStatusChange,
  onSearch,
  onClear,
}: Props) {
  const { brand } = useBrand();
  const lastBrand = useRef(brand);

  const statuses = [
    "all",
    "pending visit",
    "visit requested by rep",
    "dropped off",
  ];

  const statusStyles: Record<string, string> = {
    all: `bg-zinc-800 text-gray-100`,
    "pending visit": "bg-transparent text-orange-400",
    "visit requested by rep": "bg-transparent text-red-400",
    "dropped off": "bg-transparent text-green-400",
  };

  const ringColors: Record<string, string> = {
    all: "ring-gray-400",
    "pending visit": "ring-orange-400",
    "visit requested by rep": "ring-red-400",
    "dropped off": "ring-green-400",
  };

  useEffect(() => {
    if (lastBrand.current !== brand) {
      onClear(); // ✅ Clear filters on brand switch
      lastBrand.current = brand;
    }
  }, [brand]);

  return (
    <div className="flex flex-col xl:flex-row xl:items-center gap-4 xl:gap-2 w-full md:justify-between">
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => {
          const isActive = selectedStatus === status;

          return (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`px-3 py-1 rounded-full text-sm transition cursor-pointer ${
                statusStyles[status]
              } ${
                isActive
                  ? `ring-1 ring-offset-3 ${ringColors[status]} ring-offset-white dark:ring-offset-[#1a1a1a]`
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              {status === "all"
                ? "All Status"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          );
        })}
        {selectedStatus !== "all" && (
          <button
            onClick={onClear}
            className="text-muted-foreground cursor-pointer group"
          >
            <IconX className="text-red-400 group-hover:text-white transition duration-200 group-hover:bg-red-400 rounded-sm" />
          </button>
        )}
      </div>

      <div className="relative w-full md:max-w-[50%]">
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="Search store"
          className="w-full pr-20"
        />

        {query && (
          <button
            onClick={onClear}
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
          onClick={onSearch}
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
    </div>
  );
}
