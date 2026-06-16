import { getProjects } from "@/actions/project.actions";
import { ProjectCard } from "@/components/dashboard/project-card";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const response = await getProjects();

  const projects = response.ok && response.data ? response.data : [];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your LaTeX documents and projects.
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 mt-8 border-2 border-dashed rounded-lg bg-muted/20 text-center">
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-muted-foreground max-w-sm mb-6">
            You don&apos;t have any LaTeX documents. Create your first project to get started.
          </p>
          <CreateProjectDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(projects as Array<{ id: string, title: string, updatedAt: Date, createdAt: Date }>).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
