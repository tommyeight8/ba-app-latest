// context/ContactListContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { HubSpotContact } from "@/types/hubspot";
import { fetchHubSpotContactsPaginated } from "@/app/actions/actions";

type ContactListContextType = {
  contacts: HubSpotContact[];
  setContacts: (contacts: HubSpotContact[]) => void;
  refetchContacts: () => Promise<void>;
};

const ContactListContext = createContext<ContactListContextType | undefined>(
  undefined
);

export const useContactList = () => {
  const context = useContext(ContactListContext);
  if (!context)
    throw new Error("useContactList must be used within ContactListProvider");
  return context;
};

export function ContactListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [contacts, setContacts] = useState<HubSpotContact[]>([]);

  const refetchContacts = async () => {
    try {
      const { results } = await fetchHubSpotContactsPaginated(12);
      if (results) setContacts(results);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  useEffect(() => {
    refetchContacts(); // automatically fetch on mount
  }, []);

  return (
    <ContactListContext.Provider
      value={{ contacts, setContacts, refetchContacts }}
    >
      {children}
    </ContactListContext.Provider>
  );
}
