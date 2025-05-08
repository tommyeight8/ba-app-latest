// app/dashboard/layout.tsx
"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NavMain } from "@/components/nav-main";
import { SiteHeader } from "@/components/site-header";
import {
  IconClipboardList,
  IconHome2,
  IconUsers,
  IconApps,
  IconNote,
  IconPlus,
} from "@tabler/icons-react";
import { useState, useTransition } from "react";
// import { Providers } from "@/components/Providers";
// import { SearchProvider } from "@/contexts/SearchContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const navItems = [
    { title: "Home", url: "/dashboard", icon: IconHome2 },
    // { title: "Tasks", url: "/dashboard/tasks", icon: IconClipboardList },
    // { title: "Team", url: "/dashboard/team", icon: IconUsers },
    // {
    //   title: "Pending Visit",
    //   url: "/dashboard/pending-visit",
    //   icon: IconUsers,
    // },
    // {
    //   title: "Visit Requested by Rep",
    //   url: "/dashboard/visit-requested-by-rep",
    //   icon: IconUsers,
    // },
    // { title: "Dropped Off", url: "/dashboard/dropped-off", icon: IconUsers },
  ];

  const runSearch = () => {
    // Will be handled in the child page using context or props
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar>
        <NavMain items={navItems} />
      </AppSidebar>

      <SidebarInset>
        <SiteHeader
          user={{
            name: "Tommy",
            email: "tommy@example.com",
            avatar: "",
          }}
        />
        <main className="flex flex-col gap-6 w-full bg-muted/50 m-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
