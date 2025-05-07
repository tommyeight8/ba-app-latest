"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { HubSpotContact } from "@/types/hubspot";
import type { MeetingLogListRef } from "@/types/meeting";

type LogMeetingContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  contactId: string | null;
  setContactId: (id: string | null) => void;
  contactName?: string;
  setContactName: (name: string | undefined) => void;
  contactJobTitle?: string;
  setContactJobTitle: (title: string | undefined) => void;
  contactData?: Partial<HubSpotContact>;
  setContactData: (data?: Partial<HubSpotContact>) => void;
  onSuccess?: () => void;
  setOnSuccess: (cb?: () => void) => void;

  // ✅ New additions
  logListRef: React.MutableRefObject<MeetingLogListRef | null>;
  refetchContact?: () => void;
  setRefetchContact: (cb?: () => void) => void;
};

const LogMeetingModalContext = createContext<LogMeetingContextType | undefined>(
  undefined
);

export const useLogMeetingModal = () => {
  const ctx = useContext(LogMeetingModalContext);
  if (!ctx) throw new Error("useLogMeetingModal must be used within provider");
  return ctx;
};

export const LogMeetingModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [contactId, setContactId] = useState<string | null>(null);
  const [contactName, setContactName] = useState<string | undefined>();
  const [contactJobTitle, setContactJobTitle] = useState<string | undefined>();
  const [contactData, setContactData] = useState<
    Partial<HubSpotContact> | undefined
  >();
  const [onSuccess, setOnSuccess] = useState<() => void>();
  const [refetchContact, setRefetchContact] = useState<() => void>();
  const logListRef = useRef<MeetingLogListRef | null>(null); // ✅

  // Auto-fill name + job title from contactData
  useEffect(() => {
    if (contactData?.properties?.firstname) {
      setContactName(contactData.properties.firstname);
      setContactJobTitle(contactData.properties.jobtitle);
    }
  }, [contactData]);

  // Reset state on modal close
  useEffect(() => {
    if (!open) {
      setContactId(null);
      setContactName(undefined);
      setContactJobTitle(undefined);
      setContactData(undefined);
      setOnSuccess(undefined);
      setRefetchContact(undefined);
    }
  }, [open]);

  return (
    <LogMeetingModalContext.Provider
      value={{
        open,
        setOpen,
        contactId,
        setContactId,
        contactName,
        setContactName,
        contactJobTitle,
        setContactJobTitle,
        contactData,
        setContactData,
        onSuccess,
        setOnSuccess,
        logListRef,
        refetchContact,
        setRefetchContact,
      }}
    >
      {children}
    </LogMeetingModalContext.Provider>
  );
};

// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { HubSpotContact } from "@/types/hubspot";

// type LogMeetingContextType = {
//     open: boolean;
//     setOpen: (v: boolean) => void;
//     contactId: string | null;
//     setContactId: (id: string | null) => void;
//     contactName?: string;
//     setContactName: (name: string | undefined) => void;
//     contactJobTitle?: string;
//     setContactJobTitle: (title: string | undefined) => void;
//     onSuccess?: () => void;
//     setOnSuccess: (cb?: () => void) => void;
//     contactData?: Partial<HubSpotContact>;
//     setContactData: (data?: Partial<HubSpotContact>) => void;
//   };

// const LogMeetingModalContext = createContext<LogMeetingContextType | undefined>(
//   undefined
// );

// export const useLogMeetingModal = () => {
//   const ctx = useContext(LogMeetingModalContext);
//   if (!ctx) throw new Error("useLogMeetingModal must be used within provider");
//   return ctx;
// };

// export const LogMeetingModalProvider = ({ children }: { children: React.ReactNode }) => {
//   const [open, setOpen] = useState(false);
//   const [contactId, setContactId] = useState<string | null>(null);
//   const [contactName, setContactName] = useState<string | undefined>();
//   const [contactJobTitle, setContactJobTitle] = useState<string | undefined>();

//   const [onSuccess, setOnSuccess] = useState<() => void>();
//   const [contactData, setContactData] = useState<Partial<HubSpotContact> | undefined>();

//   // Automatically sync contactName when contactData changes
//   useEffect(() => {
//     if (contactData?.properties?.firstname) {
//         setContactName(contactData.properties.firstname);
//         setContactJobTitle(contactData.properties.jobtitle);
//     }
//   }, [contactData]);

//   // Optional: reset state on close
//  useEffect(() => {
//     if (!open) {
//       setContactId(null);
//       setContactName(undefined);
//       setContactJobTitle(undefined); // ✅ Reset this too
//       setContactData(undefined);
//       setOnSuccess(undefined);
//     }
//   }, [open]);

//   return (
//     <LogMeetingModalContext.Provider
//       value={{
//         open,
//         setOpen,
//         contactId,
//         setContactId,
//         contactName,
//         setContactName,
//         contactJobTitle,
//         setContactJobTitle,
//         onSuccess,
//         setOnSuccess,
//         contactData,
//         setContactData,
//       }}
//     >
//       {children}
//     </LogMeetingModalContext.Provider>
//   );
// };
