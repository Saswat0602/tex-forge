import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight">TexForge</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
