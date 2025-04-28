// "use server";

// import { prisma } from "@/lib/prisma";

// export async function getAvailableBaIds() {
//   try {
//     const available = await prisma.brandAmbassadorId.findMany({
//       where: { used: true },
//       select: { ba_id: true },
//     });

//     const ids = available.map((b) => b.ba_id);

//     return { success: true, data: ids };
//   } catch (error) {
//     console.error("Failed to fetch BA IDs", error);
//     return { success: false, error: "Failed to fetch BA IDs" };
//   }
// }
