"use server";

import { UserSignupValues, UserSignupSchema } from "@/lib/schemas";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getErrorMessage } from "@/lib/getErrorMessage";

export const registerUser = async (newUser: UserSignupValues) => {
  try {
    const validateInput = UserSignupSchema.safeParse(newUser);
    if (!validateInput.success) {
      const errorMessage = validateInput.error.issues
        .map((issue) => `${issue.path[0]}: ${issue.message}`)
        .join(". ");
      return { error: errorMessage };
    }

    const { email, password, firstName, lastName, role } = validateInput.data;

    const existingStaff = await prisma.user.findUnique({ where: { email } });
    if (existingStaff)
      return { error: "A user with this email already exists." };

    const hashedPassword = await bcrypt.hash(password, 10); // ✅ now hashes the passed-in password

    const newUserEntry = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role,
        createdAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Unexpected error during registerStaff:", errorMessage);
    return { error: errorMessage };
  }
};
