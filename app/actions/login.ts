// app/actions/auth/login.ts
"use server";

import { loginSchema, LoginFormData } from "@/lib/validators/authSchema";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export async function loginAction(data: LoginFormData) {
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Invalid login data");
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    throw new Error("Incorrect password");
  }

  // ✅ All good — client should now call signIn("credentials")
  return { success: true };
}
