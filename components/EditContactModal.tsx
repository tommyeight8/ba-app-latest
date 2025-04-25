"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useContactEdit } from "@/context/ContactEditContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { setLeadStatusToSamples } from "@/app/actions/setLeadStatus";
import { toast } from "react-hot-toast";
import { HubSpotContact } from "@/types/hubspot";

import { updateL2LeadStatus } from "@/app/actions/updateL2LeadStatus";
import { fetchContactById } from "@/app/actions/fetchContactById";
import { useContactList } from "@/context/ContactListContext";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { EditContactSkeleton } from "./EditContactSkeleton";
import Spinner from "./Spinner";

export function EditContactModal() {
  const { contact, open, setOpen, setContact } = useContactEdit();
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    StoreName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const contactId = contact?.id;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refetchContacts } = useContactList();

  const fetchAndSetContact = async (id: string) => {
    setLoading(true);
    const updated = await fetchContactById(id);
    if (updated) {
      setContact(updated);
      setForm({
        StoreName: updated.properties.company || "",
        email: updated.properties.email || "",
        phone: updated.properties.phone || "",
        address: updated.properties.address || "",
        city: updated.properties.city || "",
        state: updated.properties.state || "",
        zip: updated.properties.zip || "",
      });
      setSelectedStatus(updated.properties.l2_lead_status as Status);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!open || !contact?.id) return;
    fetchAndSetContact(contact.id);
  }, [open, contact?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSetLeadStatus = async () => {
    if (!contact?.id) return;
    setIsSubmitting(true);
    const res = await setLeadStatusToSamples(contact.id);
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Lead status set to 'samples'");
      await fetchAndSetContact(contact.id); // Update UI with fresh data
      setOpen(false);
    } else {
      toast.error(res.message || "Failed to update lead status.");
    }
  };

  const statuses = [
    "pending visit",
    "visit requested by rep",
    "dropped off",
  ] as const;
  type Status = (typeof statuses)[number];

  const statusColors: Record<Status, string> = {
    "pending visit": "ring-orange-400 bg-orange-400",
    "visit requested by rep": "ring-red-400 bg-red-400",
    "dropped off": "ring-green-400 bg-green-400",
  };

  const statusTextColors: Record<Status, string> = {
    "pending visit": "text-orange-400",
    "visit requested by rep": "text-red-400",
    "dropped off": "text-green-400",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        autoFocus={false}
        className="focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <DialogHeader>
          <DialogTitle>Contact</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-3 py-2">
            {loading ? (
              <EditContactSkeleton />
            ) : (
              // <div className="w-full flex justify-center items-center h-[65vh]">
              //   <Spinner size="8" />
              // </div>
              <>
                {Object.entries(form).map(([key, value]) => (
                  <div key={key} className="grid gap-1">
                    <label
                      htmlFor={key}
                      className="text-sm font-medium capitalize text-muted-foreground"
                    >
                      {key}
                    </label>
                    <Input
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleChange}
                    />
                  </div>
                ))}

                <Button onClick={() => console.log("Update logic TBD")}>
                  Update
                </Button>

                <div className="space-y-2 text-center p-4 rounded-lg">
                  <label className="text-sm text-muted-foreground block mb-2">
                    Samples Status
                  </label>
                  <div className="flex justify-center gap-6">
                    {statuses.map((status) => (
                      <label
                        key={status}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="l2_lead_status"
                          value={status}
                          checked={selectedStatus === status}
                          onChange={async () => {
                            if (!contact?.id) return;
                            setSelectedStatus(status);
                            const res = await updateL2LeadStatus(
                              contact.id,
                              status
                            );
                            if (res.success) {
                              toast.success("L2 status updated");
                              await fetchAndSetContact(contact.id);
                              await refetchContacts();
                            } else {
                              toast.error(res.message || "Update failed");
                            }
                          }}
                          className={`appearance-none h-4 w-4 rounded-full border border-gray-300 ring-2 ring-offset-2 ring-offset-transparent checked:border-transparent checked:ring-inset focus:outline-none transition ${
                            selectedStatus === status
                              ? statusColors[status]
                              : "ring-transparent bg-transparent"
                          }`}
                        />
                        <span
                          className={`text-sm capitalize ${
                            selectedStatus === status
                              ? `${statusTextColors[status]}`
                              : ""
                          }`}
                        >
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push(`/dashboard/contacts/${contactId}`);
                  }}
                  className="w-fit m-auto cursor-pointer flex items-center text-sm mt-4 justify-center text-green-400 group transition-all duration-200 ease-in-out"
                >
                  Full Detail
                  <IconArrowRight className="group-hover:ml-2 transition-all duration-200" />
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
