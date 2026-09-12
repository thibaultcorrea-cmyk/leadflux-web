"use server";

import { CreateInitialAdminDto } from "@/features/users/dto/schema";
import { UserServices } from "@/features/users/services";

export type CreateInitialAdminResult =
  | { success: true }
  | { success: false; error: string };

export async function createInitialAdminAction(
  data: CreateInitialAdminDto,
): Promise<CreateInitialAdminResult> {
  try {
    await UserServices.createInitialAdmin(data);
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Impossible de créer le compte administrateur.";
    return { success: false, error: message };
  }
}
