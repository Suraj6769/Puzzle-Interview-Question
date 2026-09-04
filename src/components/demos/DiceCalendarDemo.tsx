import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

export const DiceCalendarDemo: React.FC<Props> = ({ onSolved }) => {
  // 6 faces on Die 1 and 6 faces on Die 2
  const [die1, setDie1] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [die2, setDie2] = useState<number[]>([0, 1, 2, 6, 7, 8]);
  const [solved, setSolved] = useState<boolean>(false);

  // Cycle digit on click
  const cycleDigit = (dieNum: 1 | 2, index: number) => {
    if (solved) return;
    if (dieNum === 1) {
      setDie1(prev => {
        const next = [...prev];
        next[index] = (next[index] + 1) % 10;
        return next;
      });
    } else {
      setDie2(prev => {
        const next = [...prev];
        next[index] = (next[index] + 1) % 10;
        return next;
      });
    }
  };

  // Check if a date (1 to 31) can be formed
  const canFormDate = (d: number): boolean => {
    const tens = Math.floor(d / 10);
    const ones = d % 10;

    // Digits available on die 1 and die 2, counting 6 as also 9 and vice-versa
    const checkMatch = (d1: number, d2: number) => {
      const match1 = (req: number, val: number) => req === val || ((req === 6 || req === 9) && (val === 6 || val === 9));
      return (
        die1.some(f => match1(d1, f)) && die2.some(f => match1(d2, f))
      ) || (
        die1.some(f => match1(d2, f)) && die2.some(f => match1(d1, f))
      );
    };

    return checkMatch(tens, ones);
  };

  // Calculate formable count
  const allDates = Array.from({ length: 31 }, (_, i) => i + 1);
  const formableDates = allDates.filter(canFormDate);
  const isComplete = formableDates.length === 31;

  const handleValidate = () => {
    if (isComplete) {
      setSolved(true);
      onSolved(3, 1);
    }
  };

  const handleResetToBlank = () => {
    setDie1([0, 0, 0, 0, 0, 0]);
    setDie2([1, 1, 1, 1, 1, 1]);
    setSolved(false);
  };

  const handleSetOptimal = () => {
    setDie1([0, 1, 2, 3, 4, 5]);
    setDie2([0, 1, 2, 6, 7, 8]);
    setSolved(true);
    onSolved(3, 1);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400">Coverage: </span>
            <span
              className={`font-mono font-bold text-lg ${
                isComplete ? 'text-emerald-400' : 'text-cyan-400'
              }`}
            >
              {formableDates.length} / 31
            </span>
            <span className="text-xs text-slate-500 ml-1">Dates</span>
          </div>
          <div className="text-[11px] text-amber-400/90 font-medium bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
            Rule: 6 can flip upside-down into 9
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSetOptimal}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-800/60 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Optimal Setup
          </button>
          <button
            onClick={handleResetToBlank}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Two Dice Setup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Die 1 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              🎲 Cube 1 (6 Faces)
            </span>
            <span className="text-[11px] text-slate-500">Click to cycle 0-9</span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {die1.map((digit, idx) => (
              <button
                key={idx}
                onClick={() => cycleDigit(1, idx)}
                className="aspect-square bg-slate-800 hover:bg-cyan-600 hover:text-white rounded-xl border border-slate-700 text-slate-100 font-mono font-bold text-lg flex items-center justify-center transition shadow active:scale-95"
              >
                {digit}
              </button>
            ))}
          </div>
        </div>

        {/* Die 2 */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              🎲 Cube 2 (6 Faces)
            </span>
            <span className="text-[11px] text-slate-500">Click to cycle 0-9</span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {die2.map((digit, idx) => (
              <button
                key={idx}
                onClick={() => cycleDigit(2, idx)}
                className="aspect-square bg-slate-800 hover:bg-cyan-600 hover:text-white rounded-xl border border-slate-700 text-slate-100 font-mono font-bold text-lg flex items-center justify-center transition shadow active:scale-95"
              >
                {digit}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid (01 to 31) */}
      <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-medium">
          <span>Calendar Days (01 to 31) — Green means formable by your current dice:</span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-11 gap-1.5">
          {allDates.map(date => {
            const formable = canFormDate(date);
            const dateStr = date < 10 ? `0${date}` : `${date}`;

            return (
              <div
                key={date}
                className={`py-2 rounded-lg text-center font-mono text-xs font-bold transition-all border ${
                  formable
                    ? 'bg-emerald-950/70 border-emerald-700/80 text-emerald-400 shadow-xs'
                    : 'bg-slate-900/40 border-slate-800 text-slate-600'
                }`}
              >
                {dateStr}
              </div>
            );
          })}
        </div>
      </div>

      {/* Validate Button */}
      <button
        onClick={handleValidate}
        disabled={solved || !isComplete}
        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
      >
        {isComplete ? 'Validate Complete Calendar (31/31)' : `Incomplete: ${formableDates.length} / 31 Dates`}
      </button>

      {solved && (
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 p-4 rounded-xl text-xs font-medium w-full">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>
            Calendar Complete! Cube 1: {'{0, 1, 2, 3, 4, 5}'} and Cube 2: {'{0, 1, 2, 6, 7, 8}'}. Notice that 0, 1, and 2 must appear on both cubes for dates 01-09, 11, and 22, and rotating 6 creates 9!
          </span>
        </div>
      )}
    </div>
  );
};
