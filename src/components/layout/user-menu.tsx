"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, LayoutDashboard } from "lucide-react";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />;
  }

  if (!session) {
    return (
      <>
        <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
          Login
        </Link>
        <Link
          href="/register"
          className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Sign Up
        </Link>
      </>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      <div className="h-4 w-px bg-border hidden sm:block"></div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold border">
          {session.user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm font-medium text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
