"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProjectSchema, CreateProjectInput } from "@/lib/validators";
import { createProject } from "@/actions/project.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X, Loader2 } from "lucide-react";
import { TEMPLATES } from "@/constants/templates";

export function CreateProjectDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      title: "",
      templateId: "blank",
    },
  });

  const onSubmit = async (data: CreateProjectInput) => {
    setIsLoading(true);
    try {
      const res = await createProject(data);
      if (res.ok && res.data) {
        toast.success("Project created!");
        setIsOpen(false);
        reset();
        router.push(`/editor/${res.data.id}`);
      } else {
        toast.error(res.error || "Failed to create project");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        New Project
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-lg border bg-card p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex flex-col space-y-2 text-center sm:text-left mb-6">
              <h2 className="text-xl font-semibold leading-none tracking-tight">Create New Project</h2>
              <p className="text-sm text-muted-foreground">
                Give your LaTeX document a name to get started.
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium leading-none">
                  Project Title
                </label>
                <input
                  {...register("title")}
                  id="title"
                  className="flex h-11 w-full rounded-md border border-input/60 bg-transparent px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                  autoFocus
                  disabled={isLoading}
                  placeholder="e.g. Physics Assignment 1"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="templateId" className="text-sm font-medium leading-none">
                  Template
                </label>
                <select
                  {...register("templateId")}
                  id="templateId"
                  className="flex h-11 w-full rounded-md border border-input/60 bg-transparent px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  disabled={isLoading}
                  style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
                >
                  {TEMPLATES.map((template) => (
                    <option 
                      key={template.id} 
                      value={template.id}
                      className="bg-background text-foreground py-2"
                    >
                      {template.name} - {template.description}
                    </option>
                  ))}
                </select>
                {errors.templateId && (
                  <p className="text-sm text-destructive">{errors.templateId.message}</p>
                )}
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-transparent h-10 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-6 py-2 text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
