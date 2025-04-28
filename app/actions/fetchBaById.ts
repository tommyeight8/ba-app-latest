// "use server";

// import { prisma } from "@/lib/prisma";

// export async function fetchBaById(ba_id: string) {
//   if (!ba_id || ba_id.trim() === "") {
//     return { error: "Missing or invalid BA ID" };
//   }

//   try {
//     const user = await prisma.user.findFirst({
//       where: {
//         ba_id: ba_id.trim(),
//       },
//       select: {
//         email: true,
//         firstName: true,
//         lastName: true,
//         role: true,
//         state: true,
//         ba_id: true,
//         createdAt: true,
//       },
//     });

//     if (!user) return { user: null };
//     return { user };
//   } catch (error) {
//     console.error("Error fetching user by BA ID:", error);
//     return { error: "Internal server error" };
//   }
// }
