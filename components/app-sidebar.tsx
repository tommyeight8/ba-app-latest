"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { NavUser } from "@/components/nav-user";
import Image from "next/image";
import { ZipCodeList } from "./ZipCodeList";
import Link from "next/link";
import { useBrand } from "@/context/BrandContext";

export function AppSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  children?: React.ReactNode;
}) {
  const { brand } = useBrand();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className={`${brand === "skwezed" && "bg-[#009444]"} p-4`}>
        <Link href={"/dashboard"} className="">
          {brand === "litto" ? (
            <Image
              src="/images/litto-logo-blk.webp"
              width={100}
              height={50}
              alt="logo"
              className="dark:invert"
              quality={100}
            />
          ) : (
            <Image
              src="/images/skwezed-logo.png"
              width={100}
              height={50}
              alt="logo"
              className=""
              quality={100}
            />
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent
        className={`${brand === "skwezed" && "bg-[#009444]"} gap-0`}
      >
        {children}
        <ZipCodeList />
      </SidebarContent>

      <SidebarFooter className={`${brand === "skwezed" && "bg-[#009444]"}`}>
        <NavUser
          user={{
            name: "Tom",
            email: "default@vpr.com",
            avatar: "/avatars/shadcn.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
