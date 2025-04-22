// "use client";

// import { createContext, useContext, useState, useTransition } from "react";
// import {
//   fetchHubSpotContactsPaginated,
//   searchContactsByCity,
//   searchContactsByCompany,
//   searchContactsByPostalCode,
// } from "@/app/actions/actions";
// import { HubSpotContact } from "@/types/hubspot";

// type SearchType = "company" | "postalCode" | "city";

// type AdminSearchContextType = {
//   query: string;
//   setQuery: (val: string) => void;
//   isPending: boolean;
//   contacts: HubSpotContact[];
//   setContacts: React.Dispatch<React.SetStateAction<HubSpotContact[]>>;
//   searchType: SearchType;
//   setSearchType: (type: SearchType) => void;
//   runSearch: () => void;
//   isSearching: boolean;
//   setIsSearching: (val: boolean) => void;
//   loadInitialContacts: () => void;
//   after: string | null;
//   setAfter: (val: string | null) => void;
// };

// const AdminSearchContext = createContext<AdminSearchContextType | undefined>(
//   undefined
// );

// export const AdminSearchProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [query, setQuery] = useState("");
//   const [contacts, setContacts] = useState<HubSpotContact[]>([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [isPending, startTransition] = useTransition();
//   const [after, setAfter] = useState<string | null>(null);
//   const [searchType, setSearchType] = useState<SearchType>("company");

//   const runSearch = async () => {
//     if (query.length < 2) return;
//     setIsSearching(true);

//     startTransition(async () => {
//       let res;

//       switch (searchType) {
//         case "postalCode":
//           res = await searchContactsByPostalCode(query);
//           break;
//         case "city":
//           res = await searchContactsByCity(query);
//           break;
//         default:
//           res = await searchContactsByCompany(query);
//           break;
//       }

//       setContacts(res.results);
//       setAfter(res.paging ?? null);
//       setIsSearching(false);
//     });
//   };

//   const loadInitialContacts = async () => {
//     startTransition(async () => {
//       const res = await fetchHubSpotContactsPaginated(12, "");
//       setContacts(res.results);
//       setAfter(res.paging ?? null);
//     });
//   };

//   return (
//     <AdminSearchContext.Provider
//       value={{
//         query,
//         setQuery,
//         isPending,
//         contacts,
//         setContacts,
//         runSearch,
//         isSearching,
//         setIsSearching,
//         loadInitialContacts,
//         after,
//         setAfter,
//         searchType,
//         setSearchType,
//       }}
//     >
//       {children}
//     </AdminSearchContext.Provider>
//   );
// };

// export const useAdminSearchContext = () => {
//   const context = useContext(AdminSearchContext);
//   if (!context) {
//     throw new Error(
//       "useAdminSearchContext must be used within an AdminSearchProvider"
//     );
//   }
//   return context;
// };
