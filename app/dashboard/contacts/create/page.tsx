"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createNewContact } from "@/app/actions/createNewContact";
import {
  ContactSchemaValues,
  CreateContactFormValues,
  CreateContactSchema,
} from "@/lib/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { useContactContext } from "@/context/ContactContext";

export default function CreateContactForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setSelectedStatus, setSelectedZip, setQuery } = useContactContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateContactFormValues>({
    resolver: zodResolver(CreateContactSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      jobtitle: "",
      email: "",
      company: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  const onSubmit = async (values: CreateContactFormValues) => {
    setLoading(true);
    const res = await createNewContact(values);
    setLoading(false);

    if (res.success && res.contactId) {
      toast.success("Contact created successfully");

      setSelectedZip(null);
      setSelectedStatus("all");
      setQuery("");

      reset();
      router.push(`/dashboard/contacts/${res.contactId}`);
    } else {
      toast.error(res.message || "Failed to create contact");
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto p-6">
      <h2 className="text-lg font-semibold mb-4">Create New Contact</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {[
          { label: "First Name", name: "firstname" },
          { label: "Last Name", name: "lastname" },
          { label: "Job Title", name: "jobtitle" },
          { label: "Email", name: "email", type: "email" },
          { label: "Company", name: "company" },
          { label: "Phone", name: "phone" },
          { label: "Address", name: "address" },
          { label: "City", name: "city" },
          { label: "State", name: "state" },
          { label: "ZIP Code", name: "zip" },
        ].map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name} className="mb-1 block">
              {field.label}
            </Label>
            <Input
              id={field.name}
              type={field.type || "text"}
              {...register(field.name as keyof CreateContactFormValues)}
            />
            {errors[field.name as keyof CreateContactFormValues] && (
              <p className="text-sm text-red-500 mt-1">
                {errors[field.name as keyof CreateContactFormValues]?.message}
              </p>
            )}
          </div>
        ))}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="4" /> Saving
            </>
          ) : (
            "Create Contact"
          )}
        </Button>
      </form>
    </div>
  );
}
