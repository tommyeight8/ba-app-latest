// components/nav-main.tsx
"use client";

import { Input } from "@/components/ui/input";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconCirclePlusFilled,
  IconMail,
  IconSearch,
  type Icon,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

import { useSearchContext } from "@/contexts/SearchContext";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();

  const { query, setQuery, runSearch, isPending } = useSearchContext();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* 🔍 Search Input + Button */}
        <div className="relative flex items-center gap-2 w-full">
          <Input
            placeholder="Search store..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            className="text-sm pr-10 focus:border-0"
          />

          {/* ❌ Clear button inside the input */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-12 text-muted-foreground hover:text-destructive text-lg"
            >
              ×
            </button>
          )}

          {/* 🔍 Search trigger */}
          <Button
            size="icon"
            onClick={runSearch}
            disabled={isPending}
            className="border-0 bg-transparent"
          >
            <IconSearch className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
        {/* ➕ Quick Create */}
        {/* <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="cursor-pointer bg-primary text-primary-foreground hover:text-white hover:bg-primary/90 active:bg-primary/90 min-w-8 duration-200"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
        {/* 🔗 Nav Items */}
        <SidebarMenu className="mt-2">
          {items.map((item) => {
            const isActive = pathname === item.url; // or use `.startsWith(item.url)` if needed
            console.log(pathname, item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={clsx(
                      "cursor-pointer",
                      isActive && "bg-white text-black"
                    )}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
