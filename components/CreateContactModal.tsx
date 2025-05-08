"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";
import { useContactContext } from "@/context/ContactContext";
import { states } from "@/lib/states";

export function CreateContactModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setSelectedStatus, setSelectedZip, setQuery } = useContactContext();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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
      setOpen(false);
      router.push(`/dashboard/contacts/${res.contactId}`);
    } else {
      toast.error(res.message || "Failed to create contact");
    }
  };

  // Phone formatting handler
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length > 6)
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
    else if (value.length > 3) value = `${value.slice(0, 3)}-${value.slice(3)}`;
    setValue("phone", value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg sm:max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Contact</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Common fields */}
          {[
            "firstname",
            "lastname",
            "jobtitle",
            "email",
            "company",
            "address",
            "city",
            "zip",
          ].map((field) => (
            <div key={field}>
              <Label htmlFor={field} className="mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={field}
                type="text"
                {...register(field as keyof CreateContactFormValues)}
              />
              {errors[field as keyof CreateContactFormValues] && (
                <p className="text-sm text-red-500">
                  {errors[field as keyof CreateContactFormValues]?.message}
                </p>
              )}
            </div>
          ))}

          {/* State Dropdown */}
          <div>
            <Label className="mb-2" htmlFor="state">
              State
            </Label>
            <select
              id="state"
              {...register("state")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-black"
            >
              <option value="">Select State</option>
              {states.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label className="mb-2" htmlFor="phone">
              Phone
            </Label>
            <Input
              id="phone"
              value={watch("phone")}
              onChange={handlePhoneChange}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

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
      </DialogContent>
    </Dialog>
  );
}

// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { createNewContact } from "@/app/actions/createNewContact";
// import {
//   ContactSchemaValues,
//   CreateContactFormValues,
//   CreateContactSchema,
// } from "@/lib/schemas";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { toast } from "react-hot-toast";
// import { useState } from "react";
// import Spinner from "./Spinner";
// import { useRouter } from "next/navigation"; // ✅ import router
// import { useContactContext } from "@/context/ContactContext";

// type Props = {
//   open: boolean;
//   setOpen: (val: boolean) => void;
// };

// export function CreateContactModal({ open, setOpen }: Props) {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter(); // ✅ initialize router
//   const { setSelectedStatus, setSelectedZip, setQuery } = useContactContext();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<CreateContactFormValues>({
//     resolver: zodResolver(CreateContactSchema),
//     defaultValues: {
//       firstname: "",
//       lastname: "",
//       jobtitle: "",
//       email: "",
//       company: "",
//       phone: "",
//       address: "",
//       city: "",
//       state: "",
//       zip: "",
//     },
//   });

//   const onSubmit = async (values: CreateContactFormValues) => {
//     setLoading(true);
//     const res = await createNewContact(values);
//     setLoading(false);

//     if (res.success && res.contactId) {
//       toast.success("Contact created successfully");

//       // ✅ Clear filter state
//       setSelectedZip(null);
//       setSelectedStatus("all");
//       setQuery("");

//       reset();
//       setOpen(false);

//       // ✅ Redirect to detail page
//       router.push(`/dashboard/contacts/${res.contactId}`);
//     } else {
//       toast.error(res.message || "Failed to create contact");
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="max-w-lg sm:max-w-lg w-full max-h-[85vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Create New Contact</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
//           {[
//             { label: "First Name", name: "firstname" },
//             { label: "Last Name", name: "lastname" },
//             { label: "Job Title", name: "jobtitle" },
//             { label: "Email", name: "email", type: "email" },
//             { label: "Company", name: "company" },
//             { label: "Phone", name: "phone" },
//             { label: "Address", name: "address" },
//             { label: "City", name: "city" },
//             { label: "State", name: "state" },
//             { label: "ZIP Code", name: "zip" },
//           ].map((field) => (
//             <div key={field.name}>
//               <Label htmlFor={field.name} className="mb-2">
//                 {field.label}
//               </Label>
//               <Input
//                 id={field.name}
//                 type={field.type || "text"}
//                 {...register(field.name as keyof CreateContactFormValues)}
//               />
//               {errors[field.name as keyof CreateContactFormValues] && (
//                 <p className="text-sm text-red-500 mt-1">
//                   {errors[field.name as keyof CreateContactFormValues]?.message}
//                 </p>
//               )}
//             </div>
//           ))}

//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading ? (
//               <>
//                 <Spinner size="4" /> Saving
//               </>
//             ) : (
//               "Create Contact"
//             )}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
