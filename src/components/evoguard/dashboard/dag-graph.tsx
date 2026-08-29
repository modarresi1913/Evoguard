"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GitMerge, AlertTriangle, Network, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

// ---- Types ----

interface DAGNode {
  prNumber: number;
  prTitle: string | null;
  author: string | null;
  inDegree: number;
  outDegree: number;
}

interface DAGEdge {
  parentPrNumber: number;
  childPrNumber: number;
  sharedFiles: string[];
  fileCount: number;
  satisfied: boolean;
}

interface DAGGraphData {
  repoFullName: string;
  nodes: DAGNode[];
  edges: DAGEdge[];
  hasCycle: boolean;
  totalNodes: number;
  totalEdges: number;
}

// ---- Layout engine: layered topological layout ----

interface LayoutNode {
  prNumber: number;
  x: number;
  y: number;
  layer: number;
  title: string | null;
  inDegree: number;
}

interface LayoutEdge {
  from: LayoutNode;
  to: LayoutNode;
  sharedFiles: string[];
  fileCount: number;
}

const NODE_W = 140;
const NODE_H = 48;
const LAYER_GAP = 100;
const NODE_GAP = 70;
const PADDING = 40;

function computeLayout(graph: DAGGraphData): { nodes: LayoutNode[]; edges: LayoutEdge[]; width: number; height: number } {
  if (graph.nodes.length === 0) {
    return { nodes: [], edges: [], width: 300, height: 100 };
  }

  // Build adjacency
  const outAdj = new Map<number, number[]>();
  const inAdj = new Map<number, number[]>();
  for (const e of graph.edges) {
    const out = outAdj.get(e.parentPrNumber) ?? [];
    out.push(e.childPrNumber);
    outAdj.set(e.parentPrNumber, out);

    const inp = inAdj.get(e.childPrNumber) ?? [];
    inp.push(e.parentPrNumber);
    inAdj.set(e.childPrNumber, inp);
  }

  // Assign layers via Kahn's algorithm (longest path from roots)
  const inDeg = new Map<number, number>();
  for (const n of graph.nodes) inDeg.set(n.prNumber, n.inDegree);

  const layers = new Map<number, number>();
  const queue: number[] = [];

  for (const n of graph.nodes) {
    if ((inDeg.get(n.prNumber) ?? 0) === 0) {
      queue.push(n.prNumber);
      layers.set(n.prNumber, 0);
    }
  }

  while (queue.length > 0) {
    const node = queue.shift()!;
    const currentLayer = layers.get(node) ?? 0;
    for (const child of (outAdj.get(node) ?? [])) {
      const childLayer = layers.get(child) ?? 0;
      layers.set(child, Math.max(childLayer, currentLayer + 1));
      const newDeg = (inDeg.get(child) ?? 1) - 1;
      inDeg.set(child, newDeg);
      if (newDeg === 0) queue.push(child);
    }
  }

  // Handle any unvisited nodes (cycle case)
  for (const n of graph.nodes) {
    if (!layers.has(n.prNumber)) layers.set(n.prNumber, 0);
  }

  // Group by layer
  const layerGroups = new Map<number, number[]>();
  for (const [prNum, layer] of layers) {
    const group = layerGroups.get(layer) ?? [];
    group.push(prNum);
    layerGroups.set(layer, group);
  }

  const maxLayer = Math.max(...Array.from(layers.values()), 0);

  // Compute positions
  const layoutNodes: LayoutNode[] = [];
  const nodeMap = new Map<number, DAGNode>();
  for (const n of graph.nodes) nodeMap.set(n.prNumber, n);

  for (let layer = 0; layer <= maxLayer; layer++) {
    const prNums = layerGroups.get(layer) ?? [];
    const totalWidth = prNums.length * NODE_W + (prNums.length - 1) * NODE_GAP;
    const startX = PADDING + (Math.max(totalWidth, 200) - totalWidth) / 2;

    for (let i = 0; i < prNums.length; i++) {
      const prNum = prNums[i];
      const info = nodeMap.get(prNum);
      layoutNodes.push({
        prNumber: prNum,
        x: startX + i * (NODE_W + NODE_GAP),
        y: PADDING + layer * (NODE_H + LAYER_GAP),
        layer,
        title: info?.prTitle ?? null,
        inDegree: info?.inDegree ?? 0,
      });
    }
  }

  // Build layout edges
  const nodePosMap = new Map<number, LayoutNode>();
  for (const ln of layoutNodes) nodePosMap.set(ln.prNumber, ln);

  const layoutEdges: LayoutEdge[] = [];
  for (const e of graph.edges) {
    const from = nodePosMap.get(e.parentPrNumber);
    const to = nodePosMap.get(e.childPrNumber);
    if (from && to) {
      layoutEdges.push({ from, to, sharedFiles: e.sharedFiles, fileCount: e.fileCount });
    }
  }

  // Compute SVG dimensions
  const maxX = Math.max(...layoutNodes.map((n) => n.x + NODE_W), 200);
  const maxY = Math.max(...layoutNodes.map((n) => n.y + NODE_H), 100);

  return { nodes: layoutNodes, edges: layoutEdges, width: maxX + PADDING, height: maxY + PADDING };
}

