"use client";

import { SessionProvider } from "next-auth/react";
import { ContactEditProvider } from "@/context/ContactEditContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ContactEditProvider>{children}</ContactEditProvider>
    </SessionProvider>
  );
}
