"use client";

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, GitMerge, FileText, MessageSquare, CheckCircle2, XCircle, Clock, Copy, ExternalLink, AlertTriangle, ArrowRight, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface Decision {
  id: string;
  decisionId: string;
  prNumber: number;
  repoFullName: string;
  mergeCommitSha: string;
  author: string | null;
  prTitle: string | null;
  createdAt: string;
  evidenceSnapshotCount: number;
}

interface EvidenceSnapshot {
  id: string;
  evidenceType: string;
  headSha: string;
  changedFiles: unknown[];
  diffStats: { additions: number; deletions: number; changedFiles: number } | null;
  reviewComments: unknown[];
  checkStatuses: Array<{ name: string; status: string; conclusion: string | null }>;
  prTitle: string | null;
  createdAt: string;
}

interface DecisionDetail {
  id: string;
  decisionId: string;
  prNumber: number;
  repoFullName: string;
  mergeCommitSha: string;
  author: string | null;
  prTitle: string | null;
  prBody: string | null;
  createdAt: string;
  evidenceSnapshots: EvidenceSnapshot[];
}

interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const checkIcon = (conclusion: string | null) => {
  if (conclusion === 'success') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
  if (conclusion === 'failure') return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
  return <Clock className="w-3.5 h-3.5 text-amber-400" />;
};

interface Conflict {
  id: string;
  repoFullName: string;
  prNumberA: number;
  prNumberB: number;
  sharedFiles: string[];
  fileCount: number;
  severity: string;
  detectedAt: string;
  resolvedAt: string | null;
  resolution: string | null;
}

const severityStyle: Record<string, string> = {
  critical: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
  warning: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
  info: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
};

interface MergeOrderItem {
  prNumber: number;
  prTitle: string | null;
  author: string | null;
  canMergeNow: boolean;
  blockedBy: number[];
  sharedFileCount: number;
}

interface MergeOrderData {
  repoFullName: string;
  totalNodes: number;
  orderedPRs: MergeOrderItem[];
}

