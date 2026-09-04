import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, Sun, Moon, ArrowUp } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

export const SnailWallDemo: React.FC<Props> = ({ onSolved }) => {
  const [day, setDay] = useState<number>(1);
  const [height, setHeight] = useState<number>(0);
  const [phase, setPhase] = useState<'day' | 'night'>('day');
  const [escaped, setEscaped] = useState<boolean>(false);
  const [userGuess, setUserGuess] = useState<string>('');
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState<boolean>(false);
  const [log, setLog] = useState<string[]>(['Day 1 starts: Snail at bottom (0m).']);

  const handleNextStep = () => {
    if (escaped || solved) return;

    if (phase === 'day') {
      // Climbs +5m
      const nextHeight = Math.min(20, height + 5);
      setHeight(nextHeight);
      setPhase('night');

      if (nextHeight >= 20) {
        setEscaped(true);
        setSolved(true);
        setLog(prev => [`🎉 Day ${day} Daytime: Snail climbed +5m to 20m and ESCAPED!`, ...prev].slice(0, 6));
        onSolved(3, day);
      } else {
        setLog(prev => [`☀️ Day ${day} Daylight: Climbed +5m to ${nextHeight}m.`, ...prev].slice(0, 6));
      }
    } else {
      // Slips -4m at night
      const nextHeight = Math.max(0, height - 4);
      setHeight(nextHeight);
      setDay(prev => prev + 1);
      setPhase('day');
      setLog(prev => [`🌙 Night ${day}: Slipped -4m down to ${nextHeight}m.`, ...prev].slice(0, 6));
    }
  };

  const handleAutoRun = () => {
    let d = 1;
    let h = 0;
    while (h < 20) {
      h += 5;
      if (h >= 20) {
        break;
      }
      h -= 4;
      d++;
    }
    setDay(d);
    setHeight(20);
    setEscaped(true);
    setSolved(true);
    setLog([`Simulated: Snail reaches 20m on Day ${d} daylight and escapes before the night slip!`]);
    onSolved(3, d);
  };

  const handleCheckGuess = () => {
    const num = parseInt(userGuess.trim());
    if (num === 16) {
      setEscaped(true);
      setSolved(true);
      setGuessFeedback('Spot on! On Day 16, the snail starts at 15m and climbs 5m to reach 20m, escaping before nightfall.');
      onSolved(3, 1);
    } else {
      setGuessFeedback(
        num === 20
          ? 'Close, but watch out for the boundary condition! The snail does NOT need to slip on the final day once it reaches the rim!'
          : `Not quite (${num} days). Trace day by day: net +1m per 24h, but when it hits 20m during daytime, it is free!`
      );
    }
  };

  const handleReset = () => {
    setDay(1);
    setHeight(0);
    setPhase('day');
    setEscaped(false);
    setUserGuess('');
    setGuessFeedback(null);
    setSolved(false);
    setLog(['Day 1 starts: Snail at bottom (0m).']);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Time:</span>
            <span className={`flex items-center gap-1 font-bold text-xs px-2.5 py-0.5 rounded border ${
              phase === 'day'
                ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                : 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60'
            }`}>
              {phase === 'day' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
              Day {day} ({phase === 'day' ? 'Daylight Climb' : 'Night Sleep'})
            </span>
          </div>
          <div>
            <span className="text-slate-400">Current Elevation: </span>
            <span className="font-mono font-bold text-cyan-400 text-base">{height}m</span>
            <span className="text-slate-500 text-xs ml-1">/ 20m</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Vertical Wall Simulation */}
      <div className="flex gap-6 items-center justify-center w-full py-2">
        {/* The Wall Tower */}
        <div className="relative w-36 h-[320px] bg-slate-900 border-4 border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-end">
          {/* Wall texture lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_19px,#1e293b_20px)] bg-[size:100%_20px] pointer-events-none opacity-40" />

          {/* Escape line at top */}
          <div className="absolute top-0 w-full bg-emerald-500/20 border-b-2 border-emerald-400/80 h-8 flex items-center justify-center text-[10px] font-bold text-emerald-300">
            🏁 20m Rim (Freedom)
          </div>

          {/* Snail Position Indicator */}
          <div
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-out flex items-center gap-1.5 z-10"
            style={{ bottom: `${(height / 20) * 82 + 4}%` }}
          >
            <span className="text-3xl filter drop-shadow">🐌</span>
            <span className="text-[10px] font-mono font-bold text-white bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-700">
              {height}m
            </span>
          </div>
        </div>

        {/* Height Gauge Ruler */}
        <div className="flex flex-col justify-between h-[320px] py-2 text-xs font-mono text-slate-500">
          <span className="text-emerald-400 font-bold">20m (Goal)</span>
          <span>16m</span>
          <span className="text-amber-400 font-bold">15m (Key Point)</span>
          <span>12m</span>
          <span>8m</span>
          <span>4m</span>
          <span>0m (Bottom)</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 w-full">
        <button
          disabled={escaped}
          onClick={handleNextStep}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          {phase === 'day' ? (
            <>
              <Sun className="w-4 h-4 text-amber-300" />
              <span>Climb Daytime (+5m)</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-300" />
              <span>Night Sleep & Slip (-4m)</span>
            </>
          )}
        </button>

        <button
          disabled={escaped}
          onClick={handleAutoRun}
          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition"
        >
          Simulate to End
        </button>
      </div>

      {/* Direct Guess Box */}
      <div className="flex flex-col gap-2.5 w-full bg-slate-900 border border-slate-800 rounded-xl p-4">
        <span className="text-xs font-semibold text-slate-300">
          Or submit your theoretical answer: On which day does the snail escape?
        </span>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="e.g. 16"
            value={userGuess}
            onChange={e => setUserGuess(e.target.value)}
            className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleCheckGuess}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow transition"
          >
            Submit Answer
          </button>
        </div>

        {guessFeedback && (
          <div className={`mt-1 p-2.5 rounded-lg border text-xs font-medium ${
            solved ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}>
            {guessFeedback}
          </div>
        )}
      </div>

      {/* Simulation Log */}
      <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-400">
        <div className="text-slate-500 uppercase text-[10px] tracking-wider mb-1 font-sans">
          Climb Event Log
        </div>
        {log.map((l, i) => (
          <div key={i} className={i === 0 ? 'text-cyan-400 font-semibold' : 'text-slate-500'}>
            › {l}
          </div>
        ))}
      </div>
    </div>
  );
};
