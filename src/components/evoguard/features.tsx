"use client";

import { capabilities } from "@/lib/evoguard/mock-data";
import {
  Compass,
  Brain,
  SearchCheck,
  Fingerprint,
  Gauge,
  ShieldCheck,
  Wrench,
  TrendingUp,
  Lock,
} from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  compass: Compass,
  brain: Brain,
  "search-check": SearchCheck,
  fingerprint: Fingerprint,
  gauge: Gauge,
  "shield-check": ShieldCheck,
  wrench: Wrench,
  "trending-up": TrendingUp,
  lock: Lock,
};

export function EvoguardFeatures() {
  return (
    <section id="product" className="relative py-24 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="font-mono">capabilities · nine</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            What EvoGuard actually does —{" "}
            <span className="text-muted-foreground">
              and what it refuses to do.
            </span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            Nine capabilities that compose into a defensible review layer.
            EvoGuard will not claim to detect AI-generated code with certainty,
            will not auto-merge for score alone, and will not present an
            inference as a fact.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {capabilities.map((c) => {
            const Icon = ICONS[c.icon] ?? Compass;
            return (
              <div
                key={c.id}
                className="group relative rounded-xl border border-border bg-card/40 p-5 transition-colors hover:border-primary/40 hover:bg-card/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 mb-4">
                  <Icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                <p className="mt-2 text-xs text-foreground/80 leading-relaxed">
                  {c.summary}
                </p>
                <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
                  {c.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
