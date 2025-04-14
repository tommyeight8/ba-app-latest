// app/actions/auth/signup.ts
"use server";

import { signupSchema, SignupFormData } from "@/lib/validators/authSchema";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function signupAction(data: SignupFormData) {
  const parsed = signupSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  const { email, password, firstName, lastName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashed = await hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      firstName,
      lastName,
      role: "user",
    },
  });
}
