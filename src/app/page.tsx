import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-7rem)] bg-background">
      <div className="text-center space-y-6 max-w-3xl px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Forge Your LaTeX Documents with <span className="text-primary">Precision</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          TexForge is a modern, collaborative platform for creating, editing, and managing LaTeX projects seamlessly from your browser.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-11 px-8 py-2 font-medium transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
