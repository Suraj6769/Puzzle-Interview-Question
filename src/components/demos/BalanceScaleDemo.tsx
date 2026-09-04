import React, { useState, useEffect } from 'react';
import { RotateCcw, Scale, Award, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

type ScaleResult = 'left-heavier' | 'right-heavier' | 'balanced' | null;

interface WeighingRecord {
  step: number;
  left: number[];
  right: number[];
  result: ScaleResult;
}

export const BalanceScaleDemo: React.FC<Props> = ({ onSolved }) => {
  // 9 coins total (numbered 1 to 9). Exactly 1 is heavier.
  const [fakeCoin, setFakeCoin] = useState<number>(() => Math.floor(Math.random() * 9) + 1);
  const [leftPan, setLeftPan] = useState<number[]>([]);
  const [rightPan, setRightPan] = useState<number[]>([]);
  const [history, setHistory] = useState<WeighingRecord[]>([]);
  const [scaleResult, setScaleResult] = useState<ScaleResult>(null);
  const [selectedGuess, setSelectedGuess] = useState<number | null>(null);
  const [weighingsCount, setWeighingsCount] = useState<number>(0);
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState<boolean>(false);

  const ALL_COINS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleCoinClick = (coin: number) => {
    if (solved) return;
    setGuessFeedback(null);
    setScaleResult(null);

    // If on left pan, remove
    if (leftPan.includes(coin)) {
      setLeftPan(prev => prev.filter(c => c !== coin));
      sound.playMove();
      return;
    }
    // If on right pan, remove
    if (rightPan.includes(coin)) {
      setRightPan(prev => prev.filter(c => c !== coin));
      sound.playMove();
      return;
    }
    // If unassigned, assign to left if left has fewer than right, else right
    if (leftPan.length <= rightPan.length) {
      setLeftPan(prev => [...prev, coin].sort((a, b) => a - b));
    } else {
      setRightPan(prev => [...prev, coin].sort((a, b) => a - b));
    }
    sound.playMove();
  };

  const handleWeigh = () => {
    if (solved) return;
    if (leftPan.length === 0 || rightPan.length === 0) {
      setGuessFeedback('Place at least 1 coin on each pan to weigh.');
      sound.playError();
      return;
    }
    if (leftPan.length !== rightPan.length) {
      setGuessFeedback('For a fair test, both pans must hold the same number of coins!');
      sound.playError();
      return;
    }

    let result: ScaleResult = 'balanced';
    if (leftPan.includes(fakeCoin)) {
      result = 'left-heavier';
    } else if (rightPan.includes(fakeCoin)) {
      result = 'right-heavier';
    } else {
      result = 'balanced';
    }

    setScaleResult(result);
    sound.playClick();

    const nextCount = weighingsCount + 1;
    setWeighingsCount(nextCount);
    setHistory(prev => [
      ...prev,
      {
        step: nextCount,
        left: [...leftPan],
        right: [...rightPan],
        result,
      },
    ]);
  };

  const handleGuessSubmit = () => {
    if (!selectedGuess || solved) return;

    if (selectedGuess === fakeCoin) {
      setSolved(true);
      sound.playSuccess();
      let stars = 1;
      if (weighingsCount <= 2) stars = 3;
      else if (weighingsCount === 3) stars = 2;
      setGuessFeedback(`Correct! Coin #${fakeCoin} is indeed the heavier counterfeit coin!`);
      onSolved(stars, weighingsCount);
    } else {
      sound.playError();
      setGuessFeedback(`Incorrect! Coin #${selectedGuess} has normal weight. Try testing again.`);
    }
  };

  const handleReset = () => {
    setFakeCoin(Math.floor(Math.random() * 9) + 1);
    setLeftPan([]);
    setRightPan([]);
    setHistory([]);
    setScaleResult(null);
    setSelectedGuess(null);
    setWeighingsCount(0);
    setGuessFeedback(null);
    setSolved(false);
    sound.playMove();
  };

  const getUnassignedCoins = () => {
    return ALL_COINS.filter(c => !leftPan.includes(c) && !rightPan.includes(c));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weighings Used</span>
            <div className="text-xl font-bold font-mono text-indigo-400">{weighingsCount} / 2</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Coins</span>
            <div className="text-xl font-bold font-mono text-cyan-400">9 Coins</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Strategy</span>
            <div className="text-xs font-bold text-green-400 uppercase">Ternary Split (3 vs 3)</div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset & New Secret
        </button>
      </div>

      {/* Main Simulation Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col gap-6">
        {/* Scale Visualization */}
        <div className="relative min-h-[220px] flex flex-col justify-between p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-400" />
              Two-Pan Balance Scale
            </span>
            <span className="text-[11px] font-mono">
              Status:{' '}
              {scaleResult === 'left-heavier' && <span className="text-rose-400 font-bold">Left Pan Tilts Down</span>}
              {scaleResult === 'right-heavier' && <span className="text-rose-400 font-bold">Right Pan Tilts Down</span>}
              {scaleResult === 'balanced' && <span className="text-emerald-400 font-bold">Equal / Balanced</span>}
              {!scaleResult && <span className="text-slate-500">Not weighed yet</span>}
            </span>
          </div>

          {/* Graphical Balance Beam */}
          <div className="my-6 relative flex flex-col items-center">
            {/* Fulcrum Stand */}
            <div className="w-4 h-16 bg-slate-700 rounded-t-sm shadow-md" />
            <div className="w-16 h-3 bg-slate-800 rounded-b-md border-t border-slate-600" />

            {/* Tilting Beam (Absolute overlay) */}
            <div
              className={`absolute top-0 w-full max-w-[420px] h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded shadow-md transition-transform duration-500 origin-center ${
                scaleResult === 'left-heavier'
                  ? '-rotate-6'
                  : scaleResult === 'right-heavier'
                  ? 'rotate-6'
                  : 'rotate-0'
              }`}
            >
              {/* Left Plate Hanger */}
              <div className="absolute -left-1 top-2 w-0.5 h-10 bg-slate-500 flex flex-col items-center">
                <div className="absolute top-10 w-24 h-6 bg-slate-800 border-2 border-amber-500/50 rounded-b-xl flex items-center justify-center -translate-x-1/2">
                  <span className="text-[10px] text-amber-400 font-bold">Left ({leftPan.length})</span>
                </div>
              </div>

              {/* Right Plate Hanger */}
              <div className="absolute -right-1 top-2 w-0.5 h-10 bg-slate-500 flex flex-col items-center">
                <div className="absolute top-10 w-24 h-6 bg-slate-800 border-2 border-amber-500/50 rounded-b-xl flex items-center justify-center translate-x-1/2">
                  <span className="text-[10px] text-amber-400 font-bold">Right ({rightPan.length})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Pans Layout */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {/* Left Pan Dropzone */}
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700/80">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Left Pan</span>
                <span className="text-slate-500 font-mono">{leftPan.length} coins</span>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[44px] items-center">
                {leftPan.map(coin => (
                  <button
                    key={coin}
                    onClick={() => handleCoinClick(coin)}
                    className="w-9 h-9 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center justify-center transition shadow-sm"
                  >
                    #{coin}
                  </button>
                ))}
                {leftPan.length === 0 && (
                  <span className="text-[11px] text-slate-600 italic">Click coins below to add here</span>
                )}
              </div>
            </div>

            {/* Right Pan Dropzone */}
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700/80">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Right Pan</span>
                <span className="text-slate-500 font-mono">{rightPan.length} coins</span>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[44px] items-center">
                {rightPan.map(coin => (
                  <button
                    key={coin}
                    onClick={() => handleCoinClick(coin)}
                    className="w-9 h-9 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center justify-center transition shadow-sm"
                  >
                    #{coin}
                  </button>
                ))}
                {rightPan.length === 0 && (
                  <span className="text-[11px] text-slate-600 italic">Click coins below to add here</span>
                )}
              </div>
            </div>
          </div>

          {/* Weigh Action Button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleWeigh}
              disabled={solved || leftPan.length === 0 || rightPan.length === 0}
              className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
            >
              <Scale className="w-4 h-4" />
              Weigh Pans
            </button>
          </div>
        </div>

        {/* Available Unassigned Coins Rack */}
        <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              🪙 Coin Tray (Click to add/remove from scale)
            </span>
            <span className="text-slate-500 text-[10px]">1 of these 9 is secretly heavier</span>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
            {ALL_COINS.map(coin => {
              const inLeft = leftPan.includes(coin);
              const inRight = rightPan.includes(coin);
              const isAssigned = inLeft || inRight;

              return (
                <button
                  key={coin}
                  onClick={() => handleCoinClick(coin)}
                  disabled={solved}
                  className={`w-11 h-11 rounded-full font-mono text-sm font-bold flex flex-col items-center justify-center transition border ${
                    inLeft
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                      : inRight
                      ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                >
                  <span>#{coin}</span>
                  {isAssigned && (
                    <span className="text-[8px] font-sans -mt-0.5 text-slate-400">
                      {inLeft ? 'Left' : 'Right'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accuse & Solve Section */}
        <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-200">Ready to Identify the Counterfeit?</div>
              <div className="text-[11px] text-slate-400">Select the coin you deduced is heavier</div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedGuess ?? ''}
              onChange={e => setSelectedGuess(e.target.value ? parseInt(e.target.value, 10) : null)}
              disabled={solved}
              aria-label="Select Counterfeit Coin"
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-bold focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Coin...</option>
              {ALL_COINS.map(c => (
                <option key={c} value={c}>
                  Coin #{c}
                </option>
              ))}
            </select>

            <button
              onClick={handleGuessSubmit}
              disabled={!selectedGuess || solved}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-bold text-xs text-white transition shadow-sm"
            >
              Verify Deduction
            </button>
          </div>
        </div>

        {/* Guess Feedback Message */}
        {guessFeedback && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              solved
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            {solved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
            <span>{guessFeedback}</span>
          </div>
        )}

        {/* History Log */}
        {history.length > 0 && (
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Weighing History</span>
            <div className="flex flex-col gap-1.5">
              {history.map(item => (
                <div
                  key={item.step}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/40 border border-slate-800 text-[11px] font-mono text-slate-300"
                >
                  <span>
                    Weigh #{item.step}: Left [{item.left.join(', ')}] vs Right [{item.right.join(', ')}]
                  </span>
                  <span
                    className={`font-bold ${
                      item.result === 'balanced'
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {item.result === 'balanced' ? 'Balanced (=)' : item.result === 'left-heavier' ? 'Left Heavier (<)' : 'Right Heavier (>)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
