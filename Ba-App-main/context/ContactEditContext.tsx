"use client";

import { createContext, useContext, useState } from "react";
import { HubSpotContact } from "@/types/hubspot";

type ContactEditContextType = {
  contact: HubSpotContact | null;
  open: boolean;
  setContact: (contact: HubSpotContact | null) => void;
  setOpen: (open: boolean) => void;
};

const ContactEditContext = createContext<ContactEditContextType | undefined>(
  undefined
);

export const useContactEdit = () => {
  const context = useContext(ContactEditContext);
  if (!context)
    throw new Error("useContactEdit must be used within ContactEditProvider");
  return context;
};

export function ContactEditProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [contact, setContact] = useState<HubSpotContact | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <ContactEditContext.Provider value={{ contact, open, setContact, setOpen }}>
      {children}
    </ContactEditContext.Provider>
  );
}
