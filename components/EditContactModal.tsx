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
import { Loader2 } from "lucide-react";
import { HubSpotContact } from "@/types/hubspot";

import { updateL2LeadStatus } from "@/app/actions/updateL2LeadStatus";
import { fetchContactById } from "@/app/actions/fetchContactById";
import { useContactList } from "@/context/ContactListContext";

export function EditContactModal() {
  const { contact, open, setOpen, setContact } = useContactEdit();
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [form, setForm] = useState({
    StoreName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refetchContacts } = useContactList();

  const fetchAndSetContact = async (id: string) => {
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
    "pending visit": "ring-orange-500 bg-orange-500",
    "visit requested by rep": "ring-yellow-500 bg-yellow-500",
    "dropped off": "ring-green-500 bg-green-500",
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

          <Button onClick={() => console.log("Update logic TBD")}>
            Update
          </Button>

          {contact?.properties.hs_lead_status === "Samples" ? (
            <div className="space-y-2 text-center p-4 border rounded-lg">
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
                      className={`appearance-none h-4 w-4 rounded-full border border-gray-300 ring-2 ring-offset-2 ring-offset-white checked:border-transparent checked:ring-inset focus:outline-none transition ${
                        selectedStatus === status
                          ? statusColors[status]
                          : "ring-transparent bg-white"
                      }`}
                    />
                    <span className="text-sm capitalize">{status}</span>
                  </label>
                ))}
              </div>
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
