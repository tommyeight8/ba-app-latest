"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HubSpotContact } from "@/types/hubspot";
import {
  fetchHubSpotContactsPaginated,
  searchContactsByCompany,
} from "@/app/actions/actions";
import { searchContactsByStatus } from "@/app/actions/searchContactsByStatus";
import { fetchAllContactsByEmail } from "@/app/actions/fetchAllContactsByEmail";
import { useBrand } from "./BrandContext";

import { usePathname } from "next/navigation";

type ContactContextType = {
  contacts: HubSpotContact[];
  setContacts: React.Dispatch<React.SetStateAction<HubSpotContact[]>>;
  allZips: string[];
  loadingContacts: boolean;
  loadingZips: boolean;
  refetchContacts: () => Promise<void>;
  fetchPage: (
    page: number,
    status?: string,
    query?: string,
    updater?: (prev: HubSpotContact[]) => HubSpotContact[],
    zip?: string | null
  ) => Promise<void>;
  page: number;
  setPage: (p: number) => void;

  // Edit Modal
  selectedContact: HubSpotContact | null;
  setSelectedContact: (c: HubSpotContact | null) => void;
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;

  // Log Meeting Modal
  logOpen: boolean;
  setLogOpen: (open: boolean) => void;
  contactId: string | null;
  setContactId: (id: string | null) => void;
  setLogContactData: (c: HubSpotContact | null) => void;
  logContactData: HubSpotContact | null;

  // Pagination
  hasNext: boolean;
  setHasNext: (v: boolean) => void;

  // Search / Filter
  query: string;
  setQuery: (q: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedZip: string | null;
  setSelectedZip: (zip: string | null) => void;

  // Zip contact list
  zipContacts: HubSpotContact[];
  setZipContacts: React.Dispatch<React.SetStateAction<HubSpotContact[]>>;
};

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const useContactContext = () => {
  const context = useContext(ContactContext);
  if (!context)
    throw new Error("useContactContext must be used within a ContactProvider");
  return context;
};

export function ContactProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const { brand } = useBrand();
  const [contacts, setContacts] = useState<HubSpotContact[]>([]);
  const [allZips, setAllZips] = useState<string[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingZips, setLoadingZips] = useState(false);
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<Record<string, string | null>>({});
  const [hasNext, setHasNext] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedZip, setSelectedZip] = useState<string | null>(null);
  const [zipContacts, setZipContacts] = useState<HubSpotContact[]>([]);

  const pathname = usePathname();

  const [selectedContact, setSelectedContact] = useState<HubSpotContact | null>(
    null
  );
  const [editOpen, setEditOpen] = useState(false);

  const [logOpen, setLogOpen] = useState(false);
  const [contactId, setContactId] = useState<string | null>(null);
  const [logContactData, setLogContactData] = useState<HubSpotContact | null>(
    null
  );

  const getCursorKey = (page: number, status: string, query: string) =>
    `${page}-${status.trim().toLowerCase()}-${
      query.trim().toLowerCase() || "none"
    }`;

  const fetchPage = async (
    pageNum: number,
    status: string = "all",
    query: string = "",
    updater?: (prev: HubSpotContact[]) => HubSpotContact[],
    zip?: string | null
  ) => {
    if (!session?.user?.email) return;

    if (updater) {
      setContacts((prev) => updater(prev));
      setPage(pageNum);
      return;
    }

    setLoadingContacts(true);
    const cursorKey = getCursorKey(pageNum, status, query);
    const cursor = cursors[cursorKey] ?? "";

    try {
      let res;

      if (query.length >= 2) {
        const result = await searchContactsByCompany(
          query,
          cursor,
          12,
          session.user.email,
          brand
        );
        res = { results: result.results, next: result.paging ?? null };
      } else if (status !== "all") {
        const result = await searchContactsByStatus(
          status,
          cursor,
          12,
          session.user.email,
          brand
        );
        res = { results: result.results, next: result.paging ?? null };
      } else {
        res = await fetchHubSpotContactsPaginated(
          12,
          cursor,
          session.user.email,
          brand
        );
      }

      // ✅ Zip code filtering
      if ((zip && zip !== "all") || status !== "all" || query.length >= 2) {
        const all = await fetchAllContactsByEmail(session.user.email, brand);

        let filtered = all;

        if (zip && zip !== "all") {
          filtered = filtered.filter(
            (c) => c.properties?.zip?.toString().trim() === zip.trim()
          );
        }

        if (status !== "all") {
          filtered = filtered.filter(
            (c) =>
              c.properties?.l2_lead_status?.toLowerCase() ===
              status.toLowerCase()
          );
        }

        if (query.length >= 2) {
          filtered = filtered.filter((c) =>
            c.properties?.company
              ?.toLowerCase()
              .includes(query.trim().toLowerCase())
          );
        }

        setContacts(filtered);
        setHasNext(false);
        setPage(1);
        return;
      }

      let filtered = res.results ?? [];

      setContacts(filtered); // ✅ You need this!

      setHasNext(!!res.next);

      if (res.next) {
        setCursors((prev) => ({
          ...prev,
          [getCursorKey(pageNum + 1, status, query)]: res.next!,
        }));
      }

      setPage(pageNum);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const refetchContacts = async () => {
    if (!session?.user?.email) return;

    setLoadingContacts(true);
    setLoadingZips(true);

    try {
      const [paginatedRes, allRes] = await Promise.all([
        fetchHubSpotContactsPaginated(12, "", session.user.email, brand),
        fetchAllContactsByEmail(session.user.email, brand),
      ]);

      if (paginatedRes.results) setContacts(paginatedRes.results);

      const zipSet = new Set(
        allRes
          .map((c) => c.properties?.zip)
          .filter((zip): zip is string => typeof zip === "string")
      );
      setAllZips(Array.from(zipSet));
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    } finally {
      setLoadingContacts(false);
      setLoadingZips(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      setContacts([]);
      setAllZips([]);
      setCursors({});
      refetchContacts();
    }
  }, [status, brand]);

  useEffect(() => {
    // Reset context state when navigating back to /dashboard
    if (pathname === "/dashboard") {
      setQuery("");
      setSelectedStatus("all");
      setSelectedZip(null);
      setPage(1);
      setContacts([]);
      setZipContacts([]);
      setHasNext(false);
      setSelectedContact(null);
      setEditOpen(false);
      setLogOpen(false);
      setContactId(null);
      setLogContactData(null);
      setCursors({});
      refetchContacts();
    }
  }, [pathname]);

  return (
    <ContactContext.Provider
      value={{
        contacts,
        setContacts,
        allZips,
        loadingContacts,
        loadingZips,
        refetchContacts,
        fetchPage,
        page,
        setPage,
        selectedContact,
        setSelectedContact,
        editOpen,
        setEditOpen,
        logOpen,
        setLogOpen,
        contactId,
        setContactId,
        logContactData,
        setLogContactData,
        hasNext,
        setHasNext,
        query,
        setQuery,
        selectedStatus,
        setSelectedStatus,
        selectedZip,
        setSelectedZip,
        zipContacts,
        setZipContacts,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}
