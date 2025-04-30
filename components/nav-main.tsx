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

import Link from "next/link";
import { useBrand } from "@/context/BrandContext";

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
  const { brand } = useBrand();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col p-2">
        {/* 🔗 Nav Items */}
        <SidebarMenu className="mt-2">
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={clsx(
                      `cursor-pointer ${
                        brand === "skwezed" &&
                        "text-white bg-green-900/20 transition duration-200"
                      }`,
                      isActive &&
                        `${
                          brand === "skwezed" ? "bg-gray-100" : "bg-gray-200"
                        } dark:bg-white ${
                          brand === "skwezed" ? "text-black" : "text-black"
                        } dark:hover:text-black`
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
