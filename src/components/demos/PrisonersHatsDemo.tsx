import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, Play, Users } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

type HatColor = 'Red' | 'Black';

interface Prisoner {
  id: number;
  actualHat: HatColor;
  guessedHat: HatColor | null;
  survived: boolean | null;
}

export const PrisonersHatsDemo: React.FC<Props> = ({ onSolved }) => {
  // 10 prisoners, index 0 is FRONT of line, index 9 is BACK of line (calls first)
  const generatePrisoners = (): Prisoner[] => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1, // 1 is front, 10 is back
      actualHat: Math.random() < 0.5 ? 'Red' : 'Black',
      guessedHat: null,
      survived: null,
    }));
  };

  const [prisoners, setPrisoners] = useState<Prisoner[]>(generatePrisoners);
  const [currentTurn, setCurrentTurn] = useState<number>(9); // starts from 9 (back)
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [solved, setSolved] = useState<boolean>(false);
  const [log, setLog] = useState<string[]>(['Strategy: Prisoner 10 (back) announces RED if even number of red hats in front, BLACK if odd.']);

  // Parity tracking
  // Let Red = 1, Black = 0.
  // When Prisoner 10 speaks, announce Red if count of Red hats in 0..8 is even (sum % 2 === 0).
  const runNextGuess = (state: Prisoner[], turnIdx: number) => {
    const next = [...state];
    const p = next[turnIdx];

    if (turnIdx === 9) {
      // Back prisoner: counts red hats in front (indices 0..8)
      const redCountAhead = next.slice(0, 9).filter(x => x.actualHat === 'Red').length;
      const parityEven = redCountAhead % 2 === 0;
      const guess: HatColor = parityEven ? 'Red' : 'Black';
      p.guessedHat = guess;
      p.survived = guess === p.actualHat;
      setLog(prev => [
        `Prisoner 10 (Back): Saw ${redCountAhead} red hats ahead → called ${guess} (Parity signal). ${p.survived ? 'Survived!' : 'Died (Sacrifice)!'}`
        , ...prev
      ]);
    } else {
      // Subsequent prisoner (turnIdx: 8 down to 0):
      // Initial parity announced by Prisoner 10:
      // Prisoner 10 guess gives whether total reds in 0..8 is even or odd
      const initialParityEven = next[9].guessedHat === 'Red';
      // Reds called by previous prisoners between turnIdx + 1 and 8:
      const redsCalledBehind = next.slice(turnIdx + 1, 9).filter(x => x.guessedHat === 'Red').length;
      // Reds seen ahead by current prisoner in 0 .. turnIdx - 1:
      const redsSeenAhead = next.slice(0, turnIdx).filter(x => x.actualHat === 'Red').length;

      // Current prisoner's hat must balance the initial parity:
      // (redsSeenAhead + myHat + redsCalledBehind) % 2 === (initialParityEven ? 0 : 1)
      const sumOthers = redsSeenAhead + redsCalledBehind;
      const targetParity = initialParityEven ? 0 : 1;
      const myHatIsRed = (sumOthers % 2) !== targetParity;
      const guess: HatColor = myHatIsRed ? 'Red' : 'Black';

      p.guessedHat = guess;
      p.survived = guess === p.actualHat; // mathematically guaranteed 100%!
      setLog(prev => [
        `Prisoner ${p.id}: Calculated my hat must be ${guess} → Saved! ✅`,
        ...prev
      ]);
    }

    return next;
  };

  const handleStep = () => {
    if (currentTurn < 0 || solved) return;
    const nextState = runNextGuess(prisoners, currentTurn);
    setPrisoners(nextState);

    if (currentTurn === 0) {
      setSolved(true);
      const survivors = nextState.filter(p => p.survived).length;
      onSolved(3, survivors);
    } else {
      setCurrentTurn(prev => prev - 1);
    }
  };

  const handleSimulateAll = () => {
    setIsRunning(true);
    let state = [...prisoners];
    let turn = currentTurn;

    const interval = setInterval(() => {
      if (turn < 0) {
        clearInterval(interval);
        setIsRunning(false);
        setSolved(true);
        const survivors = state.filter(p => p.survived).length;
        onSolved(3, survivors);
        return;
      }

      state = runNextGuess(state, turn);
      setPrisoners([...state]);
      turn--;
      setCurrentTurn(turn);
    }, 450);
  };

  const handleReset = () => {
    setPrisoners(generatePrisoners());
    setCurrentTurn(9);
    setIsRunning(false);
    setSolved(false);
    setLog(['Reset line with new random hats.']);
  };

  const survivorsCount = prisoners.filter(p => p.survived === true).length;

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400">Survivors: </span>
            <span className="text-emerald-400 font-mono font-bold text-base">
              {survivorsCount} / 10
            </span>
            <span className="text-xs text-slate-500 ml-1">(Guaranteed &ge; 9)</span>
          </div>
          <div>
            <span className="text-slate-400">Active Speaker: </span>
            <span className="text-cyan-400 font-bold font-mono">
              {currentTurn >= 0 ? `Prisoner ${prisoners[currentTurn].id}` : 'Finished'}
            </span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Hats
        </button>
      </div>

      {/* Prisoners in a line */}
      <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
        <div className="flex items-end justify-between min-w-[540px] gap-2 py-4">
          {/* Reverse display: index 9 (Back, on left) to index 0 (Front, on right) */}
          {[...prisoners].reverse().map(p => {
            const isCurrent = currentTurn === p.id - 1;
            const hasCalled = p.guessedHat !== null;

            return (
              <div
                key={p.id}
                className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-cyan-950/60 border-cyan-400 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                {/* Hat */}
                <div className="text-2xl filter drop-shadow">
                  {p.actualHat === 'Red' ? '🔴' : '⚫'}
                </div>

                {/* Person avatar */}
                <div className="text-xl my-1">
                  {hasCalled ? (p.survived ? '😀' : '💀') : '😐'}
                </div>

                {/* Prisoner ID label */}
                <span className="text-[10px] font-mono text-slate-400 font-bold">
                  P{p.id}
                  {p.id === 10 ? ' (Back)' : p.id === 1 ? ' (Front)' : ''}
                </span>

                {/* Call Badge */}
                <div className="mt-1 h-5 flex items-center">
                  {hasCalled ? (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        p.survived
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {p.guessedHat}
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-600">Waiting</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 px-2 mt-1">
          <span>← Back of line (Speaks first)</span>
          <span>Front of line (Faces forward) →</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 w-full">
        <button
          disabled={isRunning || currentTurn < 0}
          onClick={handleStep}
          className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition"
        >
          Call Next Prisoner
        </button>
        <button
          disabled={isRunning || currentTurn < 0}
          onClick={handleSimulateAll}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <Play className="w-3.5 h-3.5" />
          Simulate Full Line
        </button>
      </div>

      {/* Log */}
      <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-400 max-h-32 overflow-y-auto">
        {log.map((l, i) => (
          <div key={i} className={i === 0 ? 'text-cyan-400 font-semibold' : 'text-slate-500'}>
            › {l}
          </div>
        ))}
      </div>

      {solved && (
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 p-4 rounded-xl text-xs font-medium w-full animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>
            Parity Strategy Success! {survivorsCount}/10 survived. In a line of 100 prisoners, at least 99 are guaranteed to survive!
          </span>
        </div>
      )}
    </div>
  );
};
