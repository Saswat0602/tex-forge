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
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground mt-1">
          View your account details and statistics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            {user.image ? (
              <Image 
                src={user.image} 
                alt={user.name || "User Avatar"} 
                width={80} 
                height={80} 
                className="rounded-full bg-muted"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-10 h-10" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{user.name || "Anonymous User"}</h2>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                <Mail className="w-4 h-4" />
                <span>{user.email || "No email provided"}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Account Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Provider</p>
                <p className="font-medium capitalize">
                  {/* NextAuth doesn't expose provider in standard session user object without custom callbacks,
                      so we'll just display "OAuth" for now, as both Google and GitHub are OAuth. */}
                  OAuth
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md bg-muted/20 flex flex-col items-center justify-center text-center">
              <FileText className="w-8 h-8 text-primary mb-2" />
              <span className="text-2xl font-bold">{projects.length}</span>
              <span className="text-sm text-muted-foreground">Total Projects</span>
            </div>
            
            <div className="p-4 border rounded-md bg-muted/20 flex flex-col items-center justify-center text-center">
              <Calendar className="w-8 h-8 text-primary mb-2" />
              <span className="text-lg font-bold">
                {projects.length > 0 
                  ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(projects[0].updatedAt))
                  : "N/A"
                }
              </span>
              <span className="text-sm text-muted-foreground">Last Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
