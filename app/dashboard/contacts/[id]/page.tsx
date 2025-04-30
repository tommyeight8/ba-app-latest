"use client";

import { use, useRef, useState } from "react";
import { useContactDetail } from "@/hooks/useContactDetail";
import { Skeleton } from "@/components/ui/skeleton";
import Modal from "@/components/LogMeetingModal";
import { LogMeetingForm } from "@/components/LogMeetingForm";
import {
  IconDeviceMobile,
  IconMail,
  IconMapPin,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MeetingLogList } from "@/components/MeetingLogList";
import { StatusBadgeContactDetails } from "@/components/StatusBadgeContactDetails";
import { EditContactModal } from "@/components/EditContactModal";
import { useContactEdit } from "@/context/ContactEditContext";
import { UpdateStatusModal } from "@/components/UpdateStatusModal";
import clsx from "clsx";
import { useBrand } from "@/context/BrandContext";

function getPastelColors(company?: string) {
  if (!company) {
    return {
      bg: "rgb(203,213,225)", // pastel gray
      text: "rgb(100,116,139)", // darker gray
    };
  }

  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }

  const baseR = 200 + (hash % 56);
  const baseG = 200 + ((hash >> 8) % 56);
  const baseB = 200 + ((hash >> 16) % 56);

  // Darken by ~40 for text color, but don't go below 0
  const textR = Math.max(0, baseR - 40);
  const textG = Math.max(0, baseG - 40);
  const textB = Math.max(0, baseB - 40);

  return {
    bg: `rgb(${baseR}, ${baseG}, ${baseB})`,
    text: `rgb(${textR}, ${textG}, ${textB})`,
  };
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { contact, isLoading, refetchContactDetail, mutateContact } =
    useContactDetail(id);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { setOpen, setContact: setContextContact } = useContactEdit();
  const logListRef = useRef<{ refetch: () => void }>(null);
  const { brand } = useBrand();

  const { bg, text } = getPastelColors(contact?.properties?.company);

  const refetchMeetings = () => {
    logListRef.current?.refetch();
  };

  const getInitials = (company?: string) => {
    if (!company) return "--";
    const words = company.trim().split(" ");
    return `${words[0]?.[0] || ""}${words[1]?.[0] || ""}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 min-h-screen h-full">
        <div className="flex gap-8 items-start">
          <Skeleton className="h-36 w-36 rounded-full hidden md:inline-block" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
      </div>
    );
  }

  if (!contact) return <p className="p-6 text-red-500">Contact not found.</p>;

  return (
    <div className="min-h-screen h-full relative">
      <div className="flex flex-col md:flex-row rounded-md gap-8 p-6 border border-muted bg-muted/50 dark:bg-muted/50">
        <div
          className="hidden h-36 w-36 rounded-full md:flex m-auto items-center justify-center text-4xl md:text-[48px] font-bold uppercase transition-all duration-300 ease-in-out"
          style={{ backgroundColor: bg, color: text }}
        >
          {getInitials(contact?.properties?.company)}
        </div>

        <div className="flex-1">
          <h3 className="dark:text-white font-bold text-2xl uppercase">
            {contact?.properties.company}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadgeContactDetails
              status={contact.properties.l2_lead_status || "unknown"}
            />
            {/* update status modal */}
            <IconPencil
              className="text-gray-400 cursor-pointer"
              onClick={() => setShowStatusModal(true)}
            />
          </div>

          <div className="flex items-center gap-2 mt-4 dark:text-gray-300">
            <IconMail size={18} />
            {contact.properties?.email || "N/A"}
          </div>

          <div className="flex items-center gap-2 dark:text-gray-300 my-1">
            <IconDeviceMobile size={18} />
            {contact.properties?.phone || "N/A"}
          </div>

          <div className="flex gap-2 dark:text-gray-300">
            <IconMapPin size={18} />
            <div className="w-full">
              {contact.properties?.address || "N/A"},{" "}
              {contact.properties?.city || "N/A"},{" "}
              {contact.properties?.zip || "N/A"}
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                setContextContact(contact);
                setOpen(true);
              }}
              className="text-sm mt-6 px-4 py-2 bg-transparent border border-black hover:bg-black hover:text-white 
              dark:border-gray-100 dark:hover:bg-gray-100 dark:hover:text-black rounded cursor-pointer transition duration-200 flex items-center gap-1"
            >
              <IconPencil size={18} /> Edit Contact
            </button>

            {/* Log Meeting */}
            <button
              onClick={() => setModalOpen(true)}
              className={clsx(
                "text-sm mt-6 px-4 py-2 border hover:opacity-80 rounded cursor-pointer transition duration-200 flex items-center gap-1",
                brand === "skwezed"
                  ? "boreder-[#009444] bg-[#009444] text-white"
                  : "border-green-400 bg-green-400 text-black dark:text-green-400 dark:bg-transparent dark:hover:bg-green-400 dark:hover:text-black"
              )}
            >
              <IconPlus size={18} /> Log Meeting
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 my-6">
        <hr className="flex-grow border-t border-gray-200 dark:border-zinc-800" />
        <div className="text-lg font-semibold whitespace-nowrap">
          Meeting Logs
        </div>
        <hr className="flex-grow border-t border-gray-200 dark:border-zinc-800" />
      </div>

      <MeetingLogList ref={logListRef} contactId={contact.id} />

      <EditContactModal
        refetchContact={refetchContactDetail}
        mutateContact={mutateContact} // 🛠 Pass mutate for optimistic update
        showDetails={false}
      />

      <UpdateStatusModal
        open={showStatusModal}
        setOpen={setShowStatusModal}
        currentStatus={contact.properties.l2_lead_status || "pending visit"}
        contactId={contact.id}
        contact={contact}
        mutateContact={mutateContact}
        refetchContact={refetchContactDetail}
      />

      {/* Meeting Modal */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          autoFocus={false}
          className="sm:max-w-lg w-full max-h-[85vh] overflow-y-auto"
        >
          <DialogHeader className="mb-2">
            <DialogTitle>Log Meeting</DialogTitle>
          </DialogHeader>

          <LogMeetingForm
            contactId={contact.id}
            contactFirstName={contact.properties?.firstname}
            onSuccess={() => {
              refetchMeetings();
              setModalOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
