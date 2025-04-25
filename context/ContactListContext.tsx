"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { HubSpotContact } from "@/types/hubspot";
import { fetchHubSpotContactsPaginated } from "@/app/actions/actions";
import { fetchAllContactsByEmail } from "@/app/actions/fetchAllContactsByEmail";

// Extend the context type to include allZips
type ContactListContextType = {
  contacts: HubSpotContact[];
  setContacts: (contacts: HubSpotContact[]) => void;
  refetchContacts: () => Promise<void>;
  allZips: string[];
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

export function ContactListProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<HubSpotContact[]>([]);
  const [allZips, setAllZips] = useState<string[]>([]);
  const { data: session, status } = useSession();

  const fetchZipsOnly = async () => {
    if (!session?.user?.email) return;
    try {
      const allRes = await fetchAllContactsByEmail(session.user.email);
      const zipSet = new Set(
        allRes
          .map((c) => c.properties?.zip)
          .filter((zip): zip is string => typeof zip === "string")
      );
      setAllZips(Array.from(zipSet));
    } catch (err) {
      console.error("Failed to fetch ZIPs:", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchZipsOnly();
    }
  }, [status]);

  return (
    <ContactListContext.Provider
      value={{ contacts, setContacts, refetchContacts: fetchZipsOnly, allZips }}
    >
      {children}
    </ContactListContext.Provider>
  );
}

// export function ContactListProvider({ children }: { children: ReactNode }) {
//   const [contacts, setContacts] = useState<HubSpotContact[]>([]);
//   const [allZips, setAllZips] = useState<string[]>([]);
//   const { data: session, status } = useSession();

//   const refetchContacts = async () => {
//     if (!session?.user?.email) return;

//     try {
//       const [paginatedRes, allRes] = await Promise.all([
//         fetchHubSpotContactsPaginated(12, "", session.user.email),
//         fetchAllContactsByEmail(session.user.email),
//       ]);

//       if (paginatedRes.results) setContacts(paginatedRes.results);

//       const zipSet = new Set(
//         allRes
//           .map((c) => c.properties?.zip)
//           .filter((zip): zip is string => typeof zip === "string")
//       );
//       setAllZips(Array.from(zipSet));
//     } catch (err) {
//       console.error("Failed to fetch contacts:", err);
//     }
//   };

//   useEffect(() => {
//     // if (status === "authenticated") {
//     //   refetchContacts();
//     // }
//     // Only fetch ZIPs if needed
//     if (status === "authenticated") {
//       fetchAllContactsByEmail(session.user.email).then((allRes) => {
//         const zipSet = new Set(
//           allRes
//             .map((c) => c.properties?.zip)
//             .filter((zip): zip is string => typeof zip === "string")
//         );
//         setAllZips(Array.from(zipSet));
//       });
//     }
//   }, [status]);

//   return (
//     <ContactListContext.Provider
//       value={{ contacts, setContacts, refetchContacts, allZips }}
//     >
//       {children}
//     </ContactListContext.Provider>
//   );
// }
