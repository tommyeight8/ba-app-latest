// // app/actions/getAllBaIds.ts
// "use server";

// import { prisma } from "@/lib/prisma";

// export async function getAllBAIds() {
//   try {
//     const ids = await prisma.brandAmbassadorId.findMany({
//       orderBy: { createdAt: "desc" },
//       select: {
//         ba_id: true,
//         used: true,
//         createdAt: true,
//       },
//     });

//     return { success: true, data: ids };
//   } catch (error) {
//     console.error("❌ Failed to fetch BA IDs:", error);
//     return { success: false, error: "Failed to fetch BA IDs" };
//   }
// }
