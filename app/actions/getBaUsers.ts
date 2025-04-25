"use server";

import { prisma } from "@/lib/prisma";

export async function getBaUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "user",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return {
      success: true,
      data: users.map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        role: u.role,
      })),
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
