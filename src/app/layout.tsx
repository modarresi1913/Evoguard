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

export const metadata: Metadata = {
  title: "EvoGuard — Context before merge.",
  description:
    "Evidence-driven control for AI-assisted code changes. EvoGuard evaluates, explains, and gates AI-generated code before it reaches your main branch.",
  keywords: [
    "EvoGuard",
    "AI code review",
    "code provenance",
    "context-aware",
    "GitHub App",
    "pull request analysis",
    "codebase memory",
    "developer tools",
  ],
  authors: [{ name: "EvoGuard" }],
  openGraph: {
    title: "EvoGuard — Context before merge.",
    description:
      "Evidence-driven control for AI-assisted code changes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EvoGuard — Context before merge.",
    description:
      "Evidence-driven control for AI-assisted code changes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
