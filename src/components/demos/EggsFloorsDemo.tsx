import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, HelpCircle } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

export const EggsFloorsDemo: React.FC<Props> = ({ onSolved }) => {
  // Secret critical floor between 1 and 100
  const [criticalFloor, setCriticalFloor] = useState<number>(() => Math.floor(Math.random() * 95) + 3);
  const [drops, setDrops] = useState<number>(0);
  const [eggsLeft, setEggsLeft] = useState<number>(2);
  const [highestSafeFloor, setHighestSafeFloor] = useState<number>(0);
  const [lowestBrokenFloor, setLowestBrokenFloor] = useState<number>(101);
  const [solved, setSolved] = useState<boolean>(false);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [lastEvent, setLastEvent] = useState<string>('Select a floor to drop Egg 1');
  const [showHelperSteps, setShowHelperSteps] = useState<boolean>(false);

  const optimalSequence = [14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100];

  const handleDrop = (floor: number) => {
    if (eggsLeft === 0 || solved) return;
    if (floor <= highestSafeFloor || floor >= lowestBrokenFloor) return;

    setSelectedFloor(floor);
    const newDrops = drops + 1;
    setDrops(newDrops);

    if (floor <= criticalFloor) {
      // Egg survives
      setHighestSafeFloor(Math.max(highestSafeFloor, floor));
      setLastEvent(`Egg dropped from Floor ${floor}: ✅ SURVIVED! (Critical floor is ≥ ${floor})`);
      checkIfIdentified(Math.max(highestSafeFloor, floor), lowestBrokenFloor, newDrops);
    } else {
      // Egg breaks
      const nextEggs = eggsLeft - 1;
      setEggsLeft(nextEggs);
      setLowestBrokenFloor(Math.min(lowestBrokenFloor, floor));
      setLastEvent(`Egg dropped from Floor ${floor}: 💥 CRACKED! (Critical floor is < ${floor})`);
      checkIfIdentified(highestSafeFloor, Math.min(lowestBrokenFloor, floor), newDrops);
    }
  };

  const checkIfIdentified = (safe: number, broken: number, currentDrops: number) => {
    // If broken - safe === 1, the critical floor is definitely safe!
    if (broken - safe === 1) {
      setSolved(true);
      const stars = currentDrops <= 14 ? 3 : currentDrops <= 20 ? 2 : 1;
      onSolved(stars, currentDrops);
    }
  };

  const handleGuessSubmit = (floor: number) => {
    if (floor === criticalFloor) {
      setSolved(true);
      const stars = drops <= 14 ? 3 : drops <= 20 ? 2 : 1;
      onSolved(stars, drops);
      setLastEvent(`🎉 Spot on! Critical floor is indeed Floor ${criticalFloor}!`);
    } else {
      setLastEvent(`❌ Floor ${floor} is not the critical floor. Critical is higher or lower.`);
    }
  };

  const handleReset = () => {
    setCriticalFloor(Math.floor(Math.random() * 95) + 3);
    setDrops(0);
    setEggsLeft(2);
    setHighestSafeFloor(0);
    setLowestBrokenFloor(101);
    setSolved(false);
    setSelectedFloor(null);
    setLastEvent('Select a floor to drop Egg 1');
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-2xl mx-auto">
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Eggs:</span>
            <div className="flex gap-1">
              <span className={`text-2xl ${eggsLeft >= 1 ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                {eggsLeft >= 1 ? '🥚' : '💥'}
              </span>
              <span className={`text-2xl ${eggsLeft >= 2 ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                {eggsLeft >= 2 ? '🥚' : '💥'}
              </span>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-slate-800" />
          <div>
            <span className="text-slate-400">Drops Used: </span>
            <span className="text-white font-mono font-bold text-base">{drops}</span>
            <span className="text-slate-500 text-xs ml-1">(&le; 14 is 3★)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHelperSteps(!showHelperSteps)}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 px-2.5 py-1.5 rounded-lg border border-cyan-800/60 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Optimal Drops
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

      {/* Helper sequence banner */}
      {showHelperSteps && (
        <div className="w-full bg-cyan-950/40 border border-cyan-800/60 rounded-xl p-3 text-xs text-cyan-200 animate-in fade-in">
          <div className="font-semibold mb-1">Optimal Drop Sequence (Step decreases by 1 each time):</div>
          <div className="flex flex-wrap gap-1 font-mono">
            {optimalSequence.map((f, i) => (
              <span
                key={f}
                className={`px-1.5 py-0.5 rounded ${
                  highestSafeFloor >= f
                    ? 'bg-emerald-900 text-emerald-300'
                    : lowestBrokenFloor <= f
                    ? 'bg-rose-900 text-rose-300'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                F{f} {i < optimalSequence.length - 1 ? '→' : ''}
              </span>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-cyan-400/80">
            If Egg 1 breaks at Floor N, test floors linearly from (Last Safe + 1) to (N - 1) using Egg 2.
          </p>
        </div>
      )}

      {/* Status banner */}
      <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-center text-slate-300">
        {lastEvent}
      </div>

      {/* Target range indicator */}
      <div className="flex items-center justify-between w-full px-4 text-xs font-medium">
        <span className="text-emerald-400">
          Highest Safe Floor: <strong>{highestSafeFloor}</strong>
        </span>
        <span className="text-slate-400">
          Search Interval: [{highestSafeFloor + 1} ... {lowestBrokenFloor - 1}]
        </span>
        <span className="text-rose-400">
          Lowest Broken Floor: <strong>{lowestBrokenFloor === 101 ? 'None yet' : lowestBrokenFloor}</strong>
        </span>
      </div>

      {/* 100 Floors Grid */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-medium">
          <span>Building Floors (1 to 100) — Click a floor to drop an egg:</span>
          <span className="text-slate-500">Top Floor 100 ↑</span>
        </div>

        <div className="grid grid-cols-10 gap-1.5 max-h-[300px] overflow-y-auto pr-1">
          {Array.from({ length: 100 }, (_, i) => 100 - i).map(floor => {
            const isSafe = floor <= highestSafeFloor;
            const isBroken = floor >= lowestBrokenFloor;
            const isTargetCandidate = floor > highestSafeFloor && floor < lowestBrokenFloor;

            return (
              <button
                key={floor}
                disabled={solved || eggsLeft === 0 || !isTargetCandidate}
                onClick={() => handleDrop(floor)}
                className={`h-9 rounded-lg font-mono text-xs font-semibold flex items-center justify-center transition-all ${
                  isSafe
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800 cursor-default'
                    : isBroken
                    ? 'bg-rose-950/80 text-rose-400 border border-rose-800 cursor-default line-through'
                    : 'bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 border border-slate-700/60 active:scale-95'
                }`}
                title={`Floor ${floor}`}
              >
                {floor}
              </button>
            );
          })}
        </div>
      </div>

      {/* Direct Guess Box when narrowed down */}
      {!solved && lowestBrokenFloor - highestSafeFloor <= 5 && (
        <div className="flex items-center gap-3 bg-slate-900 border border-amber-600/60 rounded-xl p-3 px-5 text-xs text-slate-200">
          <span>Almost there! Conclude critical floor:</span>
          <div className="flex gap-2">
            {Array.from(
              { length: lowestBrokenFloor - highestSafeFloor },
              (_, i) => highestSafeFloor + i
            ).map(f => (
              <button
                key={f}
                onClick={() => handleGuessSubmit(f)}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-md"
              >
                Floor {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {solved && (
        <div className="flex items-center gap-3 bg-emerald-950/70 border border-emerald-800 p-4 rounded-xl text-emerald-300 text-sm font-semibold w-full justify-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>
            Critical Floor Solved! It is Floor {criticalFloor} (Found in {drops} drops).
          </span>
        </div>
      )}
    </div>
  );
};
