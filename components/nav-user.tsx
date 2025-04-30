"use client";

import {
  IconClipboardText,
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import clsx from "clsx";
import { useBrand } from "@/context/BrandContext";
import { useTheme } from "next-themes";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { data: session, status } = useSession();

  const userName = `${session?.user.firstName} ${session?.user.lastName}`;
  const userEmail = session?.user.email;
  const { setBrand, brand } = useBrand();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" }); // 👈 optional redirect after sign out
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={clsx(
                "cursor-pointer border-0 outline-none ring-0",
                brand === "skwezed"
                  ? "hover:bg-green-900/30 data-[state=open]:bg-[#009444] data-[state=open]:text-white"
                  : "hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              )}
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span
                  className={clsx(
                    "truncate font-medium capitalize",
                    brand === "skwezed" && "text-white"
                  )}
                >
                  {userName}
                </span>
                <span
                  className={clsx(
                    "truncate text-xs",
                    brand === "skwezed"
                      ? "text-gray-200"
                      : "text-muted-foreground"
                  )}
                >
                  {userEmail}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={userName} />
                  <AvatarFallback className="rounded-lg">BA</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium capitalize">
                    {userName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/dashboard/account">
                <DropdownMenuItem className="cursor-pointer">
                  <IconClipboardText />
                  Account
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setBrand("litto")}
              >
                <IconClipboardText />
                LITTO
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setTheme("light");
                  setBrand("skwezed");
                }} // ✅ set SKWEZED
              >
                <IconClipboardText />
                Skwezed
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
