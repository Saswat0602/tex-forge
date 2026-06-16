import { RegisterForm } from "@/components/auth/register-form";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 py-12 bg-muted/40">
      <RegisterForm />
    </div>
  );
}
