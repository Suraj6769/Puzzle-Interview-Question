import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

type PegId = 'A' | 'B' | 'C';

export const TowerOfHanoiDemo: React.FC<Props> = ({ onSolved }) => {
  const [numDisks, setNumDisks] = useState<3 | 4>(3);
  const [pegs, setPegs] = useState<Record<PegId, number[]>>({
    A: [3, 2, 1], // larger number = larger disk. Bottom to top.
    B: [],
    C: [],
  });
  const [selectedPeg, setSelectedPeg] = useState<PegId | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [history, setHistory] = useState<Record<PegId, number[]>[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [solved, setSolved] = useState<boolean>(false);

  const minMoves = Math.pow(2, numDisks) - 1;

  const DISK_COLORS: Record<number, { bg: string; border: string; text: string }> = {
    1: { bg: 'from-cyan-500 to-blue-600', border: 'border-cyan-400', text: 'text-cyan-100' },
    2: { bg: 'from-indigo-500 to-violet-600', border: 'border-indigo-400', text: 'text-indigo-100' },
    3: { bg: 'from-fuchsia-500 to-pink-600', border: 'border-fuchsia-400', text: 'text-fuchsia-100' },
    4: { bg: 'from-amber-500 to-rose-600', border: 'border-amber-400', text: 'text-amber-100' },
  };

  const handlePegClick = (pegId: PegId) => {
    if (solved) return;
    setErrorMsg(null);

    // If no peg selected, pick up top disk from this peg
    if (selectedPeg === null) {
      if (pegs[pegId].length === 0) {
        sound.playError();
        return;
      }
      setSelectedPeg(pegId);
      sound.playMove();
      return;
    }

    // If clicking the already selected peg, deselect
    if (selectedPeg === pegId) {
      setSelectedPeg(null);
      sound.playMove();
      return;
    }

    // Move disk from selectedPeg to pegId
    const sourceDisks = pegs[selectedPeg];
    const targetDisks = pegs[pegId];
    const diskToMove = sourceDisks[sourceDisks.length - 1];
    const targetTopDisk = targetDisks.length > 0 ? targetDisks[targetDisks.length - 1] : null;

    // Rule check: larger disk cannot be placed on smaller disk
    if (targetTopDisk !== null && diskToMove > targetTopDisk) {
      setErrorMsg(`Invalid move: Cannot place Disk ${diskToMove} on top of smaller Disk ${targetTopDisk}!`);
      sound.playError();
      return;
    }

    // Save history for undo
    setHistory(prev => [
      ...prev,
      {
        A: [...pegs.A],
        B: [...pegs.B],
        C: [...pegs.C],
      },
    ]);

    const newPegs = {
      ...pegs,
      [selectedPeg]: sourceDisks.slice(0, -1),
      [pegId]: [...targetDisks, diskToMove],
    };

    const nextMoves = moves + 1;
    setPegs(newPegs);
    setSelectedPeg(null);
    setMoves(nextMoves);
    sound.playClick();

    // Check victory condition: all disks on Peg C
    if (newPegs.C.length === numDisks) {
      setSolved(true);
      sound.playSuccess();
      let stars = 1;
      if (nextMoves <= minMoves) stars = 3;
      else if (nextMoves <= minMoves + 4) stars = 2;
      onSolved(stars, nextMoves);
    }
  };

  const handleReset = (disks = numDisks) => {
    const initialDisks = Array.from({ length: disks }, (_, i) => disks - i);
    setPegs({
      A: initialDisks,
      B: [],
      C: [],
    });
    setSelectedPeg(null);
    setMoves(0);
    setHistory([]);
    setErrorMsg(null);
    setSolved(false);
    sound.playMove();
  };

  const handleToggleDiskCount = (count: 3 | 4) => {
    setNumDisks(count);
    handleReset(count);
  };

  const handleUndo = () => {
    if (history.length === 0 || solved) return;
    const last = history[history.length - 1];
    setPegs(last);
    setHistory(prev => prev.slice(0, -1));
    setSelectedPeg(null);
    setMoves(prev => Math.max(0, prev - 1));
    setErrorMsg(null);
    sound.playMove();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Moves Used</span>
            <div className="text-xl font-bold font-mono text-indigo-400">{moves}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Optimal Target</span>
            <div className="text-xl font-bold font-mono text-green-400">{minMoves} Moves</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Disks</span>
            <div className="flex items-center gap-1 mt-0.5">
              {[3, 4].map(d => (
                <button
                  key={d}
                  onClick={() => handleToggleDiskCount(d as 3 | 4)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                    numDisks === d
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {d} Disks
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || solved}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700 transition"
          >
            Undo
          </button>
          <button
            onClick={() => handleReset(numDisks)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Interactive Pegs Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
          <span className="font-semibold text-slate-300 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-indigo-400" />
            Tower of Hanoi Stage
          </span>
          <span className="text-[11px] text-slate-500">
            Click peg to select top disk, then click target peg to transfer
          </span>
        </div>

        {/* Pegs Grid */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 min-h-[260px] items-end pb-2">
          {(['A', 'B', 'C'] as PegId[]).map(pegId => {
            const diskList = pegs[pegId];
            const isSelected = selectedPeg === pegId;

            return (
              <button
                key={pegId}
                onClick={() => handlePegClick(pegId)}
                className={`relative flex flex-col items-center justify-end h-60 rounded-2xl p-3 border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-950/50 hover:bg-slate-800/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Vertical Pole */}
                <div className="absolute top-6 bottom-4 w-3 bg-slate-700 group-hover:bg-slate-600 rounded-full transition" />

                {/* Selected Indicator Glow */}
                {isSelected && (
                  <div className="absolute top-2 text-[10px] uppercase font-bold text-indigo-400 animate-pulse bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    Selected
                  </div>
                )}

                {/* Stack of Disks */}
                <div className="flex flex-col-reverse items-center gap-1.5 w-full relative z-10">
                  {diskList.map((diskSize, idx) => {
                    const isTop = idx === diskList.length - 1;
                    const isTopSelected = isSelected && isTop;
                    const style = DISK_COLORS[diskSize];
                    // Proportional width: disk 1 = 45%, 2 = 62%, 3 = 80%, 4 = 96%
                    const widthPercent = 32 + (diskSize / numDisks) * 64;

                    return (
                      <div
                        key={diskSize}
                        style={{ width: `${widthPercent}%` }}
                        className={`h-7 rounded-lg bg-gradient-to-r ${style.bg} border ${style.border} ${style.text} flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                          isTopSelected ? '-translate-y-4 ring-2 ring-white shadow-indigo-500/50' : ''
                        }`}
                      >
                        Disk {diskSize}
                      </div>
                    );
                  })}
                </div>

                {/* Peg Base Platform */}
                <div className="w-full h-3 bg-slate-800 rounded-lg border-t border-slate-700 mt-2 relative z-10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400">
                    Peg {pegId} {pegId === 'A' ? '(Start)' : pegId === 'C' ? '(Goal)' : '(Aux)'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Victory Card */}
        {solved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-emerald-300">Tower Completed on Peg C!</div>
                <div className="text-[11px] text-slate-400">
                  Solved in {moves} moves (Optimal minimum: {minMoves} moves)
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(s => (
                <Award
                  key={s}
                  className={`w-5 h-5 ${
                    s <= (moves <= minMoves ? 3 : moves <= minMoves + 4 ? 2 : 1)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
