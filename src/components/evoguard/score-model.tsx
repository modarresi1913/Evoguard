"use client";

import { Gauge } from "lucide-react";
import { demoPR } from "@/lib/evoguard/mock-data";

const DIMENSION_DETAILS: Record<string, { inputs: string; evidence: string; fp: string; fn: string }> = {
  contract: {
    inputs: "Public API surface, type signatures, OpenAPI specs, protobufs",
    evidence: "AST diff, breaking-change detector",
    fp: "Internal helpers renamed without consumer migration flagged as breaking",
    fn: "Behavioral breaking changes that preserve signatures",
  },
  historical: {
    inputs: "Revert / rollback / hotfix commits, related PR discussions",
    evidence: "Pattern signature match on affected files and symbols",
    fp: "Rollbacks caused by unrelated infrastructure events",
    fn: "Subtle patterns not captured by signature hashing",
  },
  dependency: {
    inputs: "package.json, lockfile, deprecation advisories, EOL calendar",
    evidence: "Resolved version vs. advisory database",
    fp: "Deprecated but stable internal forks",
    fn: "Behavioral regressions in non-deprecated versions",
  },
  test: {
    inputs: "Coverage delta, flaky history, missing tests on changed symbols",
    evidence: "Coverage report + diff coverage",
    fp: "Coverage present but assertions are weak",
    fn: "Untested code paths not flagged by coverage tooling",
  },
  convention: {
    inputs: "Mined conventions, ADRs, internal wrapper usage patterns",
    evidence: "Deviation count from mined convention set",
    fp: "Conventions mined from a non-representative sample",
    fn: "Conventions that exist but were never written down",
  },
  security: {
    inputs: "SAST, secret scan, PII classifier, OWASP rules",
    evidence: "SAST findings + secret scan results",
    fp: "Secrets in test fixtures flagged as real",
    fn: "Business-logic vulnerabilities invisible to SAST",
  },
  ownership: {
    inputs: "CODEOWNERS, review history, PTO calendar, delegated authority",
    evidence: "Reviewer assignment + delegated authority graph",
    fp: "Owner on PTO but delegated reviewer is fully qualified",
    fn: "Ownership drift not yet reflected in CODEOWNERS",
  },
  runtime: {
    inputs: "Canary telemetry, A/B labels, SLO breach history",
    evidence: "Runtime metrics correlated to changed symbols",
    fp: "Spurious correlation with unrelated incidents",
    fn: "Runtime regressions only visible under specific load",
  },
  architecture: {
    inputs: "ADR records, service boundaries, dependency direction graph",
    evidence: "Boundary violation detector + ADR scanner",
    fp: "Intentional boundary crossings during migrations",
    fn: "Implicit boundaries never codified in ADRs",
  },
};

export function EvoguardScoreModel() {
  return (
    <section id="score" className="relative py-24 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Gauge className="h-3 w-3 text-primary" />
            <span className="font-mono">ECS · ecosystem compatibility score</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            One number is not enough.{" "}
            <span className="text-muted-foreground">
              Nine calibrated dimensions are.
            </span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            ECS is a weighted, confidence-banded score across nine dimensions.
            Every dimension has its own inputs, evidence type, and known false
            positive / false negative modes — surfaced to the reviewer, not
            hidden. Thresholds are calibrated per repository against baseline
            outcomes, never globally fixed.
          </p>
        </div>

        {/* Formula card */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
          <div className="rounded-xl border border-border bg-card/40 p-5">
            <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
              Composite formula
            </div>
            <pre className="mt-3 font-mono text-[11px] sm:text-xs text-foreground leading-relaxed overflow-x-auto scrollbar-thin">
{`ECS = w1·Contract
    + w2·Historical
    + w3·Dependency
    + w4·Test
    + w5·Convention
    + w6·Architecture
    + w7·Security     (inverted)
    + w8·Ownership    (inverted)
    + w9·Runtime      (if telemetry available)`}
            </pre>
            <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
              Weights are not constants. They are calibrated per repository
              against observed outcomes — what previously caused a rollback in
              this codebase shapes the weight applied to the next PR.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/40 p-5">
            <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
              Policy bands (per repo, calibrated)
            </div>
            <div className="mt-3 space-y-2">
              <Band from="90" to="100" label="Low-friction merge" color="emerald" />
              <Band from="70" to="89" label="Merge with normal review" color="sky" />
              <Band from="50" to="69" label="Mandatory review or extra tests" color="amber" />
              <Band from="0" to="49" label="Block or special approval" color="rose" />
            </div>
          </div>
        </div>

        {/* Dimension table */}
        <div className="mt-6 rounded-xl border border-border bg-card/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-background/40">
            <div className="text-xs font-semibold text-foreground">
              Dimension breakdown — calibrated against {demoPR.repository}
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-left">
                  <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Dimension</th>
                  <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Score</th>
                  <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Inputs</th>
                  <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Known false positives</th>
                  <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Known false negatives</th>
                </tr>
              </thead>
              <tbody>
                {demoPR.dimensions.map((d) => {
                  const detail = DIMENSION_DETAILS[d.key];
                  return (
                    <tr
                      key={d.key}
                      className="border-b border-border last:border-b-0 hover:bg-background/30"
                    >
                      <td className="px-3 py-2.5 align-top">
                        <div className="font-medium text-foreground">{d.label}</div>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          w={d.weight.toFixed(2)} · conf {d.confidence.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        <span
                          className={`font-mono text-sm tabular-nums ${
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
                      </td>
                      <td className="px-3 py-2.5 align-top text-muted-foreground">
                        {detail?.inputs}
                      </td>
                      <td className="px-3 py-2.5 align-top text-muted-foreground">
                        {detail?.fp}
                      </td>
                      <td className="px-3 py-2.5 align-top text-muted-foreground">
                        {detail?.fn}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function Band({
  from,
  to,
  label,
  color,
}: {
  from: string;
  to: string;
  label: string;
  color: "emerald" | "sky" | "amber" | "rose";
}) {
  const colors = {
    emerald: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
    sky: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30",
    amber: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
    rose: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30",
  };
  return (
    <div className="flex items-center justify-between gap-2">
      <span
        className={`font-mono text-[11px] px-2 py-0.5 rounded ${colors[color]}`}
      >
        {from}–{to}
      </span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
