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
    <div className="group flex flex-col justify-between border rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-md transition-all hover:border-primary/50">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <Link href={`/editor/${project.id}`} className="flex items-center gap-3 hover:underline">
            <div className="p-2 bg-primary/10 rounded-md text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{project.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Modified {formattedDate}
              </p>
            </div>
          </Link>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ProjectCardActions projectId={project.id} />
          </div>
        </div>
      </div>
      <div className="px-5 py-3 border-t bg-muted/20 flex justify-end">
        <Link 
          href={`/editor/${project.id}`}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Open Editor &rarr;
        </Link>
      </div>
    </div>
  );
}
