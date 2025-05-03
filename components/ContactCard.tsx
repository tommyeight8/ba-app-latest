"use client";

import { HubSpotContact } from "@/types/hubspot";
import { useContactEdit } from "@/context/ContactEditContext";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { IconPencil, IconTextPlus } from "@tabler/icons-react";
import clsx from "clsx";
import { useBrand } from "@/context/BrandContext";
import { useRouter } from "next/navigation";
import { useLogMeetingModal } from "@/context/LogMeetingModalContext";

export function ContactCard({
  contact,
  href,
}: {
  contact: HubSpotContact;
  href: string;
}) {
  const { setContact, setOpen } = useContactEdit();
  const { brand } = useBrand();
  const router = useRouter();
  const { setOpen: setLogOpen, setContactId, setContactData } = useLogMeetingModal();

  const {
    email,
    phone,
    company,
    city,
    address,
    state,
    zip,
    hs_lead_status,
    l2_lead_status,
  } = contact.properties;

  console.log(contact)

  const validL2Statuses = [
    "pending visit",
    "visit requested by rep",
    "dropped off",
  ];
  const showBadge =
    hs_lead_status === "Samples" &&
    validL2Statuses.includes(l2_lead_status ?? "");

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col gap-0">
      {/* ✅ Clickable area for navigation */}
      <div
        onClick={() => router.push(`/dashboard/contacts/${href}`)}
        className="cursor-pointer flex-grow"
      >
        <CardContent className="p-4 flex flex-col gap-2">
          <div className="font-bold uppercase text-lg bg-gray-100 dark:bg-[#333] text-black dark:text-white p-2 rounded">
            {company ?? "-"}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            {email ?? "-"}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            {phone ?? "-"}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {address ?? "-"} {city ?? "-"}, {state ?? "-"} {zip ?? "-"}
          </div>

          {showBadge && <StatusBadge status={l2_lead_status || "unknown"} />}
        </CardContent>
      </div>

      {/* ✅ Action buttons */}
      <div className="flex gap-2 px-4 pb-4">
        <button
          className="flex items-center gap-1 p-2 text-green-400 hover:underline underline-offset-4 transition duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setContact(contact);
            setOpen(true);
          }}
        >
          <IconPencil size={18} className="shrink-0" />
          Edit
        </button>
        <button
          className="flex items-center gap-1 p-2 text-gray-500 dark:text-gray-200 hover:underline underline-offset-4 transition duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setContactId(contact.id);
            setContactData(contact); // ✅ Pass full data

            setLogOpen(true);
          }}
        >
          <IconTextPlus size={18} className="shrink-0" />
          Log Meeting
        </button>
      </div>
    </Card>
  );
}
