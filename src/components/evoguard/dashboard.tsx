"use client";

import { useState } from "react";
import {
  GitPullRequest,
  Layers,
  History,
  Package,
  Fingerprint,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";
import { demoPR } from "@/lib/evoguard/mock-data";
import { DashboardRiskOverview } from "./dashboard/risk-overview";
import { DashboardEvidenceExplorer } from "./dashboard/evidence-explorer";
import { DashboardHistoricalPatterns } from "./dashboard/historical-patterns";
import { DashboardProvenance } from "./dashboard/provenance";
import { DashboardReviewComments } from "./dashboard/review-comments";
import { DashboardSidebar } from "./dashboard/sidebar";

type Tab =
  | "risk"
  | "evidence"
  | "historical"
  | "provenance"
  | "comments"
  | "policies";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "risk", label: "Risk Overview", icon: Layers },
  { id: "evidence", label: "Evidence Explorer", icon: ShieldCheck },
  { id: "historical", label: "Historical Patterns", icon: History },
  { id: "provenance", label: "Provenance", icon: Fingerprint },
  { id: "comments", label: "Review Comments", icon: ClipboardCheck },
  { id: "policies", label: "Policy & Gates", icon: Package },
];

export function EvoguardDashboard() {
  const [tab, setTab] = useState<Tab>("risk");

  return (
    <section
      id="dashboard"
      className="relative py-24 sm:py-32 border-t border-border bg-gradient-to-b from-background via-background to-card/30"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <GitPullRequest className="h-3 w-3 text-primary" />
            <span className="font-mono">live demo · interactive</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            A dashboard that defends every decision with evidence.
          </h2>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            This is a live mock of the EvoGuard web app. Every number, every
            comment and every pattern below is anchored to evidence — exactly how
            a reviewer would see it on a real PR.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <DashboardSidebar />

          <div className="rounded-xl border border-border bg-card/40 backdrop-blur overflow-hidden">
            {/* Tab bar */}
            <div className="border-b border-border bg-background/40">
              <div className="flex overflow-x-auto scrollbar-thin">
                {TABS.map((t) => {
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                        active
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <t.icon className="h-3.5 w-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            <div className="p-4 sm:p-6">
              {tab === "risk" && <DashboardRiskOverview pr={demoPR} />}
              {tab === "evidence" && <DashboardEvidenceExplorer pr={demoPR} />}
              {tab === "historical" && <DashboardHistoricalPatterns />}
              {tab === "provenance" && <DashboardProvenance pr={demoPR} />}
              {tab === "comments" && <DashboardReviewComments pr={demoPR} />}
              {tab === "policies" && <PoliciesPanel />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PoliciesPanel() {
  const policies = [
    {
      name: "block-fetch-bypass",
      description:
        "Block PRs that call fetch() directly outside src/lib/http/client.ts.",
      severity: "high",
      enforced: true,
      triggers: 3,
    },
    {
      name: "require-owner-review-on-webhook",
      description:
        "Require @payments-core/owners review for any change to src/payments/webhook.ts.",
      severity: "high",
      enforced: true,
      triggers: 2,
    },
    {
      name: "block-deprecated-dependency",
      description:
        "Block new dependencies pinned to versions marked deprecated in the last 90 days.",
      severity: "medium",
      enforced: true,
      triggers: 5,
    },
    {
      name: "require-timeout-regression-test",
      description:
        "Require a regression test when timeout budget is increased by more than 50%.",
      severity: "medium",
      enforced: false,
      triggers: 0,
    },
    {
      name: "canary-gate-on-runtime-path",
      description:
        "Require canary deployment approval when changes touch runtime-critical paths without runtime telemetry.",
      severity: "low",
      enforced: false,
      triggers: 0,
    },
  ];

  const severityColor: Record<string, string> = {
    high: "text-rose-300 bg-rose-500/10 ring-rose-500/20",
    medium: "text-amber-300 bg-amber-500/10 ring-amber-500/20",
    low: "text-sky-300 bg-sky-500/10 ring-sky-500/20",
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Policy & Merge Gates</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Repository-level policies translate ECS scores into actionable merge
          decisions. Thresholds are calibrated per repository — never global.
        </p>
      </div>

      <div className="space-y-2">
        {policies.map((p) => (
          <div
            key={p.name}
            className="flex items-start justify-between gap-4 rounded-lg border border-border bg-background/40 p-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <code className="font-mono text-xs text-foreground truncate">
                  {p.name}
                </code>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ring-1 ${
                    severityColor[p.severity]
                  }`}
                >
                  {p.severity}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  p.enforced
                    ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {p.enforced ? "ENFORCED" : "DRAFT"}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {p.triggers} trigger{p.triggers === 1 ? "" : "s"} / 90d
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
