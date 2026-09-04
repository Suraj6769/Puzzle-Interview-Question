import React, { useState } from 'react';
import { RotateCcw, Award } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

export const WaterJugDemo: React.FC<Props> = ({ onSolved }) => {
  const [jug4, setJug4] = useState<number>(0);
  const [jug9, setJug9] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [solved, setSolved] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>(['Initial state: (0L, 0L)']);

  const checkWin = (j4: number, j9: number, newMoves: number) => {
    if ((j4 === 6 || j9 === 6) && !solved) {
      setSolved(true);
      let stars = 1;
      if (newMoves <= 6) stars = 3;
      else if (newMoves <= 10) stars = 2;
      onSolved(stars, newMoves);
    }
  };

  const handleAction = (type: string) => {
    if (solved) return;
    let next4 = jug4;
    let next9 = jug9;
    let log = '';

    switch (type) {
      case 'fill4':
        next4 = 4;
        log = 'Filled 4L jug to capacity';
        break;
      case 'empty4':
        next4 = 0;
        log = 'Emptied 4L jug';
        break;
      case 'fill9':
        next9 = 9;
        log = 'Filled 9L jug to capacity';
        break;
      case 'empty9':
        next9 = 0;
        log = 'Emptied 9L jug';
        break;
      case 'pour4to9': {
        const space9 = 9 - jug9;
        const amount = Math.min(jug4, space9);
        next4 = jug4 - amount;
        next9 = jug9 + amount;
        log = `Poured ${amount}L from 4L jug into 9L jug`;
        break;
      }
      case 'pour9to4': {
        const space4 = 4 - jug4;
        const amount = Math.min(jug9, space4);
        next9 = jug9 - amount;
        next4 = jug4 + amount;
        log = `Poured ${amount}L from 9L jug into 4L jug`;
        break;
      }
    }

    if (next4 !== jug4 || next9 !== jug9) {
      const newMoves = moves + 1;
      setJug4(next4);
      setJug9(next9);
      setMoves(newMoves);
      setHistory(prev => [log, ...prev].slice(0, 5));
      checkWin(next4, next9, newMoves);
    }
  };

  const handleReset = () => {
    setJug4(0);
    setJug9(0);
    setMoves(0);
    setSolved(false);
    setHistory(['Reset jugs to (0L, 0L)']);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Target and Stats */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Target:</span>
          <span className="text-indigo-400 font-bold text-base bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-800/60">
            6 Liters
          </span>
          <span className="text-xs text-slate-500 font-medium">(in either jug)</span>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400 uppercase text-[10px] tracking-widest font-bold">Moves: </span>
            <span className="text-white font-mono font-bold text-base">{moves}</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Jugs Display */}
      <div className="flex items-end justify-center gap-12 sm:gap-20 py-6 min-h-[260px] w-full">
        {/* 4L Jug */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            4 Liter Jug
          </div>
          <div
            className="relative w-[80px] h-[160px] rounded-b-2xl border-4 border-slate-600 bg-slate-900/90 overflow-hidden shadow-inner flex flex-col justify-end"
            style={{ borderColor: jug4 === 6 ? '#22c55e' : '#475569' }}
          >
            {/* Water Fill with CSS transition */}
            <div
              className="w-full bg-gradient-to-t from-indigo-700 to-indigo-400 transition-all duration-500 ease-out flex items-center justify-center relative shadow-lg"
              style={{ height: `${(jug4 / 4) * 100}%` }}
            >
              {jug4 > 0 && (
                <span className="text-xs font-bold text-white drop-shadow">
                  {jug4}L
                </span>
              )}
            </div>

            {/* Level markers */}
            {[1, 2, 3].map(level => (
              <div
                key={level}
                className="absolute w-full border-b border-dashed border-slate-700/60 pointer-events-none flex justify-end pr-1 text-[9px] text-slate-500"
                style={{ bottom: `${(level / 4) * 100}%` }}
              >
                {level}L
              </div>
            ))}
          </div>
          <div className="font-mono text-sm font-bold text-indigo-400 mt-1">
            {jug4} / 4 L
          </div>
        </div>

        {/* 9L Jug */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            9 Liter Jug
          </div>
          <div
            className="relative w-[100px] h-[210px] rounded-b-2xl border-4 border-slate-600 bg-slate-900/90 overflow-hidden shadow-inner flex flex-col justify-end"
            style={{ borderColor: jug9 === 6 ? '#22c55e' : '#475569' }}
          >
            {/* Water Fill with CSS transition */}
            <div
              className="w-full bg-gradient-to-t from-indigo-700 to-indigo-400 transition-all duration-500 ease-out flex items-center justify-center relative shadow-lg"
              style={{ height: `${(jug9 / 9) * 100}%` }}
            >
              {jug9 > 0 && (
                <span className="text-xs font-bold text-white drop-shadow">
                  {jug9}L
                </span>
              )}
            </div>

            {/* Level markers */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map(level => (
              <div
                key={level}
                className={`absolute w-full border-b border-dashed pointer-events-none flex justify-end pr-1 text-[9px] ${
                  level === 6 ? 'border-amber-400/70 text-amber-400 font-bold' : 'border-slate-700/60 text-slate-500'
                }`}
                style={{ bottom: `${(level / 9) * 100}%` }}
              >
                {level === 6 ? '★ 6L' : `${level}L`}
              </div>
            ))}
          </div>
          <div className="font-mono text-sm font-bold text-indigo-400 mt-1">
            {jug9} / 9 L
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full">
        <button
          onClick={() => handleAction('fill4')}
          disabled={solved || jug4 === 4}
          className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] disabled:opacity-40 text-slate-300 text-xs font-bold uppercase rounded-xl border border-slate-700 transition-all"
        >
          Fill 4L
        </button>
        <button
          onClick={() => handleAction('empty4')}
          disabled={solved || jug4 === 0}
          className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] disabled:opacity-40 text-slate-300 text-xs font-bold uppercase rounded-xl border border-slate-700 transition-all"
        >
          Empty 4L
        </button>
        <button
          onClick={() => handleAction('pour4to9')}
          disabled={solved || jug4 === 0 || jug9 === 9}
          className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-40 text-white text-xs font-bold uppercase rounded-xl transition-all"
        >
          Pour 4L → 9L
        </button>

        <button
          onClick={() => handleAction('fill9')}
          disabled={solved || jug9 === 9}
          className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] disabled:opacity-40 text-slate-300 text-xs font-bold uppercase rounded-xl border border-slate-700 transition-all"
        >
          Fill 9L
        </button>
        <button
          onClick={() => handleAction('empty9')}
          disabled={solved || jug9 === 0}
          className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] disabled:opacity-40 text-slate-300 text-xs font-bold uppercase rounded-xl border border-slate-700 transition-all"
        >
          Empty 9L
        </button>
        <button
          onClick={() => handleAction('pour9to4')}
          disabled={solved || jug9 === 0 || jug4 === 4}
          className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-40 text-white text-xs font-bold uppercase rounded-xl transition-all"
        >
          Pour 9L → 4L
        </button>
      </div>

      {/* Action Log History */}
      <div className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs font-mono text-slate-400">
        <div className="text-slate-500 uppercase text-[10px] tracking-wider mb-1 font-sans font-bold">Recent Moves</div>
        {history.map((h, i) => (
          <div key={i} className={i === 0 ? 'text-indigo-400 font-semibold' : 'text-slate-500'}>
            › {h}
          </div>
        ))}
      </div>

      {solved && (
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-4 py-2.5 rounded-xl text-sm font-medium animate-bounce">
          <Award className="w-4 h-4" />
          <span>Success! Exactly 6 Liters achieved in {moves} moves.</span>
        </div>
      )}
    </div>
  );
};
