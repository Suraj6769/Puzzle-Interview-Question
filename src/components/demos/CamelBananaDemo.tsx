import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, Sparkles, Navigation } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

export const CamelBananaDemo: React.FC<Props> = ({ onSolved }) => {
  const [cp1, setCp1] = useState<number>(200); // Checkpoint 1 (km)
  const [cp2, setCp2] = useState<number>(533); // Checkpoint 2 (km)
  const [solved, setSolved] = useState<boolean>(false);

  // Math simulation:
  // Phase 1: 3000 bananas at km 0 -> cp1.
  // 3 forward trips + 2 return trips = 5 trips per km.
  // Cost per km = 5 bananas.
  // Bananas at cp1 = 3000 - (5 * cp1). Must not exceed 2000 for phase 2.
  const cost1 = 5 * cp1;
  const bananasAtCp1 = Math.max(0, 3000 - cost1);

  // Phase 2: From cp1 to cp2.
  // When starting with <= 2000 bananas, takes 2 forward trips + 1 return trip = 3 trips per km.
  // Cost per km = 3 bananas.
  const dist2 = Math.max(0, cp2 - cp1);
  const cost2 = 3 * dist2;
  const bananasAtCp2 = Math.max(0, bananasAtCp1 - cost2);

  // Phase 3: From cp2 to destination (1000 km).
  // When starting with <= 1000 bananas, takes 1 single forward trip (0 return trips).
  // Cost per km = 1 banana.
  const dist3 = Math.max(0, 1000 - cp2);
  const cost3 = 1 * dist3;
  const bananasDelivered = bananasAtCp2 <= 1000 ? Math.max(0, bananasAtCp2 - cost3) : 0;

  const isOptimal = bananasDelivered >= 533;

  const handleCheck = () => {
    if (isOptimal && !solved) {
      setSolved(true);
      onSolved(3, Math.round(bananasDelivered));
    }
  };

  const handleSetOptimal = () => {
    setCp1(200);
    setCp2(533);
    setSolved(true);
    onSolved(3, 533);
  };

  const handleReset = () => {
    setCp1(100);
    setCp2(400);
    setSolved(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400">Delivered: </span>
            <span
              className={`font-mono font-bold text-xl ${
                isOptimal ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {Math.round(bananasDelivered)}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">/ 533 Bananas (Max)</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSetOptimal}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-800/60 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Set Optimal (533)
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

      {/* Desert Relay Track Visualizer */}
      <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-inner">
        <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
          <span>Point A (0 km)</span>
          <span>Check 1 ({cp1} km)</span>
          <span>Check 2 ({cp2} km)</span>
          <span>Market B (1,000 km)</span>
        </div>

        {/* Desert Track Bar */}
        <div className="relative h-12 bg-amber-950/30 rounded-xl border border-amber-900/50 flex items-center px-4 overflow-hidden">
          {/* Track line */}
          <div className="w-full h-1 bg-amber-800/40 rounded" />

          {/* Point A */}
          <div className="absolute left-2 flex flex-col items-center">
            <span className="text-lg">🌴</span>
          </div>

          {/* Checkpoint 1 marker */}
          <div
            className="absolute -translate-x-1/2 flex flex-col items-center transition-all"
            style={{ left: `${(cp1 / 1000) * 100}%` }}
          >
            <span className="text-xs font-bold text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-cyan-800">
              CP1: {Math.round(bananasAtCp1)} 🍌
            </span>
          </div>

          {/* Checkpoint 2 marker */}
          <div
            className="absolute -translate-x-1/2 flex flex-col items-center transition-all"
            style={{ left: `${(cp2 / 1000) * 100}%` }}
          >
            <span className="text-xs font-bold text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-cyan-800">
              CP2: {Math.round(bananasAtCp2)} 🍌
            </span>
          </div>

          {/* Destination */}
          <div className="absolute right-2 flex flex-col items-center">
            <span className="text-lg">🎪</span>
          </div>
        </div>

        {/* Trip rates explanation */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-[11px] text-center">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Phase 1 (3000 🍌):</span>
            <div className="text-amber-400 font-bold mt-0.5">5 Trips (5 🍌/km)</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Phase 2 (2000 🍌):</span>
            <div className="text-amber-400 font-bold mt-0.5">3 Trips (3 🍌/km)</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Phase 3 (1000 🍌):</span>
            <div className="text-emerald-400 font-bold mt-0.5">1 Trip (1 🍌/km)</div>
          </div>
        </div>
      </div>

      {/* Sliders for Checkpoints */}
      <div className="flex flex-col gap-4 w-full bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-cyan-400 font-semibold">Checkpoint 1 Distance: {cp1} km</span>
            <span className="text-slate-400">Optimal: 200 km (leaves exactly 2,000 bananas)</span>
          </div>
          <input
            type="range"
            min="50"
            max="400"
            value={cp1}
            onChange={e => {
              const val = parseInt(e.target.value);
              setCp1(val);
              if (val >= cp2) setCp2(val + 50);
            }}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-cyan-400 font-semibold">Checkpoint 2 Distance: {cp2} km</span>
            <span className="text-slate-400">Optimal: 533 km (leaves exactly 1,000 bananas)</span>
          </div>
          <input
            type="range"
            min={cp1 + 20}
            max="900"
            value={cp2}
            onChange={e => setCp2(parseInt(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleCheck}
        disabled={solved || !isOptimal}
        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
      >
        {isOptimal ? 'Confirm Maximum Yield (533 Bananas)' : 'Adjust Checkpoints to Reach 533'}
      </button>

      {solved && (
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 p-4 rounded-xl text-xs font-medium w-full animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>
            Optimal transport achieved! At km 200, exactly 2000 bananas remain (reducing trip multiplier from 5 to 3). At km 533.3, exactly 1000 bananas remain (reducing multiplier to 1). Final leg carries 1000 over 466.7 km = 533.3 bananas delivered!
          </span>
        </div>
      )}
    </div>
  );
};
