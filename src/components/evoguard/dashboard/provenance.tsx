"use client";

import { PRSummary } from "@/lib/evoguard/mock-data";
import { Fingerprint, ShieldAlert, CheckCircle2, HelpCircle } from "lucide-react";

interface Props {
  pr: PRSummary;
}

const sourceColor: Record<string, string> = {
  declared: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20",
  inferred: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
  unknown: "bg-muted text-muted-foreground",
};

const sourceIcon: Record<string, React.ElementType> = {
  declared: CheckCircle2,
  inferred: ShieldAlert,
  unknown: HelpCircle,
};

export function DashboardProvenance({ pr }: Props) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Provenance Records
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          EvoGuard never claims to detect AI-generated code with certainty.
          Provenance is recorded as a probabilistic claim — declared, inferred
          or unknown — and always carries a confidence value.
        </p>
      </div>

      {/* Privacy callout */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 mb-4">
        <div className="flex items-start gap-2">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            Raw prompts are not stored. Provenance records retain only:
            provider, model name, declared author, inference method, confidence
            and an opaque context hash. Retention is 90 days by default and
            customer-configurable.
          </p>
        </div>
      </div>

      {/* Provenance records */}
      <div className="space-y-2">
        {pr.provenance.map((rec) => {
          const Icon = sourceIcon[rec.sourceType];
          return (
            <div
              key={rec.id}
              className="rounded-lg border border-border bg-card/40 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <code className="font-mono text-[11px] text-foreground">
                      {rec.id}
                    </code>
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                        sourceColor[rec.sourceType]
                      }`}
                    >
                      {rec.sourceType}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-mono">
                    <Row label="provider" value={rec.provider} />
                    <Row label="model" value={rec.modelName} />
                    <Row
                      label="confidence"
                      value={rec.confidence.toFixed(2)}
                      accent={
                        rec.confidence >= 0.8
                          ? "good"
                          : rec.confidence >= 0.4
                            ? "warn"
                            : "muted"
                      }
                    />
                    <Row
                      label="declared by"
                      value={rec.declaredBy ?? "—"}
                    />
                    <Row
                      label="inference method"
                      value={rec.inferenceMethod ?? "—"}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schema preview */}
      <div className="mt-4 rounded-lg border border-border bg-background/60 overflow-hidden">
        <div className="px-3 py-2 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Fingerprint className="h-3 w-3 text-primary" />
            <span className="text-[11px] font-mono text-foreground">
              ProvenanceRecord · schema
            </span>
          </div>
        </div>
        <pre className="p-3 text-[10px] font-mono text-muted-foreground leading-relaxed overflow-x-auto scrollbar-thin">
{`- id              : string  (pk)
- change_id       : string  (fk → ChangeSet)
- source_type     : enum    { declared | inferred | unknown }
- provider        : string?
- model_name      : string?
- declared_by     : string?
- inference_method: string?
- confidence      : float   (0..1)
- context_hash    : string  (opaque, not reversible)
- privacy_level   : enum    { default | redacted | anonymized }
- retention_policy: enum    { default_90d | custom | permanent }
- created_at      : timestamp`}
        </pre>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent = "default",
}: {
  label: string;
  value: string;
  accent?: "default" | "good" | "warn" | "muted";
}) {
  const colors = {
    default: "text-foreground",
    good: "text-emerald-300",
    warn: "text-amber-300",
    muted: "text-muted-foreground",
  };
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={colors[accent]}>{value}</span>
    </div>
  );
}
