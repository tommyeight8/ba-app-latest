"use client";

import { createContext, useContext, useState, useTransition } from "react";
import {
  fetchHubSpotContactsPaginated,
  searchContactsByCompany,
} from "@/app/actions/actions";
import { HubSpotContact } from "@/types/hubspot";

type SearchContextType = {
  query: string;
  setQuery: (val: string) => void;
  isPending: boolean;
  contacts: HubSpotContact[];
  setContacts: (contacts: HubSpotContact[]) => void;
  runSearch: () => void;
  isSearching: boolean;
  setIsSearching: (val: boolean) => void;
  loadInitialContacts: () => void; // ← this was missing
  after: string | null;
  setAfter: (val: string | null) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState<HubSpotContact[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [after, setAfter] = useState<string | null>(null);

  const runSearch = async () => {
    if (query.length < 2) return;
    setIsSearching(true);
    startTransition(async () => {
      const res = await searchContactsByCompany(query);
      setContacts(res.results);
    });
  };

  const loadInitialContacts = async () => {
    startTransition(async () => {
      const res = await fetchHubSpotContactsPaginated(12, ""); // or pageSize
      setContacts(res.results);
      setAfter(res.paging ?? null);
    });
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        isPending,
        contacts,
        setContacts,
        runSearch,
        isSearching,
        setIsSearching,
        loadInitialContacts,
        after,
        setAfter,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
