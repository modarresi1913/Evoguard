"use client";

import { historicalPatterns } from "@/lib/evoguard/mock-data";
import { History, AlertCircle, GitPullRequestArrow } from "lucide-react";

const outcomeColor: Record<string, string> = {
  rollback: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20",
  incident: "bg-fuchsia-500/10 text-fuchsia-300 ring-1 ring-fuchsia-500/20",
  hotfix: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
  reverted: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20",
  merged: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20",
};

const severityColor: Record<string, string> = {
  low: "text-sky-300",
  medium: "text-amber-300",
  high: "text-rose-300",
  critical: "text-fuchsia-300",
};

export function DashboardHistoricalPatterns() {
  const totalPatterns = historicalPatterns.length;
  const rollbackCount = historicalPatterns.filter(
    (p) => p.outcome === "rollback" || p.outcome === "reverted",
  ).length;
  const totalOccurrences = historicalPatterns.reduce(
    (s, p) => s + p.occurrences,
    0,
  );

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Codebase Memory · Historical Patterns
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Patterns observed in this repository that previously triggered
          rollbacks, incidents or hotfixes. Each pattern is recorded as an
          observation — never as a fact — and decays unless reinforced.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Stat label="patterns" value={totalPatterns} accent="default" />
        <Stat label="rollbacks" value={rollbackCount} accent="danger" />
        <Stat label="total triggers" value={totalOccurrences} accent="warning" />
      </div>

      {/* Observation vs Inference vs Policy callout */}
      <div className="rounded-lg border border-border bg-background/40 p-3 mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="text-amber-300 font-medium">Observation</span>:
            pattern occurred N times with outcome X.{" "}
            <span className="text-sky-300 font-medium">Inference</span>:
            pattern is therefore likely risky in this codebase.{" "}
            <span className="text-emerald-300 font-medium">Policy</span>:
            pattern requires owner approval. The three are kept separate;
            EvoGuard never presents an inference as a fact.
          </p>
        </div>
      </div>

      {/* Pattern list */}
      <div className="space-y-2">
        {historicalPatterns.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-border bg-card/40 p-3 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <History className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">
                    {p.pattern}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-muted-foreground">
                  <span>
                    occurred{" "}
                    <span className={severityColor[p.severity]}>
                      {p.occurrences}×
                    </span>
                  </span>
                  <span className="opacity-30">·</span>
                  <span>last seen {p.lastSeen}</span>
                  <span className="opacity-30">·</span>
                  <a className="inline-flex items-center gap-1 text-primary hover:underline" href="#">
                    <GitPullRequestArrow className="h-3 w-3" />
                    {p.relatedPR}
                  </a>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.affectedFiles.map((f) => (
                    <code
                      key={f}
                      className="font-mono text-[10px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded"
                    >
                      {f}
                    </code>
                  ))}
                </div>
              </div>
              <span
                className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                  outcomeColor[p.outcome]
                }`}
              >
                {p.outcome}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "default" | "danger" | "warning";
}) {
  const colors = {
    default: "text-foreground",
    danger: "text-rose-300",
    warning: "text-amber-300",
  };
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className={`font-mono text-2xl font-semibold tabular-nums ${colors[accent]}`}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mt-1">
        {label}
      </div>
    </div>
  );
}