// ---- SVG rendering helpers ----

function EdgePath({ edge }: { edge: LayoutEdge }) {
  const x1 = edge.from.x + NODE_W / 2;
  const y1 = edge.from.y + NODE_H;
  const x2 = edge.to.x + NODE_W / 2;
  const y2 = edge.to.y;

  const midY = (y1 + y2) / 2;
  const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="hsl(var(--primary) / 0.3)"
        strokeWidth={1.5}
        className="transition-all duration-200"
      />
      {/* Arrow head */}
      <circle cx={x2} cy={y2} r={3} fill="hsl(var(--primary) / 0.5)" />
      {/* File count label */}
      <text
        x={(x1 + x2) / 2}
        y={midY - 6}
        textAnchor="middle"
        className="fill-muted-foreground/60 text-[9px] font-mono"
      >
        {edge.fileCount}f
      </text>
    </g>
  );
}

function NodeRect({ node, selected, onSelect, hoveredEdge }: {
  node: LayoutNode;
  selected: boolean;
  onSelect: (prNumber: number) => void;
  hoveredEdge: LayoutEdge | null;
}) {
  const isRelated = hoveredEdge && (
    hoveredEdge.from.prNumber === node.prNumber || hoveredEdge.to.prNumber === node.prNumber
  );
  const canMerge = node.inDegree === 0;

  return (
    <g
      className="cursor-pointer transition-all duration-200"
      onClick={() => onSelect(node.prNumber)}
    >
      {/* Node background */}
      <rect
        x={node.x}
        y={node.y}
        width={NODE_W}
        height={NODE_H}
        rx={8}
        className={
          selected
            ? 'fill-primary/15 stroke-primary/60'
            : isRelated
              ? 'fill-primary/10 stroke-primary/40'
              : canMerge
                ? 'fill-emerald-500/10 stroke-emerald-500/30'
                : 'fill-card stroke-border/60'
        }
        strokeWidth={selected ? 2 : 1}
      />
      {/* Status indicator dot */}
      <circle
        cx={node.x + 12}
        cy={node.y + NODE_H / 2}
        r={4}
        className={canMerge ? 'fill-emerald-400' : 'fill-amber-400'}
      />
      {/* PR number */}
      <text
        x={node.x + 22}
        y={node.y + 20}
        className={
          selected ? 'fill-primary text-xs font-mono font-semibold' : 'fill-foreground text-xs font-mono'
        }
      >
        #{node.prNumber}
      </text>
      {/* Title */}
      {node.title && (
        <text
          x={node.x + 22}
          y={node.y + 35}
          className="fill-muted-foreground text-[10px] font-mono"
        >
          {node.title.length > 16 ? node.title.slice(0, 15) + '...' : node.title}
        </text>
      )}
      {/* Shared files count badge */}
      <rect
        x={node.x + NODE_W - 32}
        y={node.y + 6}
        width={26}
        height={16}
        rx={4}
        className="fill-muted/30"
      />
      <text
        x={node.x + NODE_W - 19}
        y={node.y + 17}
        textAnchor="middle"
        className="fill-muted-foreground text-[9px] font-mono"
      >
        {node.inDegree}in
      </text>
    </g>
  );
}

// ---- Main component ----

