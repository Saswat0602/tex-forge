import { Workspace } from "@/components/editor/workspace";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Project, IFile } from "@/models/Project";
import { redirect } from "next/navigation";

export default async function EditorPage({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = await params;
  
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id: string }).id;

  await dbConnect();
  const project = await Project.findOne({ _id: resolvedParams.projectId, userId }).lean();

  if (!project) {
    redirect("/dashboard");
  }

  // Format the DB object into the clean shape expected by our Zustand store
  const formattedFiles = project.files.map((file: IFile) => ({
    name: file.name,
    content: file.content || "",
    type: file.type || "text",
    url: file.url,
    isMain: file.isMain || false,
  }));

  return (
    <Workspace 
      projectId={project._id.toString()} 
      initialTitle={project.title} 
      initialFiles={formattedFiles} 
    />
  );
}
