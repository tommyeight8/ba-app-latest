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

export function EditContactModal() {
  const { contact, open, setOpen } = useContactEdit();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
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
        firstname: contact.properties.firstname || "",
        lastname: contact.properties.lastname || "",
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
    // TODO: Send to API or mutation logic
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
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
                // placeholder={key}
                onChange={handleChange}
              />
            </div>
          ))}

          <Button onClick={handleSubmit}>Update</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
