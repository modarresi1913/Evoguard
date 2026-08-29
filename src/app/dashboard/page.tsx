import type { Metadata } from 'next';
import { DecisionsView } from '@/components/evoguard/dashboard/decisions-view';

export const metadata: Metadata = {
  title: 'Decisions Dashboard',
  description: 'EvoGuard Decision Records — browse, filter, and inspect evidence snapshots for every merged PR.',
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/60 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <a href="/" className="text-primary font-semibold text-sm tracking-tight hover:opacity-80 transition-opacity">
            EvoGuard
          </a>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-muted-foreground text-sm">Decisions</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DecisionsView />
      </div>
    </main>
  );
}
