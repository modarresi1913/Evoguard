"use client";

import { useState } from "react";
import { pitchSlides } from "@/lib/evoguard/mock-data";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export function EvoguardPitch() {
  const [active, setActive] = useState(0);
  const slide = pitchSlides[active];

  return (
    <section
      id="pitch"
      className="relative py-24 sm:py-32 border-t border-border bg-gradient-to-b from-background via-background to-card/30"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="font-mono">pitch · five slides</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            The thesis, in five moves.
          </h2>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            Peter Thiel framing — Problem, Secret, Product, Monopoly, Last
            Mover. Each slide carries a measurable claim, the strongest
            objection we expect, and the response we&apos;d give.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          {/* Slide selector */}
          <div className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-thin">
            {pitchSlides.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  className={`shrink-0 lg:w-full text-left rounded-lg border p-3 transition-colors ${
                    isActive
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-card/30 hover:border-border hover:bg-card/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      0{s.index}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active slide */}
          <div className="rounded-xl border border-border bg-card/40 p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-primary">
                  0{slide.index} / 05
                </span>
                <span className="text-xs uppercase tracking-wider font-mono text-muted-foreground">
                  {slide.title}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setActive((i) => (i - 1 + pitchSlides.length) % pitchSlides.length)
                  }
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/60"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActive((i) => (i + 1) % pitchSlides.length)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/60"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-foreground leading-tight">
              {slide.headline}
            </h3>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {slide.body}
            </p>

            <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-3">
              <div className="flex items-start gap-2">
                <Quote className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-mono text-primary">
                    Measurable claim
                  </div>
                  <p className="mt-1 text-xs text-foreground leading-relaxed">
                    {slide.measurableClaim}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                <div className="text-[10px] uppercase tracking-wider font-mono text-rose-300">
                  Strongest objection
                </div>
                <p className="mt-1 text-xs text-foreground/90 leading-relaxed">
                  {slide.objection}
                </p>
              </div>
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <div className="text-[10px] uppercase tracking-wider font-mono text-emerald-300">
                  Response
                </div>
                <p className="mt-1 text-xs text-foreground/90 leading-relaxed">
                  {slide.response}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
