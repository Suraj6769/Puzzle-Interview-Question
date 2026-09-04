import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

// 10 nodes of a regular pentagram:
// 5 outer points (tips) + 5 inner intersection points
// The 5 lines in a pentagram connecting points (each line has 2 outer tips and 2 inner intersections = 4 nodes):
// Let's define the 10 nodes coordinates in a 300x300 viewBox:
// Center (150, 150)
// Outer radius R = 110, Inner radius r = R * (3 - sqrt(5)) / 2 approx 42
const CX = 150;
const CY = 150;
const R_OUTER = 115;
const R_INNER = 45;

// Generate 5 outer points at angles -90, -90 + 72, -90 + 144, ...
const OUTER_POINTS = [0, 1, 2, 3, 4].map(i => {
  const angle = ((-90 + i * 72) * Math.PI) / 180;
  return {
    id: `outer_${i}`,
    label: `Outer ${i + 1}`,
    x: CX + R_OUTER * Math.cos(angle),
    y: CY + R_OUTER * Math.sin(angle),
  };
});

// Inner points are rotated by 36 degrees
const INNER_POINTS = [0, 1, 2, 3, 4].map(i => {
  const angle = ((-90 + 36 + i * 72) * Math.PI) / 180;
  return {
    id: `inner_${i}`,
    label: `Inner ${i + 1}`,
    x: CX + R_INNER * Math.cos(angle),
    y: CY + R_INNER * Math.sin(angle),
  };
});

const ALL_NODES = [...OUTER_POINTS, ...INNER_POINTS];

// The 5 straight lines of a pentagram:
// Line 0: outer_0 -> inner_1 -> inner_4 -> outer_2 (connects outer_0 to outer_2)
// Line 1: outer_1 -> inner_2 -> inner_0 -> outer_3 (connects outer_1 to outer_3)
// Line 2: outer_2 -> inner_3 -> inner_1 -> outer_4 (connects outer_2 to outer_4)
// Line 3: outer_3 -> inner_4 -> inner_2 -> outer_0 (connects outer_3 to outer_0)
// Line 4: outer_4 -> inner_0 -> inner_3 -> outer_1 (connects outer_4 to outer_1)
const LINES = [
  { id: 0, start: OUTER_POINTS[0], end: OUTER_POINTS[2], nodes: ['outer_0', 'inner_1', 'inner_4', 'outer_2'] },
  { id: 1, start: OUTER_POINTS[1], end: OUTER_POINTS[3], nodes: ['outer_1', 'inner_2', 'inner_0', 'outer_3'] },
  { id: 2, start: OUTER_POINTS[2], end: OUTER_POINTS[4], nodes: ['outer_2', 'inner_3', 'inner_1', 'outer_4'] },
  { id: 3, start: OUTER_POINTS[3], end: OUTER_POINTS[0], nodes: ['outer_3', 'inner_4', 'inner_2', 'outer_0'] },
  { id: 4, start: OUTER_POINTS[4], end: OUTER_POINTS[1], nodes: ['outer_4', 'inner_0', 'inner_3', 'outer_1'] },
];

export const BallsLinesDemo: React.FC<Props> = ({ onSolved }) => {
  // Set of node ids with balls placed
  const [placedNodes, setPlacedNodes] = useState<string[]>([]);
  const [solved, setSolved] = useState<boolean>(false);

  const toggleNode = (id: string) => {
    if (solved) return;
    setPlacedNodes(prev => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter(x => x !== id);
      } else {
        if (prev.length >= 10) return prev;
        next = [...prev, id];
      }

      // Check win condition: all 10 nodes have balls AND all 5 lines have 4 balls
      const linesValid = LINES.every(line => {
        const count = line.nodes.filter(nid => next.includes(nid)).length;
        return count === 4;
      });

      if (next.length === 10 && linesValid) {
        setSolved(true);
        onSolved(3, 10);
      }

      return next;
    });
  };

  const handlePlaceAll = () => {
    const all = ALL_NODES.map(n => n.id);
    setPlacedNodes(all);
    setSolved(true);
    onSolved(3, 10);
  };

  const handleReset = () => {
    setPlacedNodes([]);
    setSolved(false);
  };

  // Count balls on each line
  const lineStats = LINES.map(line => {
    const count = line.nodes.filter(nid => placedNodes.includes(nid)).length;
    return { id: line.id, count, isComplete: count === 4 };
  });

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400">Balls Placed: </span>
            <span className="text-cyan-400 font-mono font-bold text-base">
              {placedNodes.length} / 10
            </span>
          </div>
          <div>
            <span className="text-slate-400">Valid Lines (4 Balls): </span>
            <span
              className={`font-mono font-bold text-base ${
                lineStats.filter(l => l.isComplete).length === 5 ? 'text-emerald-400' : 'text-slate-200'
              }`}
            >
              {lineStats.filter(l => l.isComplete).length} / 5
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePlaceAll}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-800/60 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Auto-Solve (Star)
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Interactive Pentagram Canvas */}
      <div className="relative w-full max-w-[360px] aspect-square bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-inner flex items-center justify-center">
        <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
          {/* 5 Straight Lines */}
          {LINES.map(line => {
            const has4 = line.nodes.filter(nid => placedNodes.includes(nid)).length === 4;
            return (
              <line
                key={line.id}
                x1={line.start.x}
                y1={line.start.y}
                x2={line.end.x}
                y2={line.end.y}
                stroke={has4 ? '#10b981' : '#334155'}
                strokeWidth={has4 ? 4 : 2.5}
                className="transition-colors duration-300"
              />
            );
          })}

          {/* 10 Intersection / Vertex Nodes */}
          {ALL_NODES.map(node => {
            const isPlaced = placedNodes.includes(node.id);
            return (
              <g key={node.id} onClick={() => toggleNode(node.id)} className="cursor-pointer">
                {/* Click target hit area */}
                <circle cx={node.x} cy={node.y} r="18" fill="transparent" />

                {/* Node circle outline */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isPlaced ? 12 : 9}
                  fill={isPlaced ? '#06b6d4' : '#1e293b'}
                  stroke={isPlaced ? '#ffffff' : '#64748b'}
                  strokeWidth={isPlaced ? 2.5 : 2}
                  className="transition-all duration-200"
                />

                {isPlaced && (
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="10"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    ⚪
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Line Progress Status */}
      <div className="grid grid-cols-5 gap-2 w-full">
        {lineStats.map((l, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl border text-center text-xs transition ${
              l.isComplete
                ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <div className="text-[10px] text-slate-500 uppercase">Line {i + 1}</div>
            <div className="font-mono font-bold text-sm mt-0.5">{l.count} / 4</div>
          </div>
        ))}
      </div>

      {solved && (
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 p-4 rounded-xl text-xs font-medium w-full animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>
            Geometric Elegance! A 5-pointed star (pentagram) has 5 continuous straight lines and 10 intersection vertices (5 outer points + 5 inner intersections). Each straight line passes through exactly 4 vertices!
          </span>
        </div>
      )}
    </div>
  );
};
