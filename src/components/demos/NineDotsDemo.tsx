import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, Sparkles, Play } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

interface Point {
  x: number;
  y: number;
}

// 3x3 grid in 300x300 viewBox:
// Dot spacing: x = 90, 150, 210. y = 90, 150, 210.
const DOTS = [
  { id: 'd00', x: 90, y: 90, label: '(1,1)' },
  { id: 'd01', x: 150, y: 90, label: '(1,2)' },
  { id: 'd02', x: 210, y: 90, label: '(1,3)' },
  { id: 'd10', x: 90, y: 150, label: '(2,1)' },
  { id: 'd11', x: 150, y: 150, label: '(2,2)' },
  { id: 'd12', x: 210, y: 150, label: '(2,3)' },
  { id: 'd20', x: 90, y: 210, label: '(3,1)' },
  { id: 'd21', x: 150, y: 210, label: '(3,2)' },
  { id: 'd22', x: 210, y: 210, label: '(3,3)' },
];

// Classic "Thinking Outside the Box" Solution Waypoints:
// Start: (90, 210) [bottom-left]
// Line 1: Straight UP through (90, 150), (90, 90), and OUTSIDE THE BOX to (90, 30)!
// Line 2: Diagonal DOWN-RIGHT through (150, 90), (210, 150), and OUTSIDE THE BOX to (270, 210)!
// Line 3: Straight LEFT through (210, 210), (150, 210) to (90, 210)!
// Line 4: Diagonal UP-RIGHT through (150, 150) to (210, 90)!
const SOLUTION_WAYPOINTS: Point[] = [
  { x: 90, y: 210 },  // 0: Start at bottom-left
  { x: 90, y: 30 },   // 1: Line 1 shoots up beyond top-left
  { x: 270, y: 210 }, // 2: Line 2 diagonals down past bottom-right
  { x: 90, y: 210 },  // 3: Line 3 straight left across bottom row
  { x: 210, y: 90 },  // 4: Line 4 diagonals up-right through center
];

export const NineDotsDemo: React.FC<Props> = ({ onSolved }) => {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 to 4
  const [solved, setSolved] = useState<boolean>(false);

  const handleNextLine = () => {
    if (currentStep >= 4) return;
    const next = currentStep + 1;
    setCurrentStep(next);

    if (next === 4) {
      setSolved(true);
      onSolved(3, 4);
    }
  };

  const handleSimulateAll = () => {
    setCurrentStep(4);
    setSolved(true);
    onSolved(3, 4);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSolved(false);
  };

  // Check which dots have been touched by current lines
  const coveredDots = DOTS.filter((_, idx) => {
    if (currentStep >= 1 && [0, 3, 6].includes(idx)) return true; // Left col
    if (currentStep >= 2 && [1, 5].includes(idx)) return true;    // (1,2) and (2,3)
    if (currentStep >= 3 && [6, 7, 8].includes(idx)) return true; // Bottom row
    if (currentStep >= 4 && [4, 2].includes(idx)) return true;    // Center (2,2) and Top-right (1,3)
    return false;
  });

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400">Continuous Lines: </span>
            <span className="text-cyan-400 font-mono font-bold text-base">
              {currentStep} / 4
            </span>
          </div>
          <div>
            <span className="text-slate-400">Dots Covered: </span>
            <span
              className={`font-mono font-bold text-base ${
                coveredDots.length === 9 ? 'text-emerald-400' : 'text-slate-200'
              }`}
            >
              {coveredDots.length} / 9
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSimulateAll}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-800/60 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Full Solution
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* 9-Dots Canvas with Outside-the-Box boundaries */}
      <div className="relative w-full max-w-[340px] aspect-square bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-inner flex items-center justify-center">
        <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
          {/* Implicit 3x3 box boundary (faint dashed border) */}
          <rect
            x="80"
            y="80"
            width="140"
            height="140"
            fill="none"
            stroke="#334155"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text x="150" y="72" textAnchor="middle" fill="#475569" fontSize="9">
            Implicit 3×3 Boundary
          </text>

          {/* Solution Lines Drawn So Far */}
          {Array.from({ length: currentStep }).map((_, i) => {
            const p1 = SOLUTION_WAYPOINTS[i];
            const p2 = SOLUTION_WAYPOINTS[i + 1];

            return (
              <g key={i}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#06b6d4"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                {/* Line number badge */}
                <circle
                  cx={(p1.x + p2.x) / 2}
                  cy={(p1.y + p2.y) / 2}
                  r="8"
                  fill="#0f172a"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                />
                <text
                  x={(p1.x + p2.x) / 2}
                  y={(p1.y + p2.y) / 2 + 3}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* Outside the box points indicators */}
          {currentStep >= 1 && (
            <text x="90" y="24" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold">
              Outside! ↗
            </text>
          )}
          {currentStep >= 2 && (
            <text x="270" y="228" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold">
              Outside! ↘
            </text>
          )}

          {/* 9 Grid Dots */}
          {DOTS.map((dot, idx) => {
            const isCovered = coveredDots.some(d => d.id === dot.id);

            return (
              <g key={dot.id}>
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={isCovered ? 7 : 5}
                  fill={isCovered ? '#10b981' : '#e2e8f0'}
                  stroke={isCovered ? '#ffffff' : '#0f172a'}
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Step Description & Controller */}
      <div className="flex flex-col gap-3 w-full bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="text-xs text-slate-300">
          {currentStep === 0 && 'Ready: Pen starts at bottom-left dot (3,1).'}
          {currentStep === 1 && 'Line 1: Go straight UP through all 3 dots in left column, and EXTEND BEYOND the top of the box!'}
          {currentStep === 2 && 'Line 2: Cut DIAGONALLY down-right through 2 dots, extending beyond the bottom-right corner!'}
          {currentStep === 3 && 'Line 3: Trace straight LEFT across the entire bottom row back to (3,1).'}
          {currentStep === 4 && 'Line 4: Cut DIAGONALLY up-right through center dot (2,2) to finish at top-right dot (1,3)!'}
        </div>

        <button
          onClick={handleNextLine}
          disabled={currentStep >= 4}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <Play className="w-3.5 h-3.5" />
          {currentStep < 4 ? `Draw Line ${currentStep + 1} of 4` : 'All 4 Lines Drawn'}
        </button>
      </div>

      {solved && (
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 p-4 rounded-xl text-xs font-medium w-full animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>
            The Origin of &quot;Thinking Outside the Box&quot;! By extending lines 1 and 2 past the perimeter of the 3×3 square, we create the wider angles necessary to cover all 9 dots in just 4 consecutive strokes!
          </span>
        </div>
      )}
    </div>
  );
};
