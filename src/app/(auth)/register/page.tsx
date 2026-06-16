import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 py-12 bg-muted/40">
      <RegisterForm />
    </div>
  );
}
