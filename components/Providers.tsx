"use client";

import { SessionProvider } from "next-auth/react";
import { ContactEditProvider } from "@/context/ContactEditContext";
import { ContactListProvider } from "@/context/ContactListContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ContactListProvider>
        <ContactEditProvider>{children}</ContactEditProvider>
      </ContactListProvider>
    </SessionProvider>
  );
}
