"use client";

import { PRSummary } from "@/lib/evoguard/mock-data";
import { TrendingUp, TrendingDown, Minus, GitBranch, Clock, FileCode, GitCommit } from "lucide-react";

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const trendColor = {
  up: "text-emerald-400",
  down: "text-rose-400",
  flat: "text-muted-foreground",
};

const recLabel: Record<string, string> = {
  "low-friction": "Low-friction merge",
  review: "Merge with review",
  "review-required": "Mandatory review or additional tests",
  block: "Block or special approval",
};

const recColor: Record<string, string> = {
  "low-friction": "from-emerald-500/20 to-emerald-500/5 text-emerald-300 ring-emerald-500/30",
  review: "from-sky-500/20 to-sky-500/5 text-sky-300 ring-sky-500/30",
  "review-required": "from-amber-500/20 to-amber-500/5 text-amber-300 ring-amber-500/30",
  block: "from-rose-500/20 to-rose-500/5 text-rose-300 ring-rose-500/30",
};

interface Props {
  pr: PRSummary;
}

export function DashboardRiskOverview({ pr }: Props) {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
            <span className="text-foreground">{pr.id}</span>
            <span className="opacity-50">·</span>
            <span>{pr.repository}</span>
            <span className="opacity-50">·</span>
            <span className="inline-flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              {pr.branch}
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-semibold text-foreground">
            {pr.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <FileCode className="h-3 w-3" />
              {pr.filesChanged} files
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              +{pr.additions}
            </span>
            <span className="inline-flex items-center gap-1 text-rose-400">
              −{pr.deletions}
            </span>
            <span className="inline-flex items-center gap-1">
              <GitCommit className="h-3 w-3" />
              {pr.commits} commits
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              opened {formatRelative(pr.openedAt)}
            </span>
            <span className="font-mono">@{pr.author}</span>
          </div>
        </div>
      </div>

      {/* Score hero */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <div
          className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${
            recColor[pr.recommendation]
          } ring-1 p-5`}
        >
          <div className="text-[10px] uppercase tracking-wider opacity-80 font-mono">
            Ecosystem Compatibility
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-6xl font-semibold tabular-nums">
              {pr.overallScore}
            </span>
            <span className="font-mono text-lg opacity-60">/100</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="font-mono opacity-80">confidence</span>
            <span className="font-mono font-semibold">
              {pr.confidence.toFixed(2)}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-current/20">
            <div className="text-[10px] uppercase tracking-wider opacity-80 font-mono">
              Recommendation
            </div>
            <div className="mt-1 text-sm font-medium">
              {recLabel[pr.recommendation]}
            </div>
          </div>
        </div>

        {/* Top evidence */}
        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-foreground">
              Top evidence
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              {pr.topEvidence.length} items
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {pr.topEvidence.map((ev) => (
              <div
                key={ev.id}
                className="rounded-lg border border-border bg-card/40 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <EvidenceTypeBadge type={ev.type} />
                      <span className="text-xs font-medium text-foreground truncate">
                        {ev.title}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                      {ev.detail}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                      <span className="text-primary">{ev.source}</span>
                      <span className="opacity-50">·</span>
                      <span>{ev.reference}</span>
                    </div>
                  </div>
                  <SeverityPill severity={ev.severity} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dimension breakdown */}
      <div className="mt-4 rounded-xl border border-border bg-background/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-foreground">
            Score breakdown · 9 dimensions
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">
            weighted · confidence-banded
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {pr.dimensions.map((d) => {
            const Trend = trendIcon[d.trend];
            return (
              <div
                key={d.key}
                className="rounded-lg border border-border bg-card/40 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-foreground">
                    {d.label}
                  </span>
                  <span
                    className={`font-mono text-xs tabular-nums ${
                      d.score >= 85
                        ? "text-emerald-300"
                        : d.score >= 70
                          ? "text-sky-300"
                          : d.score >= 50
                            ? "text-amber-300"
                            : "text-rose-300"
                    }`}
                  >
                    {d.score}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      d.score >= 85
                        ? "bg-emerald-400"
                        : d.score >= 70
                          ? "bg-sky-400"
                          : d.score >= 50
                            ? "bg-amber-400"
                            : "bg-rose-400"
                    }`}
                    style={{ width: `${d.score}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                  <span className="inline-flex items-center gap-1">
                    <Trend className={`h-3 w-3 ${trendColor[d.trend]}`} />
                    w={d.weight.toFixed(2)}
                  </span>
                  <span>conf {d.confidence.toFixed(2)}</span>
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground leading-snug">
                  {d.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EvidenceTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    "git-history": "git history",
    "ci-failure": "ci failure",
    incident: "incident",
    dependency: "dependency",
    convention: "convention",
    test: "test",
    policy: "policy",
    ownership: "ownership",
  };
  return (
    <span className="text-[9px] uppercase tracking-wider font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
      {labels[type] ?? type}
    </span>
  );
}

function SeverityPill({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    low: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20",
    medium: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
    high: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20",
    critical: "bg-fuchsia-500/10 text-fuchsia-300 ring-1 ring-fuchsia-500/20",
  };
  return (
    <span
      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${colors[severity]}`}
    >
      {severity}
    </span>
  );
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(1, now - then);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