export function DecisionsView() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, limit: 20, offset: 0, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<DecisionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [mergeOrder, setMergeOrder] = useState<MergeOrderData | null>(null);

  const fetchConflicts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('repo', search);
      const res = await fetch(`/api/conflicts?${params}`);
      const json = await res.json();
      setConflicts(json.data ?? []);
    } catch { /* silent */ }
  }, [search]);

  const fetchMergeOrder = useCallback(async () => {
    if (!search) { setMergeOrder(null); return; }
    try {
      const res = await fetch(`/api/dag?repo=${encodeURIComponent(search)}`);
      const json = await res.json();
      const data = json.data as MergeOrderData;
      setMergeOrder(data.totalNodes > 0 ? data : null);
    } catch { /* silent */ }
  }, [search]);

  const fetchDecisions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('repo', search);
      params.set('limit', '20');
      const res = await fetch(`/api/decisions?${params}`);
      const json = await res.json();
      setDecisions(json.data ?? []);
      setPagination(json.pagination ?? { total: 0, limit: 20, offset: 0, hasMore: false });
    } catch {
      toast.error('Failed to load decisions');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => { fetchDecisions(); fetchConflicts(); fetchMergeOrder(); }, 300);
    return () => clearTimeout(t);
  }, [fetchDecisions, fetchConflicts, fetchMergeOrder]);

  const openDetail = async (decisionId: string) => {
    setDetailLoading(true);
    setSelectedDecision(null);
    try {
      const res = await fetch(`/api/decisions/${decisionId}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setSelectedDecision(json.data);
    } catch {
      toast.error('Failed to load decision detail');
    } finally {
      setDetailLoading(false);
    }
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Decision ID copied');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Decision Records</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pagination.total} total records
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Filter by repo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-card/60 border-border/60 text-sm"
          />
        </div>
      </div>

      {/* Active Conflicts Banner */}
      {conflicts.length > 0 && (
        <Card className="border-rose-500/30 bg-rose-500/[0.03] backdrop-blur">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-medium text-rose-300">Active Conflicts ({conflicts.length})</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-thin">
              {conflicts.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-[11px] bg-background/40 rounded px-2 py-1.5">
                  <span className="font-mono text-foreground/80">
                    <span className="text-primary">#{c.prNumberA}</span>
                    <span className="text-muted-foreground mx-1">x</span>
                    <span className="text-primary">#{c.prNumberB}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-mono">{c.fileCount} file{c.fileCount !== 1 ? 's' : ''}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0 rounded ${severityStyle[c.severity] ?? severityStyle.info}`}>{c.severity}</span>
                  </div>
                </div>
              ))}
              {conflicts.length > 5 && <div className="text-[10px] text-muted-foreground text-center">+{conflicts.length - 5} more</div>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Merge Order DAG */}
      {mergeOrder && mergeOrder.totalNodes > 0 && (
        <Card className="border-primary/30 bg-primary/[0.03] backdrop-blur">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <GitMerge className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Suggested Merge Order ({mergeOrder.totalNodes} PRs)</span>
            </div>
            <div className="space-y-1">
              {mergeOrder.orderedPRs.map((item, i) => (
                <div key={item.prNumber} className="flex items-center gap-2 text-[11px] bg-background/40 rounded px-2 py-1.5">
                  <span className="text-muted-foreground font-mono w-5 text-right">{i + 1}.</span>
                  {item.canMergeNow ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  )}
                  <span className={`font-mono ${item.canMergeNow ? 'text-foreground' : 'text-muted-foreground'}`}>#{item.prNumber}</span>
                  {item.prTitle && <span className="text-foreground/70 truncate max-w-[180px]">{item.prTitle}</span>}
                  <span className="text-muted-foreground/50 font-mono">{item.sharedFileCount} shared</span>
                  {!item.canMergeNow && item.blockedBy.length > 0 && (
                    <span className="ml-auto flex items-center gap-1 text-amber-300/70 font-mono">
                      blocked by {item.blockedBy.map(b => `#${b}`).join(', ')}
                    </span>
                  )}
                  {mergeOrder.orderedPRs[i + 1] && (
                    <ArrowRight className="w-3 h-3 text-muted-foreground/30 ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="border-border/60 bg-card/40 backdrop-blur">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono h-10">Decision ID</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono h-10">PR</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono h-10">Repo</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono h-10 hidden md:table-cell">Author</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono h-10 hidden lg:table-cell">Evidence</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono h-10">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/20">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full max-w-[120px]" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : decisions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <GitMerge className="w-8 h-8 opacity-30" />
                      <span>No decisions recorded yet</span>
                      <span className="text-xs opacity-60">Merge a PR to generate the first Decision ID</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                decisions.map((d) => (
                  <TableRow
                    key={d.id}
                    className="border-border/20 cursor-pointer hover:bg-primary/[0.03] transition-colors"
                    onClick={() => openDetail(d.decisionId)}
                  >
                    <TableCell className="font-mono text-xs">
                      <button onClick={(e) => { e.stopPropagation(); copyId(d.decisionId); }} className="flex items-center gap-1.5 hover:text-primary transition-colors group">
                        <span className="text-primary/70">{d.decisionId.slice(0, 8)}</span>
                        <span className="text-muted-foreground/50">...</span>
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium">#{d.prNumber}</span>
                      {d.prTitle && (
                        <div className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px] truncate">
                          {d.prTitle}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{d.repoFullName}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{d.author ? `@${d.author}` : '—'}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0 h-5">
                        {d.evidenceSnapshotCount} snapshot{d.evidenceSnapshotCount !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      <br />
                      {new Date(d.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedDecision || detailLoading} onOpenChange={(open) => { if (!open) setSelectedDecision(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin bg-card/95 backdrop-blur border-border/60">
          {detailLoading ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : selectedDecision ? (
            <DecisionDetailPanel decision={selectedDecision} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DecisionDetailPanel({ decision }: { decision: DecisionDetail }) {
  const [owner, repo] = decision.repoFullName.split('/');
  const prUrl = `https://github.com/${owner}/${repo}/pull/${decision.prNumber}`;
  const commitUrl = `https://github.com/${owner}/${repo}/commit/${decision.mergeCommitSha}`;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-base">
          <GitMerge className="w-4 h-4 text-primary" />
          Decision Record
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5 mt-2">
        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetaCard label="Decision ID" value={decision.decisionId} mono copyable />
          <MetaCard label="PR" value={`#${decision.prNumber}`} mono>
            <a href={prUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-xs mt-1">
              Open on GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </MetaCard>
          <MetaCard label="Merge Commit" value={decision.mergeCommitSha.slice(0, 12)} mono>
            <a href={commitUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-xs mt-1">
              View commit <ExternalLink className="w-3 h-3" />
            </a>
          </MetaCard>
          <MetaCard label="Author" value={decision.author ? `@${decision.author}` : 'Unknown'} />
          <MetaCard label="Repo" value={decision.repoFullName} mono />
          <MetaCard label="Merged" value={new Date(decision.createdAt).toLocaleString()} />
        </div>

        {/* PR Title & Body */}
        {decision.prTitle && (
          <div className="rounded-lg border border-border/60 bg-background/50 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">PR Title</div>
            <div className="text-sm font-medium">{decision.prTitle}</div>
            {decision.prBody && (
              <div className="mt-2 text-xs text-muted-foreground line-clamp-4 whitespace-pre-wrap">{decision.prBody}</div>
            )}
          </div>
        )}

        {/* Evidence Snapshots */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-3">
            Evidence Snapshots ({decision.evidenceSnapshots.length})
          </div>
          {decision.evidenceSnapshots.length === 0 ? (
            <div className="text-xs text-muted-foreground/60 text-center py-4">No evidence collected</div>
          ) : (
            <div className="space-y-3">
              {decision.evidenceSnapshots.map((snap) => (
                <EvidenceCard key={snap.id} snapshot={snap} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MetaCard({ label, value, mono, copyable, children }: {
  label: string; value: string; mono?: boolean; copyable?: boolean; children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/50 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{label}</div>
      <div className={`mt-1 flex items-center gap-1.5 ${mono ? 'font-mono' : ''} text-sm`}>{value}
        {copyable && <Copy className="w-3 h-3 text-muted-foreground/50 cursor-pointer hover:text-primary transition-colors" onClick={() => { navigator.clipboard.writeText(value); toast.success('Copied'); }} />}
      </div>
      {children}
    </div>
  );
}

function EvidenceCard({ snapshot }: { snapshot: EvidenceSnapshot }) {
  const files = snapshot.changedFiles as Array<{ filename: string; status: string; additions: number; deletions: number }> | null;
  const stats = snapshot.diffStats;
  const reviews = snapshot.reviewComments as Array<{ author: string; body: string; path: string; line: number | null }> | null;

  const typeColor: Record<string, string> = {
    PR_OPENED: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
    PR_SYNCHRONIZE: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
    PR_REOPENED: 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30',
    PRE_MERGE: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  };

  return (
    <div className="rounded-lg border border-border/60 bg-background/50 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={`text-[10px] font-mono px-1.5 py-0 h-5 border-0 ${typeColor[snapshot.evidenceType] ?? ''}`}>{snapshot.evidenceType}</Badge>
          <span className="font-mono text-[11px] text-muted-foreground">{snapshot.headSha.slice(0, 7)}</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">
          {new Date(snapshot.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </span>
      </div>

      <div className="p-3 space-y-3">
        {/* Diff stats */}
        {stats && (stats.additions > 0 || stats.deletions > 0) && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-emerald-400">+{stats.additions}</span>
            <span className="text-rose-400">-{stats.deletions}</span>
            <span className="text-muted-foreground">{stats.changedFiles} file{stats.changedFiles !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Changed files */}
        {files && files.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1.5">
              <FileText className="w-3 h-3" /> Changed Files
            </div>
            <div className="space-y-0.5 max-h-32 overflow-y-auto scrollbar-thin">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between gap-2 text-[11px] font-mono py-0.5 px-1 rounded hover:bg-muted/30">
                  <span className="truncate text-foreground/80">{f.filename}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-emerald-400/70">+{f.additions}</span>
                    <span className="text-rose-400/70">-{f.deletions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Check statuses */}
        {snapshot.checkStatuses.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1.5">
              <CheckCircle2 className="w-3 h-3" /> Checks
            </div>
            <div className="flex flex-wrap gap-1.5">
              {snapshot.checkStatuses.map((c, i) => (
                <div key={i} className="flex items-center gap-1 text-[11px] bg-muted/30 rounded px-1.5 py-0.5">
                  {checkIcon(c.conclusion)}
                  <span className="font-mono text-muted-foreground">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review comments */}
        {reviews && reviews.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1.5">
              <MessageSquare className="w-3 h-3" /> Reviews ({reviews.length})
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin">
              {reviews.map((r, i) => (
                <div key={i} className="rounded bg-muted/20 p-2 text-[11px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-foreground/70">@{r.author}</span>
                    {r.path && <span className="text-muted-foreground/50 font-mono">{r.path}{r.line ? `:${r.line}` : ''}</span>}
                  </div>
                  <div className="text-muted-foreground line-clamp-2">{r.body}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}