"use client";

import { pricingTiers } from "@/lib/evoguard/mock-data";
import { Check } from "lucide-react";

export function EvoguardPricing() {
  return (
    <section
      id="pricing"
      className="relative py-24 sm:py-32 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="font-mono">pricing · per active developer</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Pricing aligned with adoption, not seats.
          </h2>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            The Team tier charges per active developer — only engineers who
            actually trigger PR analyses are billed. Static reviewers and
            bots don&apos;t count. Enterprise is annual, with on-prem and
            customer-managed keys.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-xl border p-5 ${
                tier.highlight
                  ? "border-primary/60 bg-gradient-to-b from-primary/10 to-card/40 ring-1 ring-primary/30"
                  : "border-border bg-card/40"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-2.5 left-5 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-primary-foreground">
                  Recommended
                </span>
              )}
              <div className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {tier.name}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-semibold text-foreground">
                  {tier.price}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tier.cadence}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {tier.blurb}
              </p>

              <button
                className={`mt-5 w-full rounded-md py-2 text-xs font-medium transition-colors ${
                  tier.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted/60 text-foreground hover:bg-muted"
                }`}
              >
                {tier.cta}
              </button>

              <ul className="mt-5 space-y-2">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-[11px] text-muted-foreground leading-snug"
                  >
                    <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[11px] text-muted-foreground text-center">
          No customer data is used for model training without explicit,
          revocable consent. Free tier repositories are never used to fine-tune
          production scoring models.
        </p>
      </div>
    </section>
  );
}
