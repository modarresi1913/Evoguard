import Link from "next/link";
import { ShieldCheck, ArrowLeft, Github } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono">EvoGuard · 404</span>
          </div>

          <h1 className="mt-8 font-mono text-7xl sm:text-8xl font-semibold text-primary tabular-nums">
            404
          </h1>

          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            <span className="text-muted-foreground">Context</span> not found.
          </h2>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist — or has been
            rolled back. Like every change in a well-guarded codebase, missing
            context is best handled with evidence, not guesswork.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-5 py-2.5 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to EvoGuard</span>
            </Link>
            <a
              href="https://github.com/modarresi1913/Evoguard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-border bg-card/50 backdrop-blur hover:bg-card text-foreground rounded-md px-5 py-2.5 text-sm font-medium transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>View on GitHub</span>
            </a>
          </div>

          <div className="mt-12 pt-6 border-t border-border text-[11px] text-muted-foreground font-mono">
            <p>
              Looking for evidence?{" "}
              <a href="/" className="text-primary hover:underline">
                ← Back to dashboard
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer className="relative border-t border-border py-4 text-center text-[11px] text-muted-foreground font-mono">
        EvoGuard — Context before merge.
      </footer>
    </div>
  );
}
