"use client";

import { EvoguardNav } from "@/components/evoguard/nav";
import { EvoguardHero } from "@/components/evoguard/hero";
import { EvoguardProblem } from "@/components/evoguard/problem";
import { EvoguardFeatures } from "@/components/evoguard/features";
import { EvoguardDashboard } from "@/components/evoguard/dashboard";
import { EvoguardScoreModel } from "@/components/evoguard/score-model";
import { EvoguardArchitecture } from "@/components/evoguard/architecture";
import { EvoguardPitch } from "@/components/evoguard/pitch";
import { EvoguardSecurity } from "@/components/evoguard/security";
import { EvoguardPricing } from "@/components/evoguard/pricing";
import { EvoguardFooter } from "@/components/evoguard/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <EvoguardNav />
      <main className="flex-1">
        <EvoguardHero />
        <EvoguardProblem />
        <EvoguardFeatures />
        <EvoguardDashboard />
        <EvoguardScoreModel />
        <EvoguardArchitecture />
        <EvoguardPitch />
        <EvoguardSecurity />
        <EvoguardPricing />
      </main>
      <EvoguardFooter />
    </div>
  );
}
