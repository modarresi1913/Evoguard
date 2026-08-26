import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://github.com/modarresi1913/Evoguard";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  title: {
    default: "EvoGuard — Context before merge. AI Code Review & Provenance",
    template: "%s · EvoGuard",
  },
  description:
    "Evidence-driven AI code review & provenance tracking. EvoGuard evaluates, explains, and gates AI-assisted Pull Requests against codebase history, contracts, dependencies, tests & security before merge. Context-Aware AI Code Integration platform.",
  keywords: [
    "EvoGuard",
    "AI code review",
    "AI code reviewer",
    "code provenance",
    "AI code provenance",
    "context-aware code analysis",
    "pull request quality gate",
    "GitHub App",
    "pull request analysis",
    "codebase memory",
    "developer tools",
    "AI code integration",
    "evidence-driven review",
    "merge gate",
    "policy engine",
    "static analysis",
    "SAST",
    "dependency scanning",
    "technical debt",
    "AI-assisted development",
    "GitHub Copilot safety",
    "Cursor AI safety",
    "Codeium",
    "code review automation",
    "PR analysis tool",
    "B2B SaaS developer tools",
    "ECS score",
    "ecosystem compatibility score",
    "AI code trust layer",
  ],
  authors: [{ name: "EvoGuard", url: SITE_URL }],
  creator: "EvoGuard",
  publisher: "EvoGuard",
  applicationName: "EvoGuard",
  category: "Developer Tools",
  classification: "Developer Tools, AI Code Review, B2B SaaS",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "EvoGuard — Context before merge. AI Code Review & Provenance",
    description:
      "Evidence-driven AI code review & provenance tracking. Context-Aware AI Code Integration platform that gates AI-assisted Pull Requests against codebase history, contracts, dependencies & security before merge.",
    url: SITE_URL,
    siteName: "EvoGuard",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EvoGuard — Context before merge. Evidence-driven control for AI-assisted code changes.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EvoGuard — Context before merge. AI Code Review",
    description:
      "Evidence-driven AI code review & provenance tracking. Gates AI-assisted Pull Requests against codebase history before merge.",
    images: ["/og-image.png"],
    creator: "@evoguard",
    site: "@evoguard",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "theme-color": "#10b981",
    "color-scheme": "dark",
  },
};

export const viewport = {
  themeColor: "#10b981",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "EvoGuard",
  description:
    "Evidence-driven control for AI-assisted code changes. A Context-Aware AI Code Integration platform that evaluates, explains, and gates AI-touched Pull Requests before they reach main.",
  url: SITE_URL,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "EvoGuard",
    url: SITE_URL,
  },
  keywords:
    "AI code review, code provenance, context-aware, GitHub App, pull request analysis, codebase memory, developer tools, AI code integration, evidence-driven review, merge gate, policy engine, static analysis",
  featureList: [
    "Context-Aware Change Risk",
    "Codebase Memory",
    "Evidence-Driven Review",
    "AI Provenance Tracking",
    "Multi-Dimensional ECS Score",
    "Policy & Merge Gates",
    "Contextual Repair Loop",
    "Outcome-Based Memory",
    "Audit & Privacy Layer",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    ratingCount: "1",
    reviewCount: "1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
