"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import Image from "next/image";
import { SideZipcodeFilter } from "./ZipCodeList";
import { ZipCodeLinkList } from "./ZipCodeLinkList";
import Link from "next/link";
import { useBrand } from "@/context/BrandContext";
import { useContactContext } from "@/context/ContactContext";
import { usePathname } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

export function AppSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  children?: React.ReactNode;
}) {
  const { brand } = useBrand();
  const { setQuery, setSelectedZip, setSelectedStatus } = useContactContext();
  const pathname = usePathname();

  const handleReset = () => {
    setQuery("");
    setSelectedZip(null);
    setSelectedStatus("all");
  };

  // Check if path matches /dashboard/contacts/[zip] format
  const isZipContactRoute = /^\/dashboard\/(contacts|zipcodes)\/[^/]+$/.test(
    pathname
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className={`${brand === "skwezed" && "bg-[#009444]"} p-4`}>
        <Link href="/dashboard" onClick={handleReset}>
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
              quality={100}
            />
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent
        className={`${brand === "skwezed" && "bg-[#009444]"} gap-0`}
      >
        {children}
        <AnimatePresence mode="wait">
          <motion.div
            key={isZipContactRoute ? "zip-link-list" : "zipcode-filter"}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {isZipContactRoute ? <ZipCodeLinkList /> : <SideZipcodeFilter />}
          </motion.div>
        </AnimatePresence>
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
