"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePassword } from "@/app/actions/updatePassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/Spinner";
import { toast } from "react-hot-toast";

// 1. Schema with Zod ✅
const PasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

type PasswordFormValues = z.infer<typeof PasswordSchema>;

export default function AccountPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      const result = await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (result.success) {
        toast.success("Password updated successfully");
        reset(); // Clear form
      } else {
        toast.error(result.message || "Failed to update password");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <main className="w-full max-w-[400px] mx-auto py-10 px-4 space-y-8">
      <h1 className="text-2xl font-bold">Account Settings</h1>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Email</h3>
          <p className="text-zinc-500">{user?.email || ""}</p>
        </div>
        <div>
          <h3 className="font-semibold">Name</h3>
          <p className="capitalize text-zinc-500">{user?.name || ""}</p>
        </div>
      </div>

      <div className="pt-8 border-t border-white/10 space-y-4">
        <h2 className="text-xl font-semibold">Change Password</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-2">Current Password</Label>
            <Input
              type="password"
              {...register("currentPassword")}
              placeholder="Enter current password"
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-400 mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-2">New Password</Label>
            <Input
              type="password"
              {...register("newPassword")}
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-400 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner size="4" />
                Updating
              </div>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
