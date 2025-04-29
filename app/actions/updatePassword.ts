// app/actions/updatePassword.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // adjust the path if needed
import { compare, hash } from "bcryptjs";

export async function updatePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, message: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const isMatch = await compare(currentPassword, user.password);

  if (!isMatch) {
    return { success: false, message: "Current password is incorrect" };
  }

  const hashedNewPassword = await hash(newPassword, 10);

  await prisma.user.update({
    where: { email: session.user.email },
    data: { password: hashedNewPassword },
  });

  return { success: true };
}
