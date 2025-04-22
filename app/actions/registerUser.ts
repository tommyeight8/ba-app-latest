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

    const { email, password, firstName, lastName, state, ba_id } =
      validateInput.data;

    if (!ba_id) return { error: "BA ID is required." };

    const cleanedBaId = ba_id.trim();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return { error: "A user with this email already exists." };

    const matchingBA = await prisma.brandAmbassadorId.findUnique({
      where: { ba_id: cleanedBaId },
    });

    if (!matchingBA) return { error: "Invalid BA ID." };
    if (matchingBA.used) return { error: "This BA ID has already been used." };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        state,
        ba_id: cleanedBaId, // This is all that's needed to create the relation
      },
    });

    await prisma.brandAmbassadorId.update({
      where: { id: matchingBA.id },
      data: { used: true },
    });

    return { success: true };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Unexpected error during registerUser:", errorMessage);
    return { error: errorMessage };
  }
};
