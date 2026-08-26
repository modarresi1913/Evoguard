"use client";

import { Button } from "@/components/ui/button";
import { Github, ArrowRight, ShieldCheck, GitPullRequest, Fingerprint } from "lucide-react";
import { heroStats } from "@/lib/evoguard/mock-data";

export function EvoguardHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span className="font-mono">v0.1 · MVP · pilot open</span>
          </div>

          <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground max-w-4xl">
            <span className="block">Context before</span>
            <span className="block bg-gradient-to-r from-primary via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              merge.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Evidence-driven control for AI-assisted code changes. EvoGuard evaluates,
            explains, and gates every AI-touched PR against your codebase&apos;s
            history, contracts, dependencies and conventions — before it reaches
            main.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
            <Button
              size="lg"
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-6"
            >
              <a href="#dashboard" className="flex items-center gap-2">
                <span>Open live dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-11 px-6 bg-card/50 backdrop-blur"
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                <span>Star on GitHub</span>
              </a>
            </Button>
          </div>

          {/* Three pill features */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Evidence-linked review comments
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GitPullRequest className="h-3.5 w-3.5 text-primary" />
              Pull Request is the unit of work
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Fingerprint className="h-3.5 w-3.5 text-primary" />
              Provenance, never claimed as certainty
            </span>
          </div>

          {/* Hero stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="relative rounded-xl border border-border bg-card/50 backdrop-blur p-5 text-left"
              >
                <div className="font-mono text-3xl font-semibold text-primary">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-medium text-foreground">
                  {stat.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
