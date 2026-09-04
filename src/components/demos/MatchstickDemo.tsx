import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

// 12 matchsticks in a 2x2 grid:
// 6 horizontal sticks, 6 vertical sticks
// Horizontal sticks:
// Row 0 (top): h0_0 (c=0 to 1), h0_1 (c=1 to 2)
// Row 1 (mid): h1_0 (c=0 to 1), h1_1 (c=1 to 2)  <- inner sticks!
// Row 2 (bot): h2_0 (c=0 to 1), h2_1 (c=1 to 2)
// Vertical sticks:
// Col 0 (left): v0_0 (r=0 to 1), v1_0 (r=1 to 2)
// Col 1 (mid):  v0_1 (r=0 to 1), v1_1 (r=1 to 2)  <- inner sticks!
// Col 2 (right):v0_2 (r=0 to 1), v1_2 (r=1 to 2)

const INITIAL_STICKS = [
  'h0_0', 'h0_1',
  'h1_0', 'h1_1',
  'h2_0', 'h2_1',
  'v0_0', 'v1_0',
  'v0_1', 'v1_1',
  'v0_2', 'v1_2',
];

export const MatchstickDemo: React.FC<Props> = ({ onSolved }) => {
  const [activeSticks, setActiveSticks] = useState<string[]>(INITIAL_STICKS);
  const [solved, setSolved] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggleStick = (id: string) => {
    if (solved) return;
    setActiveSticks(prev => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter(x => x !== id);
      } else {
        next = [...prev, id];
      }

      checkSolution(next);
      return next;
    });
  };

  const removedCount = INITIAL_STICKS.length - activeSticks.length;

  const checkSolution = (sticks: string[]) => {
    // Exactly 2 sticks removed
    if (sticks.length !== 10) return;

    // Outer boundary must remain complete:
    // Outer horizontals: h0_0, h0_1, h2_0, h2_1
    // Outer verticals: v0_0, v1_0, v0_2, v1_2
    const outerComplete =
      sticks.includes('h0_0') &&
      sticks.includes('h0_1') &&
      sticks.includes('h2_0') &&
      sticks.includes('h2_1') &&
      sticks.includes('v0_0') &&
      sticks.includes('v1_0') &&
      sticks.includes('v0_2') &&
      sticks.includes('v1_2');

    if (!outerComplete) return;

    // 2 interior sticks removed.
    // Interior sticks are: h1_0, h1_1, v0_1, v1_1
    // A valid 2-square solution leaves one corner intact:
    // Case 1: top-left square intact (has h1_0 and v0_1) -> h1_1 and v1_1 removed!
    // Case 2: top-right intact (has h1_1 and v0_1) -> h1_0 and v1_1 removed!
    // Case 3: bottom-left intact (has h1_0 and v1_1) -> h1_1 and v0_1 removed!
    // Case 4: bottom-right intact (has h1_1 and v1_1) -> h1_0 and v0_1 removed!
    const validPairs = [
      ['h1_1', 'v1_1'],
      ['h1_0', 'v1_1'],
      ['h1_1', 'v0_1'],
      ['h1_0', 'v0_1'],
    ];

    const removed = INITIAL_STICKS.filter(s => !sticks.includes(s));
    const isWin = validPairs.some(pair => pair.every(p => removed.includes(p)));

    if (isWin) {
      setSolved(true);
      setFeedback('Success! 1 large outer 2×2 square and 1 small 1×1 inner square remain = exactly 2 squares of different sizes!');
      onSolved(3, 2);
    }
  };

  const handleAutoSolve = () => {
    // Remove h1_1 and v1_1
    const next = INITIAL_STICKS.filter(s => s !== 'h1_1' && s !== 'v1_1');
    setActiveSticks(next);
    setSolved(true);
    setFeedback('Success! Exactly 2 squares remain: 1 large (2×2) and 1 small (1×1).');
    onSolved(3, 2);
  };

  const handleReset = () => {
    setActiveSticks(INITIAL_STICKS);
    setSolved(false);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400">Matchsticks Removed: </span>
            <span className={`font-mono font-bold text-base ${removedCount === 2 ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {removedCount} / 2
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAutoSolve}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-800/60 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Auto-Solve
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Grid
          </button>
        </div>
      </div>

      {/* SVG Matchstick Grid Canvas */}
      <div className="relative w-full max-w-[340px] aspect-square bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner flex items-center justify-center">
        <svg viewBox="0 0 260 260" className="w-full h-full overflow-visible">
          {/* Coordinates: Grid 2x2, cell size = 100, origin at (30, 30) */}
          {/* Horizontal Sticks */}
          {[
            { id: 'h0_0', x1: 30, y1: 30, x2: 130, y2: 30 },
            { id: 'h0_1', x1: 130, y1: 30, x2: 230, y2: 30 },
            { id: 'h1_0', x1: 30, y1: 130, x2: 130, y2: 130 },
            { id: 'h1_1', x1: 130, y1: 130, x2: 230, y2: 130 },
            { id: 'h2_0', x1: 30, y1: 230, x2: 130, y2: 230 },
            { id: 'h2_1', x1: 130, y1: 230, x2: 230, y2: 230 },
          ].map(h => {
            const isActive = activeSticks.includes(h.id);
            return (
              <g key={h.id} onClick={() => toggleStick(h.id)} className="cursor-pointer">
                {/* Thick hit area */}
                <line x1={h.x1} y1={h.y1} x2={h.x2} y2={h.y2} stroke="transparent" strokeWidth="20" />
                {/* Visual matchstick body */}
                <line
                  x1={h.x1 + 6}
                  y1={h.y1}
                  x2={h.x2 - 6}
                  y2={h.y2}
                  stroke={isActive ? '#f59e0b' : '#334155'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={isActive ? 'none' : '4 4'}
                  className="transition-all duration-200"
                />
                {/* Matchstick red head */}
                {isActive && (
                  <circle cx={h.x1 + 8} cy={h.y1} r="5.5" fill="#ef4444" />
                )}
              </g>
            );
          })}

          {/* Vertical Sticks */}
          {[
            { id: 'v0_0', x1: 30, y1: 30, x2: 30, y2: 130 },
            { id: 'v1_0', x1: 30, y1: 130, x2: 30, y2: 230 },
            { id: 'v0_1', x1: 130, y1: 30, x2: 130, y2: 130 },
            { id: 'v1_1', x1: 130, y1: 130, x2: 130, y2: 230 },
            { id: 'v0_2', x1: 230, y1: 30, x2: 230, y2: 130 },
            { id: 'v1_2', x1: 230, y1: 130, x2: 230, y2: 230 },
          ].map(v => {
            const isActive = activeSticks.includes(v.id);
            return (
              <g key={v.id} onClick={() => toggleStick(v.id)} className="cursor-pointer">
                {/* Thick hit area */}
                <line x1={v.x1} y1={v.y1} x2={v.x2} y2={v.y2} stroke="transparent" strokeWidth="20" />
                {/* Visual matchstick body */}
                <line
                  x1={v.x1}
                  y1={v.y1 + 6}
                  x2={v.x2}
                  y2={v.y2 - 6}
                  stroke={isActive ? '#f59e0b' : '#334155'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={isActive ? 'none' : '4 4'}
                  className="transition-all duration-200"
                />
                {/* Matchstick red head */}
                {isActive && (
                  <circle cx={v.x1} cy={v.y1 + 8} r="5.5" fill="#ef4444" />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="text-xs text-slate-400 text-center">
        Click any matchstick to remove or replace it. Goal: Remove exactly 2 to leave 2 squares of differing sizes.
      </div>

      {feedback && (
        <div className="w-full p-4 rounded-xl border border-emerald-800/80 bg-emerald-950/60 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
};
