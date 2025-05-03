"use client";

import { useState } from "react";
import { HubSpotContact } from "@/types/hubspot";
import { useContactEdit } from "@/context/ContactEditContext";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { EditContactModal } from "./EditContactModal";
import { LogMeetingForm } from "./LogMeetingForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { IconPencil, IconPlus, IconTextPlus } from "@tabler/icons-react";
import clsx from "clsx";
import { useBrand } from "@/context/BrandContext";

import { useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

export function ContactCard({
  contact,
  href,
}: {
  contact: HubSpotContact;
  href: string;
}) {
  const { setContact, setOpen } = useContactEdit();
  const [logOpen, setLogOpen] = useState(false);
  const { brand } = useBrand();
  const router = useRouter();

  const {
    email,
    phone,
    company,
    city,
    address,
    zip,
    hs_lead_status,
    l2_lead_status,
  } = contact.properties;

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
      {/* ✅ Only this div is clickable */}
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
            {address ?? "-"}, {city ?? "-"} {zip ?? "-"}
          </div>

          {showBadge && <StatusBadge status={l2_lead_status || "unknown"} />}
        </CardContent>
      </div>

      {/* ✅ Buttons stay separate and not clickable */}
      <div className="flex gap-2 px-4 pb-4">
        <button
          className="p-2 text-green-400 hover:underline cursor-pointer underline-offset-4 transition duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setContact(contact);
            setOpen(true);
          }}
        >
          Edit
        </button>
        <button
          className="p-2 text-gray-200 hover:underline cursor-pointer underline-offset-4 transition duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setContact(contact);
            setOpen(true);
          }}
        >
          Log Meeting
        </button>
        {/* <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setContact(contact);
            setOpen(true);
          }}
          initial={{ width: 44, height: 44 }}
          whileHover={{ width: 120 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="overflow-hidden rounded-full border border-zinc-300 dark:border-gray-200 transition flex items-center gap-2 px-[15px]
             hover:bg-zinc-800 hover:border-zinc-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-black cursor-pointer"
        >
          <IconPencil size={18} className="shrink-0" />
          <motion.span
            className="whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1 }}
          >
            Edit
          </motion.span>
        </motion.button>

        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setLogOpen(true);
          }}
          initial={{ width: 44, height: 44 }}
          whileHover={{ width: 150 }}
          transition={{ duration: 0.4, type: "spring" }}
          className={clsx(
            `overflow-hidden cursor-pointer text-sm py-2 pl-3 pr-4 border rounded-full transition flex items-center gap-2 justify-start group`,
            brand === "skwezed"
              ? "border-[#009444] bg-[#009444] text-white"
              : "border-green-400 bg-green-400 text-black dark:text-green-400 dark:bg-transparent dark:hover:bg-green-400 dark:hover:text-black"
          )}
        >
          <IconTextPlus size={18} className="shrink-0 transition-transform" />
          <span className="whitespace-nowrap overflow-hidden transition-opacity duration-300 group-hover:opacity-100 opacity-0">
            Log Meeting
          </span>
        </motion.button> */}
      </div>

      {/* Modals */}
      {/* <EditContactModal showDetails={true} /> */}
      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center mb-4">Log Meeting</DialogTitle>
          </DialogHeader>
          <LogMeetingForm
            contactId={contact.id}
            contactFirstName={contact.properties.firstname}
            contactCompany={contact.properties.company}
            onSuccess={() => setLogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
