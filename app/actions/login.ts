// app/actions/auth/login.ts
"use server";

import { loginSchema, LoginFormData } from "@/lib/validators/authSchema";

export async function loginAction(data: LoginFormData) {
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Invalid login data");
  }

  // ✅ Optional: you can still return success to show a loading state
  return { success: true };
}
