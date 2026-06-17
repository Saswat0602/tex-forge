"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, LayoutDashboard, User, Settings, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 hover:bg-muted p-1.5 rounded-md transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold border">
            {session.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-card border rounded-md shadow-lg py-1 z-50 overflow-hidden">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium line-clamp-1">{session.user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{session.user?.email}</p>
            </div>
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 text-sm transition-colors"
            >
              <User className="w-4 h-4" /> Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 text-sm transition-colors"
            >
              <Settings className="w-4 h-4" /> Settings
            </Link>
            <div className="h-px bg-border my-1" />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-4 py-2 hover:bg-destructive hover:text-destructive-foreground flex items-center gap-2 text-sm text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
