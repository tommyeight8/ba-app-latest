"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconUserFilled } from "@tabler/icons-react";
import SubmitButton from "./SubmitButton";
import { LoginFormData, loginSchema } from "@/lib/validators/authSchema";
import Image from "next/image";

export default function LoginForm({
  onSubmit,
}: {
  onSubmit: (data: LoginFormData) => Promise<void>;
}) {
  const [form, setForm] = useState<LoginFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const year = new Date().getFullYear();
  const copyright = `© ${year} VPR`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setError("");
    setLoading(true);

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0])
          fieldErrors[err.path[0] as keyof LoginFormData] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black flex-col">
      <h3 className="text-white text-2xl font-bold mb-8 flex items-center gap-1">
        <IconUserFilled />
        <span>BA Login</span>
      </h3>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 text-white"
      >
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
        {error && <p className="text-sm text-red-500">{error}</p>}
        <SubmitButton loading={loading}>Login</SubmitButton>
      </form>
      {/* Update logo */}

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
