"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconUserPlus } from "@tabler/icons-react";
import SubmitButton from "./SubmitButton";

import { signupSchema, SignupFormData } from "@/lib/validators/authSchema";
import Image from "next/image";

export default function SignUpForm({
  onSubmit,
}: {
  onSubmit: (data: SignupFormData) => Promise<void>;
}) {
  const [form, setForm] = useState<SignupFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const year = new Date().getFullYear();
  const copyright = `© ${year} VPR`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setLoading(true);

    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0])
          fieldErrors[err.path[0] as keyof SignupFormData] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      await onSubmit(form);
    } catch (err: any) {
      setGeneralError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black flex-col">
      <h3 className="text-white text-2xl font-bold mb-8 flex items-center gap-1">
        <IconUserPlus />
        <span>BA Sign Up</span>
      </h3>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto space-y-6 text-white"
      >
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            id="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="mt-2"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            id="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="mt-2"
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            className="mt-2"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            className="mt-2"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        {generalError && <p className="text-sm text-red-500">{generalError}</p>}
        {/* <Button
          type="submit"
          className="w-full bg-gray-100 text-black hover:bg-gray-300"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button> */}
        <SubmitButton loading={loading}>Signup</SubmitButton>
      </form>
      {/* <p className="text-sm text-gray-300 mt-4">{copyright}</p> */}
      <Image
        src="/images/ba-logo-alt.png"
        alt="ba logo"
        height={50}
        width={90}
        className="mt-6 invert-20"
      />
    </div>
  );
}
