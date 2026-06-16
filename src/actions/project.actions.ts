"use server";

import dbConnect from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { CreateProjectInput, CreateProjectSchema } from "@/lib/validators";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

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

type ProjectData = { id: string; title: string; updatedAt: Date; createdAt: Date; };
export async function getProjects(): Promise<ActionResponse<ProjectData[]>> {
  try {
    const userId = await getUserId();
    await dbConnect();

    const projects = await Project.find({ userId }).sort({ updatedAt: -1 }).lean();

    return {
      ok: true,
      data: projects.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        updatedAt: p.updatedAt,
        createdAt: p.createdAt,
      })),
    };
  } catch (error: unknown) {
    console.error("Fetch Projects Error:", error);
    return { ok: false, error: "Failed to fetch projects." };
  }
}

export async function createProject(input: CreateProjectInput): Promise<ActionResponse<{ id: string }>> {
  try {
    const userId = await getUserId();
    const { title } = CreateProjectSchema.parse(input);

    await dbConnect();

    const newProject = await Project.create({
      userId,
      title,
      files: [
        {
          name: "main.tex",
          content: "\\documentclass{article}\n\\begin{document}\n\nHello World!\n\n\\end{document}",
          type: "text",
          isMain: true,
        }
      ],
    });

    revalidatePath("/dashboard");

    return {
      ok: true,
      data: {
        id: newProject._id.toString(),
      },
    };
  } catch (error: unknown) {
    console.error("Create Project Error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return { ok: false, error: "Invalid project title." };
    }
    return { ok: false, error: "Failed to create project." };
  }
}

export async function deleteProject(projectId: string): Promise<ActionResponse<void>> {
  try {
    const userId = await getUserId();
    await dbConnect();

    const project = await Project.findOneAndDelete({ _id: projectId, userId });
    
    if (!project) {
      return { ok: false, error: "Project not found or unauthorized." };
    }

    revalidatePath("/dashboard");

    return { ok: true };
  } catch (error: unknown) {
    console.error("Delete Project Error:", error);
    return { ok: false, error: "Failed to delete project." };
  }
}

export async function duplicateProject(projectId: string): Promise<ActionResponse<{ id: string }>> {
  try {
    const userId = await getUserId();
    await dbConnect();

    const existingProject = await Project.findOne({ _id: projectId, userId });
    
    if (!existingProject) {
      return { ok: false, error: "Project not found or unauthorized." };
    }

    const newProject = await Project.create({
      userId,
      title: `${existingProject.title} (Copy)`,
      files: existingProject.files.map(f => ({
        name: f.name,
        content: f.content,
        type: f.type,
        url: f.url,
        isMain: f.isMain,
      })),
    });

    revalidatePath("/dashboard");

    return {
      ok: true,
      data: {
        id: newProject._id.toString(),
      },
    };
  } catch (error: unknown) {
    console.error("Duplicate Project Error:", error);
    return { ok: false, error: "Failed to duplicate project." };
  }
}
