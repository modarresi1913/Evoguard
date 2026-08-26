"use client";

import { ShieldCheck, Github, Twitter, Mail } from "lucide-react";

const LINKS = {
  product: [
    { label: "Live Dashboard", href: "#dashboard" },
    { label: "Score Model", href: "#score" },
    { label: "Architecture", href: "#architecture" },
    { label: "Pricing", href: "#pricing" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Threat Model", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Design Partners", href: "#" },
    { label: "Security", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export function EvoguardFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
                <ShieldCheck className="h-4.5 w-4.5 text-primary" strokeWidth={2.4} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-semibold tracking-tight text-foreground text-[15px]">
                  EvoGuard
                </span>
                <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  context before merge
                </span>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed max-w-xs">
              Evidence-driven control for AI-assisted code changes. A vendor-neutral
              trust layer between AI codegen tools and your main branch.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-md border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-md border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-md border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn title="Product" links={LINKS.product} />
          <FooterColumn title="Resources" links={LINKS.resources} />
          <FooterColumn title="Company" links={LINKS.company} />
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <div className="font-mono">
            © 2026 EvoGuard. Context before merge.
          </div>
          <div className="flex items-center gap-4 font-mono">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Security</a>
            <a href="#" className="hover:text-foreground">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
        {title}
      </div>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-xs text-foreground/80 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