export function DAGGraphView({ repo }: { repo: string }) {
  const [graph, setGraph] = useState<DAGGraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPr, setSelectedPr] = useState<number | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<LayoutEdge | null>(null);
  const [zoom, setZoom] = useState(1);

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dag?repo=${encodeURIComponent(repo)}&view=graph`);
      const json = await res.json();
      setGraph(json.data ?? null);
    } catch {
      setGraph(null);
    } finally {
      setLoading(false);
    }
  }, [repo]);

  useEffect(() => {
    if (repo) fetchGraph();
  }, [fetchGraph, repo]);

  const layout = graph ? computeLayout(graph) : null;
  const selectedNode = layout?.nodes.find((n) => n.prNumber === selectedPr);
  const selectedEdgeData = selectedPr && graph
      ? graph.edges.filter((e) => e.parentPrNumber === selectedPr || e.childPrNumber === selectedPr)
      : [];

  if (loading) {
    return (
      <Card className="border-border/60 bg-card/40 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Network className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Merge Dependency Graph</span>
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!graph || graph.totalNodes === 0) {
    return null;
  }

  return (
    <Card className="border-primary/30 bg-primary/[0.03] backdrop-blur">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Merge Dependency Graph</span>
            <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0 h-5">
              {graph.totalNodes} PRs · {graph.totalEdges} edges
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {graph.hasCycle && (
              <Badge className="bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30 text-[10px] px-1.5 py-0 h-5 border-0 gap-1">
                <AlertTriangle className="w-3 h-3" /> Cycle detected
              </Badge>
            )}
            <div className="flex items-center gap-0.5 ml-2">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
                className="p-1 rounded hover:bg-muted/30 transition-colors text-muted-foreground hover:text-foreground"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
                className="p-1 rounded hover:bg-muted/30 transition-colors text-muted-foreground hover:text-foreground"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1 rounded hover:bg-muted/30 transition-colors text-muted-foreground hover:text-foreground"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <circle cx={6} cy={6} r={4} className="fill-emerald-400" />
            <span>Can merge now</span>
          </div>
          <div className="flex items-center gap-1.5">
            <circle cx={6} cy={6} r={4} className="fill-amber-400" />
            <span>Blocked</span>
          </div>
          <span className="text-muted-foreground/40">Arrow = must merge before</span>
        </div>

        {/* SVG Graph */}
        {layout && (
          <div className="rounded-lg border border-border/40 bg-background/30 overflow-auto scrollbar-thin">
            <svg
              width={layout.width * zoom}
              height={layout.height * zoom}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              className="min-w-full"
            >
              {/* Edges (rendered first, behind nodes) */}
              {layout.edges.map((edge, i) => (
                <g
                  key={`edge-${i}`}
                  onMouseEnter={() => setHoveredEdge(edge)}
                  onMouseLeave={() => setHoveredEdge(null)}
                  className="cursor-default"
                >
                  <EdgePath edge={edge} />
                </g>
              ))}
              {/* Nodes */}
              {layout.nodes.map((node) => (
                <NodeRect
                  key={node.prNumber}
                  node={node}
                  selected={selectedPr === node.prNumber}
                  onSelect={setSelectedPr}
                  hoveredEdge={hoveredEdge}
                />
              ))}
            </svg>
          </div>
        )}

        {/* Selected PR detail */}
        {selectedNode && (
          <div className="mt-3 rounded-lg border border-border/40 bg-background/50 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GitMerge className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-mono font-semibold">#{selectedNode.prNumber}</span>
                {selectedNode.title && (
                  <span className="text-xs text-muted-foreground">{selectedNode.title}</span>
                )}
              </div>
              <button
                onClick={() => setSelectedPr(null)}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
            {selectedEdgeData.length > 0 && (
              <div className="space-y-1.5">
                {selectedEdgeData.map((e, i) => {
                  const otherPr = e.parentPrNumber === selectedPr ? e.childPrNumber : e.parentPrNumber;
                  const direction = e.parentPrNumber === selectedPr ? 'must merge before' : 'blocked by';
                  return (
                    <div key={i} className="flex items-center justify-between text-[11px] bg-muted/20 rounded px-2 py-1.5">
                      <span className="font-mono text-foreground/80">
                        <span className="text-primary">#{selectedPr}</span>
                        <span className="text-muted-foreground mx-1">{direction}</span>
                        <span className="text-primary">#{otherPr}</span>
                      </span>
                      <span className="text-muted-foreground font-mono">
                        {e.fileCount} shared file{e.fileCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  );
                })}
                {/* Shared files list */}
                {selectedEdgeData.length > 0 && (
                  <div className="mt-2 space-y-0.5">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Shared files</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.from(new Set(selectedEdgeData.flatMap((e) => e.sharedFiles))).map((f, i) => (
                        <code key={i} className="text-[10px] font-mono bg-muted/30 px-1.5 py-0.5 rounded text-muted-foreground">
                          {f.split('/').pop()}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
