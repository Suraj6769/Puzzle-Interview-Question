import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, Scissors, Layers } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

export const CakeCutsDemo: React.FC<Props> = ({ onSolved }) => {
  const [cutVertical1, setCutVertical1] = useState<boolean>(false);
  const [cutVertical2, setCutVertical2] = useState<boolean>(false);
  const [cutHorizontal, setCutHorizontal] = useState<boolean>(false);
  const [exploded, setExploded] = useState<boolean>(false);
  const [solved, setSolved] = useState<boolean>(false);

  // Compute pieces:
  // Initial: 1
  // + Vert1: 2
  // + Vert2: 4
  // + Horiz: x2 (so 4*2 = 8, or 2*2 = 4, etc.)
  let pieces = 1;
  if (cutVertical1 && !cutVertical2) pieces = 2;
  if (!cutVertical1 && cutVertical2) pieces = 2;
  if (cutVertical1 && cutVertical2) pieces = 4;
  if (cutHorizontal) pieces = pieces * 2;

  const handleCheck = () => {
    if (cutVertical1 && cutVertical2 && cutHorizontal) {
      setSolved(true);
      setExploded(true);
      onSolved(3, 3);
    }
  };

  const handleReset = () => {
    setCutVertical1(false);
    setCutVertical2(false);
    setCutHorizontal(false);
    setExploded(false);
    setSolved(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400">Total Pieces: </span>
            <span className={`font-mono font-bold text-xl ${pieces === 8 ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {pieces}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">(Target: 8 equal pieces)</span>
          </div>
          <div>
            <span className="text-slate-400">Cuts Used: </span>
            <span className="text-white font-mono font-bold">
              {[cutVertical1, cutVertical2, cutHorizontal].filter(Boolean).length} / 3
            </span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Cake
        </button>
      </div>

      {/* Visual Cake Container */}
      <div className="relative w-full max-w-[340px] aspect-square flex flex-col items-center justify-center bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner">
        {/* Cake Base */}
        <div className="relative w-52 h-52 rounded-full border-4 border-amber-600/80 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Cake Frosting Layer */}
          <div className="absolute inset-2 rounded-full border border-amber-500/30 bg-amber-900/60" />

          {/* Strawberry decorations */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="absolute -top-1 text-base">🍓</span>
            <span className="absolute -bottom-1 text-base">🍓</span>
            <span className="absolute -left-1 text-base">🍓</span>
            <span className="absolute -right-1 text-base">🍓</span>
          </div>

          {/* Cut 1 (Vertical Line) */}
          {cutVertical1 && (
            <div className="absolute w-1 h-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] z-10" />
          )}

          {/* Cut 2 (Perpendicular Horizontal on Top) */}
          {cutVertical2 && (
            <div className="absolute h-1 w-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] z-10" />
          )}

          {/* Cut 3 (3D Horizontal Slice / Layer Indicator) */}
          {cutHorizontal && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="w-full border-2 border-dashed border-emerald-400/90 bg-emerald-500/10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold text-emerald-300">
                ↕ Horizontal Equatorial Slice (2 Layers)
              </div>
            </div>
          )}

          {/* Exploded / Separated Pieces View */}
          {exploded && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center text-center p-3 z-30">
              <div className="text-emerald-400 font-bold text-xs">
                8 Equal Pieces!
                <div className="text-[10px] text-slate-300 font-normal mt-1">
                  4 Top Quadrants + 4 Bottom Quadrants
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3D Side Profile Badge */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>3D Slice Mode: {cutHorizontal ? 'Split into 2 Layers' : 'Single Layer'}</span>
        </div>
      </div>

      {/* Knife Cut Action Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        <button
          onClick={() => setCutVertical1(!cutVertical1)}
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
            cutVertical1
              ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Cut 1: Vertical Slice (12-6)</span>
        </button>

        <button
          onClick={() => setCutVertical2(!cutVertical2)}
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
            cutVertical2
              ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Cut 2: Vertical Slice (9-3)</span>
        </button>

        <button
          onClick={() => setCutHorizontal(!cutHorizontal)}
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
            cutHorizontal
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Cut 3: Horizontal Layer Cut</span>
        </button>
      </div>

      {/* Validation */}
      <button
        onClick={handleCheck}
        disabled={solved || pieces !== 8}
        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
      >
        {pieces === 8 ? 'Confirm 8 Equal Pieces' : `Currently ${pieces} / 8 Pieces`}
      </button>

      {solved && (
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-4 py-3 rounded-xl text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            Brilliant 3D insight! 2 vertical planar cuts yield 4 quadrants; 1 horizontal planar cut doubles each quadrant to produce exactly 8 equal cylindrical wedge pieces!
          </span>
        </div>
      )}
    </div>
  );
};
