import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, FlaskConical, Play } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

export const PoisonRatDemo: React.FC<Props> = ({ onSolved }) => {
  // 8 bottles: 0 to 7
  const [poisonBottle, setPoisonBottle] = useState<number>(() => Math.floor(Math.random() * 8));
  const [tested, setTested] = useState<boolean>(false);
  const [selectedGuess, setSelectedGuess] = useState<number | null>(null);
  const [solved, setSolved] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Rats 0, 1, 2
  // Rat 0 drinks if (bottle & 1) !== 0 (Bit 0)
  // Rat 1 drinks if (bottle & 2) !== 0 (Bit 1)
  // Rat 2 drinks if (bottle & 4) !== 0 (Bit 2)
  const rat0Dies = tested && (poisonBottle & 1) !== 0;
  const rat1Dies = tested && (poisonBottle & 2) !== 0;
  const rat2Dies = tested && (poisonBottle & 4) !== 0;

  const handleRunTest = () => {
    setTested(true);
  };

  const handleGuess = (bottle: number) => {
    setSelectedGuess(bottle);
    if (bottle === poisonBottle) {
      setSolved(true);
      setFeedback(`Correct! Binary decode: Rat 2(${rat2Dies ? 1 : 0}) Rat 1(${rat1Dies ? 1 : 0}) Rat 0(${rat0Dies ? 1 : 0}) = Bottle ${poisonBottle}!`);
      onSolved(3, 1);
    } else {
      setFeedback(`Incorrect. Check the bits of dead rats: Rat 2 (4s), Rat 1 (2s), Rat 0 (1s).`);
    }
  };

  const handleReset = () => {
    setPoisonBottle(Math.floor(Math.random() * 8));
    setTested(false);
    setSelectedGuess(null);
    setSolved(false);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Step:</span>
          <span className="text-cyan-400 font-semibold">
            {!tested ? '1. Feed rats based on binary bits' : '2. Decode poisoned bottle from rat status'}
          </span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset / New Bottle
        </button>
      </div>

      {/* 3 Rats Display */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {[
          { id: 2, label: 'Rat 2 (Bit 2 - Value 4)', dead: rat2Dies, drinksFrom: [4, 5, 6, 7] },
          { id: 1, label: 'Rat 1 (Bit 1 - Value 2)', dead: rat1Dies, drinksFrom: [2, 3, 6, 7] },
          { id: 0, label: 'Rat 0 (Bit 0 - Value 1)', dead: rat0Dies, drinksFrom: [1, 3, 5, 7] },
        ].map(r => (
          <div
            key={r.id}
            className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
              r.dead
                ? 'bg-rose-950/40 border-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.25)]'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="text-3xl filter drop-shadow">
              {r.dead ? '💀' : '🐀'}
            </div>
            <span className="text-xs font-bold text-slate-200 mt-2">{r.label}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Drinks: {r.drinksFrom.map(b => `B${b}`).join(', ')}
            </span>
            <div className="mt-2 text-[10px] font-bold uppercase tracking-wider">
              {tested ? (
                r.dead ? (
                  <span className="text-rose-400">Dead (Bit = 1)</span>
                ) : (
                  <span className="text-emerald-400">Alive (Bit = 0)</span>
                )
              ) : (
                <span className="text-slate-500">Untested</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Test Action */}
      {!tested && (
        <button
          onClick={handleRunTest}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <FlaskConical className="w-4 h-4" />
          Administer 24-Hour Test (Binary Feeding)
        </button>
      )}

      {/* 8 Wine Bottles Grid */}
      <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4">
        <span className="text-xs text-slate-300 font-semibold mb-3 block">
          Select which bottle is poisoned (0 to 7):
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {Array.from({ length: 8 }).map((_, b) => {
            const binary = b.toString(2).padStart(3, '0');
            const isSelected = selectedGuess === b;

            return (
              <button
                key={b}
                disabled={!tested || solved}
                onClick={() => handleGuess(b)}
                className={`p-2.5 rounded-xl border flex flex-col items-center transition ${
                  isSelected
                    ? b === poisonBottle
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-rose-950 border-rose-500 text-rose-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                } disabled:opacity-50`}
              >
                <span className="text-xl">🍾</span>
                <span className="text-xs font-bold font-mono mt-1">B{b}</span>
                <span className="text-[10px] font-mono text-slate-500">{binary}</span>
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className={`w-full p-4 rounded-xl border text-xs font-medium flex items-center gap-2 ${
          solved ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300'
        }`}>
          {solved && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
};
