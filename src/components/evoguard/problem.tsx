"use client";

import { AlertTriangle, History, PackageX, MessageSquareOff, ShieldAlert } from "lucide-react";

const PRESSURES = [
  {
    icon: History,
    title: "Past rollbacks & reverts",
    detail:
      "Patterns that triggered a rollback last quarter are structurally invisible to a fresh PR review — unless the codebase remembers them.",
  },
  {
    icon: PackageX,
    title: "Deprecated dependencies",
    detail:
      "A pinned version that was silently deprecated two weeks ago will still pass type-check, lint and CI. It will still break in production.",
  },
  {
    icon: MessageSquareOff,
    title: "Unspoken conventions",
    detail:
      "“Never call fetch() directly, use httpClient.” That decision lives in a Slack thread from 2024 — not in any file the AI can read.",
  },
  {
    icon: ShieldAlert,
    title: "Security & compliance drift",
    detail:
      "PII in a log payload, a missing redaction gate, a bypassed security check. None of these are syntax errors. All of them are merge-time failures.",
  },
];

export function EvoguardProblem() {
  return (
    <section id="problem" className="relative py-24 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            <span className="font-mono">the problem</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Code generation is no longer the bottleneck.{" "}
            <span className="text-muted-foreground">
              Integration into a living codebase is.
            </span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            An AI-assisted PR can pass syntax checks, satisfy types, clear CI and
            still ship a regression. The decisive context is rarely in the diff — it
            lives in the codebase&apos;s pressure history. Until that history is
            part of the review, every PR is a leap.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESSURES.map((p) => (
            <div
              key={p.title}
              className="group relative rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 mb-4">
                <p.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {p.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
