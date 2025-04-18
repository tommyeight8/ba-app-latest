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

export function AppSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  children?: React.ReactNode;
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="bg-[#1c1c1c] text-white">
        <Image
          src="/images/ba-logo-alt.png"
          width={90}
          height={50}
          alt="logo"
          className="invert-20"
        />
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">VPR BBA</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarHeader>

      <SidebarContent className="bg-[#1c1c1c] text-white">
        {children} {/* ← Render NavMain or anything else here */}
      </SidebarContent>

      <SidebarFooter className="bg-[#1c1c1c] text-white">
        <NavUser
          user={{
            name: "Tom",
            email: "tom@example.com",
            avatar: "/avatars/shadcn.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
