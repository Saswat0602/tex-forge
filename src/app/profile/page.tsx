import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getProjects } from "@/actions/project.actions";
import { User, Mail, Calendar, FileText } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const response = await getProjects();
  const projects = response.ok && response.data ? response.data : [];
  
  const user = session.user;
  // NextAuth gives us name, email, image.

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Header Background */}
      <div className="relative h-32 md:h-48 rounded-t-xl bg-gradient-to-r from-primary/20 via-primary/5 to-background border-x border-t border-border overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* Main Content Area */}
      <div className="relative bg-card border border-t-0 rounded-b-xl px-6 sm:px-10 pb-10 shadow-sm">
        
        {/* Avatar Section (overlapping the header) */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-16 mb-8">
          <div className="flex items-end gap-5">
            <div className="relative p-1 bg-card rounded-full border shadow-sm">
              {user.image ? (
                <Image 
                  src={user.image} 
                  alt={user.name || "User Avatar"} 
                  width={100} 
                  height={100} 
                  className="rounded-full bg-muted object-cover w-20 h-20 sm:w-28 sm:h-28"
                />
              ) : (
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
              )}
            </div>
            <div className="mb-2 sm:mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{user.name || "Anonymous User"}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Mail className="w-4 h-4" />
                <span>{user.email || "No email provided"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold border-b pb-2 mb-6">Overview</h2>
          <div className="flex flex-wrap gap-8 sm:gap-16">
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Projects</p>
                <p className="text-3xl font-bold">{projects.length}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Last Active</p>
                <p className="text-3xl font-bold">
                  {projects.length > 0 
                    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(projects[0].updatedAt))
                    : "N/A"
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-muted rounded-lg text-muted-foreground">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Account Type</p>
                <p className="text-xl font-semibold mt-1">OAuth Provider</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
