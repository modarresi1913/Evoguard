"use client";

import { recentPRs } from "@/lib/evoguard/mock-data";

const recColor: Record<string, string> = {
  "low-friction": "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  review: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30",
  "review-required": "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  block: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30",
};

const recLabel: Record<string, string> = {
  "low-friction": "Low friction",
  review: "Review",
  "review-required": "Review required",
  block: "Block",
};

const provColor: Record<string, string> = {
  declared: "text-emerald-300",
  inferred: "text-amber-300",
  unknown: "text-muted-foreground",
};

export function DashboardSidebar() {
  return (
    <aside className="rounded-xl border border-border bg-card/40 backdrop-blur p-3 lg:sticky lg:top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
      <div className="px-2 py-2">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
          Recent PRs · last 24h
        </div>
        <div className="mt-1 text-xs text-foreground font-medium">
          {recentPRs.length} analyzed
        </div>
      </div>

      <div className="mt-2 space-y-1">
        {recentPRs.map((pr) => (
          <button
            key={pr.id}
            className={`w-full text-left rounded-lg border p-2.5 transition-colors ${
              pr.id === "PR-1284"
                ? "border-primary/40 bg-primary/5"
                : "border-transparent hover:bg-background/40 hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <code className="font-mono text-[11px] text-muted-foreground">
                {pr.id}
              </code>
              <span
                className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                  pr.score >= 85
                    ? "text-emerald-300"
                    : pr.score >= 70
                      ? "text-sky-300"
                      : pr.score >= 50
                        ? "text-amber-300"
                        : "text-rose-300"
                }`}
              >
                {pr.score}
              </span>
            </div>
            <div className="mt-1.5 text-[11px] text-foreground line-clamp-2 leading-snug">
              {pr.title}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-[10px] text-muted-foreground font-mono truncate">
                {pr.repository}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono whitespace-nowrap ${
                  recColor[pr.recommendation]
                }`}
              >
                {recLabel[pr.recommendation]}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="font-mono">@{pr.author}</span>
              <span className="opacity-50">·</span>
              <span className={provColor[pr.provenance]}>
                provenance: {pr.provenance}
              </span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
