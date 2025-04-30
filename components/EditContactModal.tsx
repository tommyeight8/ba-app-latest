// ✅ This file includes full optimistic contact editing
// for both Dashboard and Contact [id] page

"use client";

import { useEffect, useState } from "react";
import { useContactEdit } from "@/context/ContactEditContext";
import { fetchContactById } from "@/app/actions/fetchContactById";
import { updateContactIfMatch } from "@/app/actions/updateContactByEmailandId";
import { updateL2LeadStatus } from "@/app/actions/updateL2LeadStatus";
import { toast } from "react-hot-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditContactSkeleton } from "./EditContactSkeleton";
import { useRouter } from "next/navigation";
import { HubSpotContact } from "@/types/hubspot";
import { IconArrowRight } from "@tabler/icons-react";
import { useBrand } from "@/context/BrandContext";

type Status = "pending visit" | "visit requested by rep" | "dropped off";

interface Props {
  fetchPage?: (
    pageNum: number,
    status?: string,
    query?: string,
    optimisticUpdater?: (prev: HubSpotContact[]) => HubSpotContact[]
  ) => Promise<void>;
  page?: number;
  showDetails: boolean;
  refetchContact?: () => Promise<void | HubSpotContact | undefined>;
  mutateContact?: (data?: HubSpotContact, shouldRevalidate?: boolean) => void;
}

export function EditContactModal({
  fetchPage,
  page,
  showDetails,
  refetchContact,
  mutateContact,
}: Props) {
  const { contact, open, setOpen, setContact } = useContactEdit();
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { brand } = useBrand();

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

  const fetchAndSetContact = async (id: string) => {
    setLoading(true);
    const updated = await fetchContactById(id, brand);
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

  const handleSubmit = async () => {
    if (!contactId) return;
    setIsSubmitting(true);

    const updatedFields = {
      company: form.StoreName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
    };

    mutateContact?.(
      {
        ...contact!,
        properties: {
          ...contact!.properties,
          ...updatedFields,
        },
      },
      false
    );

    const result = await updateContactIfMatch(contactId, updatedFields, brand);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Contact updated!");

      if (fetchPage) {
        fetchPage(page ?? 1, undefined, undefined, (prev) =>
          prev.map((c) =>
            c.id === contactId
              ? { ...c, properties: { ...c.properties, ...updatedFields } }
              : c
          )
        );
      }

      if (refetchContact) await refetchContact();
      setOpen(false);
    } else {
      toast.error(result.message || "Update failed.");
    }
  };

  const statuses: Status[] = [
    "pending visit",
    "visit requested by rep",
    "dropped off",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        autoFocus={false}
        className="sm:max-w-lg w-full max-h-[85vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Contact</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          {loading ? (
            <EditContactSkeleton />
          ) : (
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

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-2"
              >
                {isSubmitting ? "Saving..." : "Save Contact"}
              </Button>

              <div className="space-y-2 text-center p-4 rounded-lg">
                <label className="text-sm text-muted-foreground block mb-2">
                  Samples Status
                </label>
                <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
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
                          setIsSubmitting(true);

                          mutateContact?.(
                            {
                              ...contact!,
                              properties: {
                                ...contact!.properties,
                                l2_lead_status: status,
                              },
                            },
                            false
                          );

                          const res = await updateL2LeadStatus(
                            contact.id,
                            status,
                            brand
                          );
                          setIsSubmitting(false);

                          if (res.success) {
                            toast.success("L2 status updated");

                            if (fetchPage) {
                              fetchPage(
                                page ?? 1,
                                undefined,
                                undefined,
                                (prev) =>
                                  prev.map((c) =>
                                    c.id === contact.id
                                      ? {
                                          ...c,
                                          properties: {
                                            ...c.properties,
                                            l2_lead_status: status,
                                          },
                                        }
                                      : c
                                  )
                              );
                            }

                            if (refetchContact) await refetchContact();
                            setOpen(false);
                          } else {
                            toast.error(res.message || "Update failed");
                          }
                        }}
                      />
                      <span className="text-sm capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
              {showDetails && (
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
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
