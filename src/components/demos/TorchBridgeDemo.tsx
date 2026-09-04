import React, { useState } from 'react';
import { RotateCcw, Award, Flame, ArrowRight, ArrowLeft, CheckCircle2, User } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

interface Person {
  id: string;
  name: string;
  time: number;
  icon: string;
}

const PEOPLE: Person[] = [
  { id: 'p1', name: 'Alice (1m)', time: 1, icon: '🏃‍♀️' },
  { id: 'p2', name: 'Bob (2m)', time: 2, icon: '🚶‍♂️' },
  { id: 'p3', name: 'Charlie (5m)', time: 5, icon: '🚶‍♀️' },
  { id: 'p4', name: 'Dave (10m)', time: 10, icon: '👴' },
];

export const TorchBridgeDemo: React.FC<Props> = ({ onSolved }) => {
  // torchSide: 'start' or 'end'
  const [torchSide, setTorchSide] = useState<'start' | 'end'>('start');
  // who is currently on 'start' or 'end'
  const [startSide, setStartSide] = useState<string[]>(['p1', 'p2', 'p3', 'p4']);
  const [endSide, setEndSide] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [isCrossing, setIsCrossing] = useState<boolean>(false);
  const [solved, setSolved] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>(['Start: All 4 people on start bank with torch.']);

  const toggleSelect = (id: string) => {
    if (isCrossing || solved) return;
    const currentBank = torchSide === 'start' ? startSide : endSide;
    if (!currentBank.includes(id)) return; // must be on same side as torch

    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      if (selectedIds.length >= 2) {
        // max 2 people can cross
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCross = () => {
    if (selectedIds.length === 0 || selectedIds.length > 2 || isCrossing || solved) return;

    setIsCrossing(true);
    const selectedPeople = PEOPLE.filter(p => selectedIds.includes(p.id));
    const stepTime = Math.max(...selectedPeople.map(p => p.time));
    const nextTotalTime = totalTime + stepTime;
    const nextMoves = movesCount + 1;

    setTimeout(() => {
      let nextStart = [...startSide];
      let nextEnd = [...endSide];

      if (torchSide === 'start') {
        nextStart = nextStart.filter(id => !selectedIds.includes(id));
        nextEnd = [...nextEnd, ...selectedIds];
        setTorchSide('end');
      } else {
        nextEnd = nextEnd.filter(id => !selectedIds.includes(id));
        nextStart = [...nextStart, ...selectedIds];
        setTorchSide('start');
      }

      setStartSide(nextStart);
      setEndSide(nextEnd);
      setTotalTime(nextTotalTime);
      setMovesCount(nextMoves);
      setSelectedIds([]);
      setIsCrossing(false);

      const logText = `${torchSide === 'start' ? '→' : '←'} ${selectedPeople
        .map(p => p.name)
        .join(' & ')} crossed in ${stepTime} min (Total: ${nextTotalTime}m)`;
      setHistory(prev => [logText, ...prev].slice(0, 5));

      // Check win: All 4 on end bank
      if (nextEnd.length === 4) {
        setSolved(true);
        const stars = nextTotalTime <= 17 ? 3 : nextTotalTime <= 20 ? 2 : 1;
        onSolved(stars, nextTotalTime);
      }
    }, 600);
  };

  const handleReset = () => {
    setTorchSide('start');
    setStartSide(['p1', 'p2', 'p3', 'p4']);
    setEndSide([]);
    setSelectedIds([]);
    setTotalTime(0);
    setMovesCount(0);
    setIsCrossing(false);
    setSolved(false);
    setHistory(['Reset: All people on start bank.']);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-2xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400">Total Time: </span>
            <span
              className={`font-mono font-bold text-lg ${
                totalTime <= 17 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {totalTime} min
            </span>
            <span className="text-xs text-slate-500 ml-1.5">(Target: &le; 17 min)</span>
          </div>
          <div>
            <span className="text-slate-400">Crossings: </span>
            <span className="text-white font-mono font-bold">{movesCount}</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* River Bridge Simulation Area */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 min-h-[280px]">
        {/* Start Side */}
        <div className="flex flex-col gap-2 p-3 bg-slate-900/90 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Start Bank ({startSide.length})
            </span>
            {torchSide === 'start' && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                Torch Here
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-1 flex-1">
            {PEOPLE.filter(p => startSide.includes(p.id)).map(person => {
              const isSelected = selectedIds.includes(person.id);
              const canSelect = torchSide === 'start' && !isCrossing && !solved;

              return (
                <button
                  key={person.id}
                  disabled={!canSelect}
                  onClick={() => toggleSelect(person.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow'
                      : canSelect
                      ? 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200'
                      : 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{person.icon}</span>
                    <span>{person.name}</span>
                  </div>
                  <span className="font-mono text-amber-300 font-bold">{person.time}m</span>
                </button>
              );
            })}
            {startSide.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-600 italic">
                Bank empty
              </div>
            )}
          </div>
        </div>

        {/* The Suspension Bridge Center */}
        <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 gap-3">
          <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 text-center">
            Suspension Bridge
          </div>
          <div className="text-[10px] text-slate-400 text-center">
            Max 2 travelers. Walk at slower pace.
          </div>

          <div className="py-2">
            {isCrossing ? (
              <div className="flex flex-col items-center gap-2 animate-pulse">
                <span className="text-3xl">🌉 🏃‍♂️🏃‍♀️</span>
                <span className="text-xs text-cyan-400 font-semibold">Crossing in progress...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-2xl opacity-60">
                <span>〰️〰️〰️</span>
              </div>
            )}
          </div>

          <button
            onClick={handleCross}
            disabled={selectedIds.length === 0 || selectedIds.length > 2 || isCrossing || solved}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition ${
              selectedIds.length > 0 && selectedIds.length <= 2
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
            }`}
          >
            {torchSide === 'start' ? (
              <>
                <span>Cross to End Side</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return with Torch</span>
              </>
            )}
          </button>
          <div className="text-[10px] text-slate-400">
            Selected: {selectedIds.length} / 2
          </div>
        </div>

        {/* End Side */}
        <div className="flex flex-col gap-2 p-3 bg-slate-900/90 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              End Bank ({endSide.length})
            </span>
            {torchSide === 'end' && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                Torch Here
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-1 flex-1">
            {PEOPLE.filter(p => endSide.includes(p.id)).map(person => {
              const isSelected = selectedIds.includes(person.id);
              const canSelect = torchSide === 'end' && !isCrossing && !solved;

              return (
                <button
                  key={person.id}
                  disabled={!canSelect}
                  onClick={() => toggleSelect(person.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow'
                      : canSelect
                      ? 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200'
                      : 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{person.icon}</span>
                    <span>{person.name}</span>
                  </div>
                  <span className="font-mono text-amber-300 font-bold">{person.time}m</span>
                </button>
              );
            })}
            {endSide.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-600 italic">
                Bank empty
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Log */}
      <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-400">
        <div className="text-slate-500 uppercase text-[10px] tracking-wider mb-1 font-sans">
          Crossing History
        </div>
        {history.map((h, i) => (
          <div key={i} className={i === 0 ? 'text-cyan-400 font-semibold' : 'text-slate-500'}>
            › {h}
          </div>
        ))}
      </div>

      {solved && (
        <div className="flex items-center gap-3 bg-emerald-950/70 border border-emerald-800 p-4 rounded-xl text-emerald-300 text-sm font-semibold w-full justify-center animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>
            All 4 people safely crossed in {totalTime} minutes!{' '}
            {totalTime <= 17 ? 'Optimal 17-minute solution!' : 'Try reaching 17 minutes for 3 stars!'}
          </span>
        </div>
      )}
    </div>
  );
};
