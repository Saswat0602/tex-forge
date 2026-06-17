"use server";

import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "./project.actions";

export async function updateProfile(name: string): Promise<ActionResponse<void>> {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return { ok: false, error: "Unauthorized" };
    }

    if (!name || name.trim().length === 0) {
      return { ok: false, error: "Name cannot be empty" };
    }

    await dbConnect();
    await User.findByIdAndUpdate(userId, { name: name.trim() });
    
    revalidatePath("/profile");
    revalidatePath("/settings");

    return { ok: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { ok: false, error: "Failed to update profile" };
  }
}

export async function deleteAccount(): Promise<ActionResponse<void>> {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return { ok: false, error: "Unauthorized" };
    }

    await dbConnect();
    // Also delete user's projects here ideally, but for MVP we just delete the user
    await User.findByIdAndDelete(userId);

    return { ok: true };
  } catch (error) {
    console.error("Delete account error:", error);
    return { ok: false, error: "Failed to delete account" };
  }
}
