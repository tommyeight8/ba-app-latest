"use client";

import { SessionProvider } from "next-auth/react";
import { ContactEditProvider } from "@/context/ContactEditContext";
import { ContactListProvider } from "@/context/ContactListContext";
import { BrandProvider } from "@/context/BrandContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

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
        <ContactListProvider>
          <ContactEditProvider>
            <NextThemesProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </NextThemesProvider>
          </ContactEditProvider>
        </ContactListProvider>
      </BrandProvider>
    </SessionProvider>
  );
}
