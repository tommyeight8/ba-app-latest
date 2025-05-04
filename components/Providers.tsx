"use client";

import { SessionProvider } from "next-auth/react";
import { ContactEditProvider } from "@/context/ContactEditContext";
import { ContactListProvider } from "@/context/ContactListContext";
import { BrandProvider } from "@/context/BrandContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { EditContactModal } from "./EditContactModal";
import { LogMeetingModal } from "./LogMeetingModal";
import { LogMeetingModalProvider } from "@/context/LogMeetingModalContext";
import { ContactProvider } from "@/context/ContactContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Wait until the client mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SessionProvider>
      <BrandProvider>
      <ContactProvider>
        <ContactListProvider>
          <ContactEditProvider>
            <LogMeetingModalProvider>
            <NextThemesProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              
              <EditContactModal showDetails={false} />
              <LogMeetingModal />
            </NextThemesProvider>
            </LogMeetingModalProvider>
          </ContactEditProvider>
        </ContactListProvider>
        </ContactProvider>
      </BrandProvider>
    </SessionProvider>
  );
}
