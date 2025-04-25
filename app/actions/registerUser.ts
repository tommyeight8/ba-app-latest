"use server";

import { UserSignupValues, UserSignupSchema } from "@/lib/schemas";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { syncBaEmailDropdown } from "./syncBaIdToHubSpot";

export const registerUser = async (newUser: UserSignupValues) => {
  try {
    const validateInput = UserSignupSchema.safeParse(newUser);
    if (!validateInput.success) {
      const errorMessage = validateInput.error.issues
        .map((issue) => `${issue.path[0]}: ${issue.message}`)
        .join(". ");
      return { error: errorMessage };
    }

    const { email, password, firstName, lastName, state } = validateInput.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return { error: "A user with this email already exists." };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        state,
      },
    });

    await syncBaEmailDropdown(email);

    return { success: true };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Unexpected error during registerUser:", errorMessage);
    return { error: errorMessage };
  }
};
