import React, { useState } from 'react';
import { RotateCcw, Award, Play, FastForward, CheckCircle2, DoorClosed, DoorOpen, HelpCircle } from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

export const HundredDoorsDemo: React.FC<Props> = ({ onSolved }) => {
  // 100 doors: false = closed, true = open. Indices 1 to 100.
  const [doors, setDoors] = useState<boolean[]>(() => Array(101).fill(false));
  const [currentPass, setCurrentPass] = useState<number>(0);
  const [selectedDoor, setSelectedDoor] = useState<number | null>(16);
  const [solved, setSolved] = useState<boolean>(false);
  const [userGuess, setUserGuess] = useState<number | null>(null);

  const PERFECT_SQUARES = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100];

  const getFactors = (num: number): number[] => {
    const factors: number[] = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) factors.push(i);
    }
    return factors;
  };

  const handleStepPass = () => {
    if (currentPass >= 100 || solved) return;
    const nextPass = currentPass + 1;

    setDoors(prev => {
      const next = [...prev];
      for (let i = nextPass; i <= 100; i += nextPass) {
        next[i] = !next[i];
      }
      return next;
    });

    setCurrentPass(nextPass);
    sound.playClick();

    if (nextPass === 100) {
      checkCompletion();
    }
  };

  const handleSimulateAll = () => {
    if (solved) return;
    const finalDoors = Array(101).fill(false);
    for (let pass = 1; pass <= 100; pass++) {
      for (let d = pass; d <= 100; d += pass) {
        finalDoors[d] = !finalDoors[d];
      }
    }
    setDoors(finalDoors);
    setCurrentPass(100);
    sound.playSuccess();
    checkCompletion();
  };

  const checkCompletion = () => {
    setSolved(true);
    sound.playSuccess();
    onSolved(3, 1);
  };

  const handleReset = () => {
    setDoors(Array(101).fill(false));
    setCurrentPass(0);
    setSolved(false);
    setUserGuess(null);
    sound.playMove();
  };

  const openCount = doors.filter((isOpen, idx) => idx > 0 && isOpen).length;
  const selectedFactors = selectedDoor ? getFactors(selectedDoor) : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Metrics & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pass Progress</span>
            <div className="text-xl font-bold font-mono text-indigo-400">{currentPass} / 100</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Currently Open</span>
            <div className="text-xl font-bold font-mono text-amber-400">{openCount} Doors</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Final Pattern</span>
            <div className="text-xs font-bold text-cyan-400 uppercase">Perfect Squares</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStepPass}
            disabled={currentPass >= 100}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            Next Pass ({currentPass + 1})
          </button>
          <button
            onClick={handleSimulateAll}
            disabled={currentPass >= 100}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <FastForward className="w-3.5 h-3.5" />
            Fast-Forward 100
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Grid & Inspector Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 10x10 Grid View (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              🚪 100 Doors Matrix
            </span>
            <span className="text-[11px] text-slate-500">
              {currentPass === 0 ? 'All initially closed' : `State after pass ${currentPass}`}
            </span>
          </div>

          <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
            {Array.from({ length: 100 }, (_, i) => i + 1).map(num => {
              const isOpen = doors[num];
              const isSquare = PERFECT_SQUARES.includes(num);
              const isSelected = selectedDoor === num;

              return (
                <button
                  key={num}
                  onClick={() => setSelectedDoor(num)}
                  title={`Door #${num} (${isOpen ? 'Open' : 'Closed'})`}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[11px] font-mono font-bold transition-all relative border ${
                    isSelected
                      ? 'ring-2 ring-indigo-400 shadow-md scale-105 z-10'
                      : ''
                  } ${
                    isOpen
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <span>{num}</span>
                  <span className="text-[8px] opacity-70">
                    {isOpen ? '🔓' : '🔒'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-500/30 border border-amber-500/50" /> Open Door
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-slate-950 border border-slate-800" /> Closed Door
              </span>
            </div>
            <span>Click any door to inspect its factors</span>
          </div>
        </div>

        {/* Factor Inspector & Mathematical Insight (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Factor Inspector
            </div>

            {selectedDoor ? (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-bold text-white">Door #{selectedDoor}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        doors[selectedDoor]
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {doors[selectedDoor] ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Is Perfect Square:{' '}
                    <span className="font-bold text-slate-200">
                      {PERFECT_SQUARES.includes(selectedDoor) ? 'Yes (√' + Math.round(Math.sqrt(selectedDoor)) + ')' : 'No'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Toggled on Passes (Factors)
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {selectedFactors.map(f => (
                      <span
                        key={f}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                          f <= currentPass
                            ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-bold'
                            : 'bg-slate-800/50 border-slate-800 text-slate-600'
                        }`}
                      >
                        Pass {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-indigo-400">Total Factors: </span>
                  {selectedFactors.length} ({selectedFactors.length % 2 === 1 ? 'Odd number' : 'Even number'}).
                  <p className="mt-1 text-[11px] text-slate-400">
                    {selectedFactors.length % 2 === 1
                      ? 'Because it has an ODD number of divisors, it is toggled an odd number of times and ends up OPEN!'
                      : 'Because divisors come in pairs (a × b = n), it is toggled an EVEN number of times and ends up CLOSED!'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic py-8 text-center">
                Click any door in the grid to inspect its factors
              </div>
            )}
          </div>

          {/* Solution Summary */}
          {currentPass === 100 && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                All 100 Passes Complete!
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed">
                Exactly <strong>10 doors</strong> remain open: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
