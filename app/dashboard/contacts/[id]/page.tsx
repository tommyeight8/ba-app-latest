"use client";

import { use, useRef, useState } from "react";
import { useContactDetail } from "@/hooks/useContactDetail";
import Spinner from "@/components/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import Modal from "@/components/LogMeetingModal";
import { LogMeetingForm } from "@/components/LogMeetingForm";
import {
  IconBuildingStore,
  IconDeviceMobile,
  IconMail,
  IconMapPin,
  IconPlus,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { MeetingLogList } from "@/components/MeetingLogList";
import { StatusBadge } from "@/components/StatusBadge";

export default function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { contact, isLoading } = useContactDetail(id);
  const [isModalOpen, setModalOpen] = useState(false);

  const logListRef = useRef<{ refetch: () => void }>(null);

  const refetchMeetings = () => {
    logListRef.current?.refetch();
  };

  const getInitials = (company?: string): string => {
    if (!company) return "--";
    const words = company.trim().split(" ");
    return `${words[0]?.[0] || ""}${words[1]?.[0] || ""}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 min-h-screen h-full">
        <div className="flex gap-8 items-start">
          <Skeleton className="h-36 w-36 rounded-full" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-1/3" /> {/* company name */}
            <Skeleton className="h-4 w-1/2" /> {/* email */}
            <Skeleton className="h-4 w-1/3" /> {/* phone */}
            <Skeleton className="h-4 w-2/3" /> {/* address */}
            <Skeleton className="h-9 w-36" /> {/* log meeting button */}
          </div>
        </div>
        {/* <div className="mt-8 space-y-2">
          <Skeleton className="h-6 w-32" />
          <ul className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <li
                key={i}
                className="border border-gray-200 dark:border-zinc-700 p-4 rounded shadow-sm flex flex-col space-y-3"
              >
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/2 mt-2" />
                <div className="flex gap-2 justify-end mt-auto">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    );
  }

  if (!contact) return <p className="p-6 text-red-500">Contact not found.</p>;

  return (
    <div className="min-h-screen h-full relative">
      <div className="flex gap-8">
        <div className="absolute top-0 right-0 flex flex-col gap-1">
          <span className="text-gray-500">Status: </span>
          <StatusBadge
            status={contact.properties.l2_lead_status || "unknown"}
          />
        </div>
        <div className="h-36 w-36 rounded-full bg-green-400 flex items-center justify-center text-[48px] font-bold uppercase text-white">
          {getInitials(contact?.properties?.company)}
        </div>

        <div className="flex-1">
          <h3 className="dark:text-white font-bold text-2xl uppercase">
            {contact?.properties.company}
          </h3>

          <p className="flex items-center gap-2 mt-4 dark:text-gray-300">
            <IconMail size={18} />
            {contact.properties?.email || "N/A"}
          </p>

          <p className="flex items-center gap-2 dark:text-gray-300">
            <IconDeviceMobile size={18} />
            {contact.properties?.phone || "N/A"}
          </p>

          <p className="flex items-center gap-2 dark:text-gray-300">
            <IconMapPin size={18} />
            {contact.properties?.address || "N/A"},{" "}
            {contact.properties?.city || "N/A"}{" "}
            {contact.properties?.zip || "N/A"}
          </p>

          {/* ✅ Log Meeting Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 px-4 py-2 bg-transparent border border-gray-200 hover:bg-gray-200 dark:hover:text-black rounded cursor-pointer
            transition duration-200 flex items-center gap-1"
          >
            <IconPlus size={18} /> Log Meeting
          </button>
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

      {/* ✅ Meeting Modal */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Log Meeting</DialogTitle>
          </DialogHeader>

          <LogMeetingForm
            contactId={contact.id}
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
