"use client";

import React, { useRef, useState } from "react";
import { registerUser } from "@/app/actions/registerUser";
import SubmitButton from "./SubmitButton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { UserSignupSchema } from "@/lib/schemas";
import Image from "next/image";
import { User } from "lucide-react";
import { usStates } from "@/lib/states";

const AdminRegisterForm = () => {
  const ref = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const clientAction = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form from submitting the default way

    setIsSubmitting(true);

    const formData = new FormData(ref.current!);
    const data = Object.fromEntries(formData.entries());

    try {
      const newAdmin = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        state: data.state,
      };

      const validateInput = UserSignupSchema.safeParse(newAdmin);

      if (!validateInput.success) {
        const fieldErrors = validateInput.error.issues.reduce((acc, issue) => {
          acc[issue.path[0]] = issue.message;
          return acc;
        }, {} as { [key: string]: string });

        setErrors(fieldErrors);
        return;
      }

      const response = await registerUser(validateInput.data);

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      const signInResponse = await signIn("credentials", {
        redirect: false,
        email: validateInput.data.email,
        password: validateInput.data.password,
      });

      ref.current?.reset();

      if (signInResponse?.error) {
        toast.error("Sign-in failed. Please try logging in.");
      } else {
        toast.success("Welcome!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 space-y-6 rounded-xl mx-auto border border-white/10 shadow-xl bg-white/10 backdrop-blur-md">
      <h1 className="text-2xl font-bold text-center uppercase flex items-center justify-center gap-2 text-white">
        <User size={24} /> BA Signup
      </h1>
      <form onSubmit={clientAction} className="space-y-4" ref={ref}>
        <div>
          <label className="block font-medium text-white">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 mt-1 border border-gray-700 bg-black/30 text-white rounded-md backdrop-blur-sm"
          />
          {errors.email && <p className="text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label className="block font-medium text-white">First name</label>
          <input
            type="text"
            name="firstName"
            className="w-full px-4 py-2 mt-1 border border-gray-700 bg-black/30 text-white rounded-md backdrop-blur-sm"
          />
          {errors.firstName && (
            <p className="text-red-400">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-white">Last name</label>
          <input
            type="text"
            name="lastName"
            className="w-full px-4 py-2 mt-1 border border-gray-700 bg-black/30 text-white rounded-md backdrop-blur-sm"
          />
          {errors.lastName && <p className="text-red-400">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block font-medium text-white">State</label>
          <select
            name="state"
            className="w-full px-4 py-2 mt-1 border border-gray-700 bg-black/30 text-white rounded-md backdrop-blur-sm"
          >
            <option value="">Select a state</option>
            {usStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          {errors.state && <p className="text-red-400">{errors.state}</p>}
        </div>

        <div>
          <label className="block font-medium text-white">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-2 mt-1 border border-gray-700 bg-black/30 text-white rounded-md backdrop-blur-sm"
          />

          {/* ✅ Hidden role input */}
          <input type="hidden" name="role" value="user" />

          {errors.password && <p className="text-red-400">{errors.password}</p>}
        </div>

        <SubmitButton isSubmitting={isSubmitting} type="Sign up" />
      </form>

      <Image
        src="/images/ba-logo-alt.png"
        alt="Ba App"
        height={50}
        width={100}
        className="m-auto invert-20"
      />
    </div>
  );
};

export default AdminRegisterForm;
