"use server";

import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function generateBaId() {
  const ba_id = `ba-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  try {
    const record = await prisma.brandAmbassadorId.create({
      data: { ba_id },
    });

    return {
      success: true,
      ba_id: record.ba_id,
      used: record.used,
      createdAt: record.createdAt,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
