// src/app/auth/signin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import { Lock } from "lucide-react";
import { UserLoginSchema, UserLoginValues } from "@/lib/schemas";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

const AdminLoginForm: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginValues>({
    resolver: zodResolver(UserLoginSchema),
  });

  useEffect(() => {
    if (blocked && retryAfter > 0) {
      const interval = setInterval(() => {
        setRetryAfter((prev) => {
          if (prev <= 1) {
            setBlocked(false); // ✅ Auto-unblock when timer hits 0
            setError(null); // ✅ Clear error message
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [blocked, retryAfter]);

  const onSubmit = async (data: UserLoginValues) => {
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      const errorMessage = result.error;

      if (errorMessage.includes("Too many login attempts")) {
        const match = errorMessage.match(/\d+/); // Extract retry time in seconds
        const retryTime = match ? parseInt(match[0], 10) : 60;
        setBlocked(true);
        setRetryAfter(retryTime);
      }

      setError(result.error);
    } else {
      toast.success("Welcome!");
      router.push("/dashboard"); // Redirect on successful sign-in
    }
  };

  return (
    <div className="items-center justify-center text-white">
      <div className="w-full max-w-md p-6 space-y-6 mx-auto rounded-xl border border-white/10 shadow-xl bg-white/10 backdrop-blur-md">
        <h3 className="text-2xl font-semibold w-full text-center uppercase">
          Login
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            {/* <label className="block font-medium text-white">Email</label> */}
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 mt-1 border border-gray-700 bg-black/30 text-white rounded-md backdrop-blur-sm"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            {/* <label className="block font-medium text-white">Password</label> */}
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 mt-1 border border-gray-700 bg-black/30 text-white rounded-md backdrop-blur-sm"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>

          {blocked && retryAfter > 0 && (
            <p className="text-red-400 text-center text-sm">
              Too many login attempts. Try again in {retryAfter} seconds.
            </p>
          )}

          {!blocked && error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <SubmitButton
            isSubmitting={isSubmitting || blocked}
            disabled={blocked}
            type="Log in"
          />
        </form>

        <Image
          src="/images/ba-logo-alt.png"
          alt="Ba App"
          height={50}
          width={100}
          className="m-auto invert-20"
        />
      </div>
    </div>
  );
};

export default AdminLoginForm;
