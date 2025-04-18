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
import { Loader2 } from "lucide-react"; // 🌀 Import spinner icon
import { HubSpotContact } from "@/types/hubspot";

import { useSearchContext } from "@/contexts/SearchContext";

export function EditContactModal() {
  const { contact, open, setOpen, setContact } = useContactEdit();
  const { setContacts, contacts } = useSearchContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    StoreName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    if (contact) {
      setForm({
        StoreName: contact.properties.company || "",
        email: contact.properties.email || "",
        phone: contact.properties.phone || "",
        address: contact.properties.address || "",
        city: contact.properties.city || "",
        state: contact.properties.state || "",
        zip: contact.properties.zip || "",
      });
    }
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    console.log("Updated contact:", form);
    setOpen(false);
  };

  const handleSetLeadStatus = async () => {
    if (!contact?.id) return;
    setIsSubmitting(true);
    const res = await setLeadStatusToSamples(contact.id);
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Lead status set to 'samples'");

      // ✅ Update modal
      setContact({
        ...contact,
        properties: {
          ...contact.properties,
          hs_lead_status: "Samples",
          l2_lead_status: "pending visit",
        },
      });

      // ✅ Update contact in list
      setContacts((prev: HubSpotContact[]) =>
        prev.map((c) =>
          c.id === contact.id
            ? {
                ...c,
                properties: {
                  ...c.properties,
                  hs_lead_status: "Samples",
                  l2_lead_status: "pending visit",
                },
              }
            : c
        )
      );

      setOpen(false);
    } else {
      toast.error(res.message || "Failed to update lead status.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
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

          <Button onClick={handleSubmit}>Update</Button>
          {contact?.properties.hs_lead_status === "Samples" ? (
            <div className="text-center p-2 bg-muted rounded-lg text-[#999] capitalize">
              {contact?.properties.l2_lead_status}
            </div>
          ) : (
            <Button
              variant="secondary"
              onClick={handleSetLeadStatus}
              disabled={isSubmitting}
              className="hover:bg-green-300 hover:text-white transition duration-200 ease"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Set Lead Status to Samples
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
