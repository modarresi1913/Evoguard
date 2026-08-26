"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, ShieldCheck, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#product", label: "Product" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#score", label: "Score Model" },
  { href: "#architecture", label: "Architecture" },
  { href: "#pitch", label: "Pitch" },
  { href: "#pricing", label: "Pricing" },
];

export function EvoguardNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#" className="flex items-center gap-2 group">
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
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              <span>Star on GitHub</span>
            </a>
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <a href="#dashboard" className="flex items-center gap-2">
              <span>Live Demo</span>
            </a>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md"
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button size="sm" asChild className="flex-1">
                <a href="#dashboard">Live Demo</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
