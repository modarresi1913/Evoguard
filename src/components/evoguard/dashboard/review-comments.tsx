"use client";

import { PRSummary } from "@/lib/evoguard/mock-data";
import { GitPullRequestDraft, Link as LinkIcon } from "lucide-react";

interface Props {
  pr: PRSummary;
}

const severityColor: Record<string, string> = {
  low: "border-l-sky-400 bg-sky-500/5",
  medium: "border-l-amber-400 bg-amber-500/5",
  high: "border-l-rose-400 bg-rose-500/5",
  critical: "border-l-fuchsia-400 bg-fuchsia-500/5",
};

const tagColor: Record<string, string> = {
  EvoGuard: "bg-primary/15 text-primary ring-1 ring-primary/30",
  Policy: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  Provenance: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30",
};

export function DashboardReviewComments({ pr }: Props) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Evidence-Linked Review Comments
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          These comments would be published back to the GitHub PR. Every
          comment links to the evidence that produced it — reviewers can audit
          the reasoning in seconds instead of trusting a black box.
        </p>
      </div>

      <div className="space-y-3">
        {pr.comments.map((c) => (
          <div
            key={c.id}
            className={`rounded-r-lg border border-border border-l-2 ${
              severityColor[c.severity]
            } bg-card/40 p-3`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <GitPullRequestDraft className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <code className="font-mono text-[11px] text-foreground truncate">
                  {c.file}
                </code>
                <span className="font-mono text-[10px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
                  L{c.line}
                </span>
                <span
                  className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${tagColor[c.authorTag]}`}
                >
                  {c.authorTag}
                </span>
              </div>
            </div>

            <p className="mt-2 text-xs text-foreground leading-relaxed">
              {c.body}
            </p>

            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
                Suggested action
              </div>
              <p className="mt-1 text-[11px] text-foreground leading-relaxed">
                {c.suggestedAction}
              </p>

              {c.evidenceRefs.length > 0 && (
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <LinkIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
                    evidence:
                  </span>
                  {c.evidenceRefs.map((ref) => (
                    <code
                      key={ref}
                      className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded hover:bg-primary/20 cursor-pointer"
                    >
                      {ref}
                    </code>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
