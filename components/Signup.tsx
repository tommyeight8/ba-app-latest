"use client";

import React, { useRef, useState } from "react";
import { registerUser } from "@/app/actions/registerUser";
import SubmitButton from "./SubmitButton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSignupSchema } from "@/lib/schemas"; // assume you extend this
import { usStates } from "@/lib/states";
import Image from "next/image";

const SignupSchema = UserSignupSchema.extend({
  secretKey: z.string().min(1, "Secret key is required"),
});

type SignupValues = z.infer<typeof SignupSchema>;

const AdminRegisterForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting },
    reset,
  } = useForm<SignupValues>({
    resolver: zodResolver(SignupSchema),
  });

  const clientAction = async (data: SignupValues) => {
    setIsSubmitting(true);

    try {
      const response = await registerUser(data);

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      const signInResponse = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

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
      reset();
    }
  };

  return (
    <div className="w-full max-w-md p-6 space-y-6 rounded-xl mx-auto border border-white/10 shadow-xl bg-white/10 backdrop-blur-md">
      <h1 className="text-2xl font-bold text-center uppercase text-white">
        Signup
      </h1>

      <form onSubmit={handleSubmit(clientAction)} className="space-y-6">
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
          {/* <label className="block font-medium text-white">First Name</label> */}
          <input
            type="text"
            {...register("firstName")}
            className="w-full px-4 py-2 mt-1 border border-gray-700 bg-black/30 text-white rounded-md backdrop-blur-sm"
            placeholder="First name"
          />
          {errors.firstName && (
            <p className="text-red-400">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          {/* <label className="block font-medium text-white">Last Name</label> */}
          <input
            type="text"
            {...register("lastName")}
            className="w-full px-4 py-2 mt-1 border border-gray-700 bg-black/30 text-white rounded-md backdrop-blur-sm"
            placeholder="Last name"
          />
          {errors.lastName && (
            <p className="text-red-400">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          {/* <label className="block font-medium text-white">State</label> */}
          <select
            {...register("state")}
            className="w-full px-4 py-2 mt-1 border border-gray-700 bg-black/30 text-white rounded-md backdrop-blur-sm"
          >
            <option value="">Select a state</option>
            {usStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-400">{errors.state.message}</p>
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

        <div>
          {/* <label className="block font-medium text-white">BA Key</label> */}
          <input
            type="text"
            {...register("secretKey")}
            className="w-full px-4 py-2 mt-1 border border-gray-700 bg-black/30 text-white rounded-md backdrop-blur-sm"
            placeholder="BA Key"
          />
          {errors.secretKey && (
            <p className="text-red-400">{errors.secretKey.message}</p>
          )}
        </div>

        <SubmitButton
          isSubmitting={isSubmitting || formSubmitting}
          type="Sign up"
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
  );
};

export default AdminRegisterForm;
