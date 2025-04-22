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
        ba_id: true, // ✅ include ba_id directly
      },
    });

    return {
      success: true,
      data: users.map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        role: u.role,
        ba_id: u.ba_id,
      })),
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// "use server";

// import { prisma } from "@/lib/prisma";

// export async function getBaUsers() {
//   try {
//     const users = await prisma.user.findMany({
//       where: { role: "user" },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         role: true,
//       },
//     });

//     const formatted = users.map((u) => ({
//       id: u.id,
//       name: `${u.firstName} ${u.lastName}`,
//       role: u.role,
//     }));

//     return { success: true, data: formatted };
//   } catch (error) {
//     console.error("Failed to fetch BA users", error);
//     return { success: false, error: "Failed to fetch users" };
//   }
// }
