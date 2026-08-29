"use client";

import { threatModel } from "@/lib/evoguard/mock-data";
import { Lock, Server, KeyRound, ShieldCheck } from "lucide-react";

const severityColor: Record<string, string> = {
  low: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20",
  medium: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
  high: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20",
  critical: "bg-fuchsia-500/10 text-fuchsia-300 ring-1 ring-fuchsia-500/20",
};

const POLICIES = [
  {
    icon: Lock,
    label: "Least-privilege GitHub scopes",
    detail: "Read-only repo access. Write limited to review comments + check runs.",
  },
  {
    icon: Server,
    label: "On-prem / VPC deployment",
    detail: "Enterprise tenants can run EvoGuard inside their own boundary.",
  },
  {
    icon: KeyRound,
    label: "Customer-managed keys",
    detail: "Per-tenant encryption keys; customer controls rotation and revocation.",
  },
  {
    icon: ShieldCheck,
    label: "No training without consent",
    detail: "Customer data is never used to fine-tune production models without explicit, revocable consent.",
  },
];

export function EvoguardSecurity() {
  return (
    <section className="relative py-24 sm:py-32 border-t border-border bg-gradient-to-b from-background via-background to-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3 text-primary" />
            <span className="font-mono">security · threat model</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Privacy is an architectural boundary, not a setting.
          </h2>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            EvoGuard touches private code and AI provenance data. The threat
            model below is the working draft — every item has an owner, a
            mitigation, and a residual risk that is tracked, not hidden.
          </p>
        </div>

        {/* Policy grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {POLICIES.map((p) => (
            <div
              key={p.label}
              className="rounded-xl border border-border bg-card/40 p-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 mb-3">
                <p.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-xs font-semibold text-foreground">{p.label}</div>
              <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
                {p.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Threat model table */}
        <div className="mt-8 rounded-xl border border-border bg-card/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-background/40">
            <div className="text-xs font-semibold text-foreground">
              Working threat model · top 6 of 19 tracked threats
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Each row has an owner, detection method, and residual risk
              recorded in the audit log.
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-left">
                  <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Threat</th>
                  <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Impact</th>
                  <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Mitigation</th>
                </tr>
              </thead>
              <tbody>
                {threatModel.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border last:border-b-0 hover:bg-background/30"
                  >
                    <td className="px-3 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-[10px] text-muted-foreground">
                          {t.id}
                        </code>
                      </div>
                      <div className="mt-1 text-foreground font-medium">
                        {t.threat}
                      </div>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${severityColor[t.impact]}`}
                      >
                        {t.impact}
                      </span>
                    </td>
                    <td className="px-3 py-3 align-top text-muted-foreground leading-relaxed">
                      {t.mitigation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
