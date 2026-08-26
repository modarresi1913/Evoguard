"use client";

import { useState } from "react";
import { PRSummary } from "@/lib/evoguard/mock-data";
import { Search, ExternalLink } from "lucide-react";

interface Props {
  pr: PRSummary;
}

const typeFilters = [
  { id: "all", label: "All evidence" },
  { id: "git-history", label: "Git history" },
  { id: "ci-failure", label: "CI failure" },
  { id: "incident", label: "Incident" },
  { id: "dependency", label: "Dependency" },
  { id: "convention", label: "Convention" },
  { id: "test", label: "Test" },
  { id: "ownership", label: "Ownership" },
] as const;

export function DashboardEvidenceExplorer({ pr }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = pr.topEvidence.filter((ev) => {
    if (filter !== "all" && ev.type !== filter) return false;
    if (query && !`${ev.title} ${ev.detail} ${ev.source} ${ev.reference}`.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Evidence Explorer</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Every claim EvoGuard publishes is anchored to a verifiable source.
          Filter by type, search by reference, or click an evidence item to
          trace its full chain.
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search evidence, references, or sources…"
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-background/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {typeFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                filter === f.id
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            No evidence matches the current filter.
          </div>
        )}
        {filtered.map((ev) => (
          <div
            key={ev.id}
            className="rounded-lg border border-border bg-card/40 p-4 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="font-mono text-[10px] text-muted-foreground">
                    {ev.id}
                  </code>
                  <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                    {ev.type.replace("-", " ")}
                  </span>
                  <SeverityPill severity={ev.severity} />
                </div>
                <h4 className="mt-2 text-sm font-medium text-foreground">
                  {ev.title}
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {ev.detail}
                </p>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-primary">{ev.source}</span>
                    <span className="opacity-30">/</span>
                    <span className="text-muted-foreground">{ev.reference}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {new Date(ev.occurred).toISOString().slice(0, 10)}
                  </div>
                </div>
              </div>
              <button className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/60">
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span>
          {filtered.length} of {pr.topEvidence.length} evidence items shown
        </span>
        <span>retention: 90d · redacted · tenant-isolated</span>
      </div>
    </div>
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
