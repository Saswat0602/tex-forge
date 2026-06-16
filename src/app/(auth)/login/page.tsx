import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 py-12 bg-muted/40">
      <LoginForm />
    </div>
  );
}
