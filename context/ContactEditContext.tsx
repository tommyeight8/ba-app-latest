"use client";

import { createContext, useContext, useState } from "react";
import { HubSpotContact } from "@/types/hubspot";

type ContactEditContextType = {
  open: boolean;
  setOpen: (val: boolean) => void;
  contact: HubSpotContact | null;
  setContact: (c: HubSpotContact | null) => void;
  fetchPage?: (
    pageNum: number,
    status?: string,
    query?: string,
    updater?: (prev: HubSpotContact[]) => HubSpotContact[]
  ) => Promise<void>;
  page?: number;
  setFetchPage: (fn: ContactEditContextType["fetchPage"]) => void;
  setPage: (p: number) => void;
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
  const [fetchPage, setFetchPage] =
    useState<ContactEditContextType["fetchPage"]>();
  const [page, setPage] = useState<number>();

  return (
    <ContactEditContext.Provider
      value={{
        contact,
        setContact,
        open,
        setOpen,
        fetchPage,
        setFetchPage,
        page,
        setPage,
      }}
    >
      {children}
    </ContactEditContext.Provider>
  );
}
