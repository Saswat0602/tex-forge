"use server";

import dbConnect from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type ActionResponse<T = unknown> = {
  ok: boolean;
  error?: string;
  data?: T;
};

// Reusable function to get authenticated user ID
async function getUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as { id?: string } | undefined;
  if (!sessionUser || !sessionUser.id) {
    throw new Error("Unauthorized");
  }
  return sessionUser.id;
}

export type SaveFilesInput = {
  name: string;
  content: string;
  type: "text" | "image" | "pdf";
  url?: string;
  isMain: boolean;
}[];

export async function saveProjectFiles(projectId: string, files: SaveFilesInput): Promise<ActionResponse<void>> {
  try {
    const userId = await getUserId();
    await dbConnect();

    // Verify ownership and update
    const project = await Project.findOneAndUpdate(
      { _id: projectId, userId },
      { $set: { files, updatedAt: new Date() } },
      { new: true }
    );

    if (!project) {
      return { ok: false, error: "Project not found or unauthorized." };
    }

    // We don't revalidatePath("/dashboard") here aggressively because this is called via auto-save frequently.
    // Dashboard can fetch fresh data next time it mounts or via user refresh.

    return { ok: true };
  } catch (error: unknown) {
    console.error("Save Project Error:", error);
    return { ok: false, error: "Failed to save project." };
  }
}
