import Link from "next/link";
import { FileText } from "lucide-react";
import { ProjectCardActions } from "./project-card-actions";

type ProjectProps = {
  id: string;
  title: string;
  updatedAt: Date;
  createdAt: Date;
};

export function ProjectCard({ project }: { project: ProjectProps }) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(project.updatedAt));

  return (
    <div className="group grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
      <div className="col-span-12 sm:col-span-5 md:col-span-6 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-md text-primary shrink-0 hidden sm:block">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <Link href={`/editor/${project.id}`} className="font-medium text-base hover:underline hover:text-primary truncate block">
            {project.title}
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5 sm:hidden">
            Modified {formattedDate}
          </p>
        </div>
      </div>
      
      <div className="col-span-3 md:col-span-2 hidden sm:flex items-center text-sm text-muted-foreground">
        You
      </div>
      
      <div className="col-span-3 md:col-span-2 hidden sm:flex items-center text-sm text-muted-foreground">
        {formattedDate}
      </div>
      
      <div className="col-span-12 sm:col-span-1 md:col-span-2 flex items-center sm:justify-end mt-2 sm:mt-0">
        <ProjectCardActions projectId={project.id} projectTitle={project.title} />
      </div>
    </div>
  );
}
