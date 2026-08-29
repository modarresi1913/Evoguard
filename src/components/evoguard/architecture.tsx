"use client";

import { pipelineStages } from "@/lib/evoguard/mock-data";
import { Network } from "lucide-react";

const LAYER_COLOR: Record<string, string> = {
  ingest: "border-sky-500/40 bg-sky-500/5 text-sky-300",
  evidence: "border-amber-500/40 bg-amber-500/5 text-amber-300",
  context: "border-violet-500/40 bg-violet-500/5 text-violet-300",
  decision: "border-rose-500/40 bg-rose-500/5 text-rose-300",
  delivery: "border-emerald-500/40 bg-emerald-500/5 text-emerald-300",
};

const LAYER_LABEL: Record<string, string> = {
  ingest: "01 · Ingest",
  evidence: "02 · Evidence",
  context: "03 · Context",
  decision: "04 · Decision",
  delivery: "05 · Delivery",
};

export function EvoguardArchitecture() {
  // Group by layer
  const layers = ["ingest", "evidence", "context", "decision", "delivery"] as const;
  const grouped = layers.map((layer) => ({
    layer,
    stages: pipelineStages.filter((s) => s.layer === layer),
  }));

  return (
    <section
      id="architecture"
      className="relative py-24 sm:py-32 border-t border-border bg-gradient-to-b from-background via-background to-card/30"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Network className="h-3 w-3 text-primary" />
            <span className="font-mono">architecture · production-oriented</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            The LLM explains.{" "}
            <span className="text-muted-foreground">
              Evidence decides.
            </span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            Five layers, fourteen services. Deterministic evidence is the source
            of truth for tests, lint, dependency versions, policy violations,
            secrets and history. The LLM only translates evidence into
            review comments and rewrite prompts — it never decides alone.
          </p>
        </div>

        {/* Pipeline diagram */}
        <div className="mt-12 space-y-4">
          {grouped.map((g) => (
            <div key={g.layer} className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-3">
              <div className="flex items-center lg:justify-end lg:pr-3 lg:border-r border-border">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {LAYER_LABEL[g.layer]}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {g.stages.map((s) => (
                  <div
                    key={s.id}
                    className={`rounded-lg border p-3 ${LAYER_COLOR[g.layer]}`}
                  >
                    <div className="text-xs font-medium">{s.label}</div>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Principles */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Principle
            title="Deterministic truth"
            body="Tests, lint, dependency versions, policy violations, secrets, SAST, ownership — all resolved against verifiable records, never against LLM verdicts."
          />
          <Principle
            title="LLM as translator"
            body="The model explains evidence, drafts review comments and proposes rewrite prompts. It does not mutate evidence, decide merges, or override policy."
          />
          <Principle
            title="Tenant isolation by design"
            body="Per-tenant encryption keys, namespace isolation at storage and retrieval, query-time tenant assertion. On-prem deployment available for enterprise."
          />
        </div>
      </div>
    </section>
  );
}

function Principle({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <h4 className="text-xs font-semibold text-foreground">{title}</h4>
      <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
        {body}
      </p>
    </div>
  );
}
