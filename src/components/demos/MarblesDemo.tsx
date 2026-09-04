import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

export const MarblesDemo: React.FC<Props> = ({ onSolved }) => {
  // Distribution in Jar A
  const [redA, setRedA] = useState<number>(25);
  const [blueA, setBlueA] = useState<number>(25);
  const [solved, setSolved] = useState<boolean>(false);

  // Jar B automatically gets the remaining:
  const redB = 50 - redA;
  const blueB = 50 - blueA;

  const totalA = redA + blueA;
  const totalB = redB + blueB;

  // Probability: 0.5 * (RedA / TotalA) + 0.5 * (RedB / TotalB)
  const pA = totalA > 0 ? redA / totalA : 0;
  const pB = totalB > 0 ? redB / totalB : 0;
  const totalProb = totalA > 0 && totalB > 0 ? 0.5 * pA + 0.5 * pB : 0;
  const probPercent = (totalProb * 100).toFixed(2);

  const checkOptimal = (rA: number, bA: number) => {
    // Optimal is (1, 0) or (49, 50) due to symmetry of jars
    if ((rA === 1 && bA === 0) || (rA === 49 && bA === 50)) {
      if (!solved) {
        setSolved(true);
        onSolved(3, 1);
      }
    }
  };

  const setPreset = (rA: number, bA: number) => {
    setRedA(rA);
    setBlueA(bA);
    checkOptimal(rA, bA);
  };

  const handleReset = () => {
    setRedA(25);
    setBlueA(25);
    setSolved(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner & Probability Meter */}
      <div className="flex flex-col gap-3 w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>P(Drawing Red Marble):</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-mono font-bold text-2xl ${
                parseFloat(probPercent) >= 74 ? 'text-emerald-400' : 'text-cyan-400'
              }`}
            >
              {totalA === 0 || totalB === 0 ? '0.00' : probPercent}%
            </span>
            <span className="text-xs text-slate-500 font-mono">(Max: 74.74%)</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-3.5 overflow-hidden border border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, parseFloat(probPercent)))}%` }}
          />
        </div>

        <div className="text-[11px] text-slate-400 font-mono text-center">
          Formula: 0.5 × ({redA}/{totalA || 1}) + 0.5 × ({redB}/{totalB || 1}) = {probPercent}%
        </div>
      </div>

      {/* Two Jars Interactive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Jar A */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-200 text-sm">🏺 Jar A</span>
            <span className="text-xs text-cyan-400 font-mono font-bold">
              Total: {totalA} marbles
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Red in A */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-rose-400 font-semibold">🔴 Red Marbles: {redA}</span>
                <span className="text-slate-500">{50 - redA} left for Jar B</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={redA}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  setRedA(val);
                  checkOptimal(val, blueA);
                }}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Blue in A */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-sky-400 font-semibold">🔵 Blue Marbles: {blueA}</span>
                <span className="text-slate-500">{50 - blueA} left for Jar B</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={blueA}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  setBlueA(val);
                  checkOptimal(redA, val);
                }}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-center text-xs">
            <span className="text-slate-400">P(Red | Jar A) = </span>
            <span className="text-emerald-400 font-mono font-bold">
              {totalA > 0 ? ((redA / totalA) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        {/* Jar B */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-200 text-sm">🏺 Jar B (Remainder)</span>
            <span className="text-xs text-cyan-400 font-mono font-bold">
              Total: {totalB} marbles
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-rose-400 font-semibold">🔴 Red Marbles:</span>
              <span className="text-sm font-mono font-bold text-white">{redB} / 50</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-sky-400 font-semibold">🔵 Blue Marbles:</span>
              <span className="text-sm font-mono font-bold text-white">{blueB} / 50</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-center text-xs">
            <span className="text-slate-400">P(Red | Jar B) = </span>
            <span className="text-emerald-400 font-mono font-bold">
              {totalB > 0 ? ((redB / totalB) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="flex flex-wrap gap-2 w-full justify-center">
        <button
          onClick={() => setPreset(25, 25)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition"
        >
          Even Split (25/25) → 50%
        </button>
        <button
          onClick={() => setPreset(50, 0)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition"
        >
          All Red in A → 50%
        </button>
        <button
          onClick={() => setPreset(1, 0)}
          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Test Optimal (1 Red in Jar A)
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg border border-slate-700 transition flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {solved && (
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 p-4 rounded-xl text-xs font-medium w-full animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>
            Optimal configuration discovered! 1 Red marble in Jar A yields 100% chance of Red if Jar A is picked. The remaining 49 Red and 50 Blue marbles in Jar B yield 49/99 ≈ 49.49%. Total = 0.5(1) + 0.5(49/99) = 74.74%!
          </span>
        </div>
      )}
    </div>
  );
};
