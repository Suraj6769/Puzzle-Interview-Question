import React, { useState } from 'react';
import { RotateCcw, Award, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2, Waves } from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

type Item = 'wolf' | 'goat' | 'cabbage';
type Bank = 'left' | 'right';

export const RiverCrossingDemo: React.FC<Props> = ({ onSolved }) => {
  const [leftBank, setLeftBank] = useState<Item[]>(['wolf', 'goat', 'cabbage']);
  const [rightBank, setRightBank] = useState<Item[]>([]);
  const [boatBank, setBoatBank] = useState<Bank>('left');
  const [boatCargo, setBoatCargo] = useState<Item | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [history, setHistory] = useState<{ left: Item[]; right: Item[]; boatBank: Bank; cargo: Item | null }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [solved, setSolved] = useState<boolean>(false);

  const ITEM_ICONS: Record<Item, { icon: string; name: string; desc: string }> = {
    wolf: { icon: '🐺', name: 'Wolf', desc: 'Will eat Goat if left alone' },
    goat: { icon: '🐐', name: 'Goat', desc: 'Will eat Cabbage if left alone' },
    cabbage: { icon: '🥬', name: 'Cabbage', desc: 'Vulnerable to the Goat' },
  };

  const checkDanger = (items: Item[]): string | null => {
    const hasWolf = items.includes('wolf');
    const hasGoat = items.includes('goat');
    const hasCabbage = items.includes('cabbage');

    if (hasWolf && hasGoat) {
      return 'Danger: The Wolf will eat the Goat without the Farmer present!';
    }
    if (hasGoat && hasCabbage) {
      return 'Danger: The Goat will eat the Cabbage without the Farmer present!';
    }
    return null;
  };

  const handleToggleCargo = (item: Item, fromBank: Bank) => {
    if (solved) return;
    setErrorMsg(null);

    if (boatBank !== fromBank) {
      setErrorMsg(`The boat is currently at the ${boatBank} bank!`);
      sound.playError();
      return;
    }

    if (boatCargo === item) {
      // Unload from boat to current bank
      setBoatCargo(null);
      if (boatBank === 'left') {
        setLeftBank(prev => [...prev, item]);
      } else {
        setRightBank(prev => [...prev, item]);
      }
      sound.playMove();
    } else {
      // Loading into boat
      if (boatCargo !== null) {
        setErrorMsg('The boat only has space for the Farmer and 1 item!');
        sound.playError();
        return;
      }
      if (fromBank === 'left') {
        setLeftBank(prev => prev.filter(i => i !== item));
      } else {
        setRightBank(prev => prev.filter(i => i !== item));
      }
      setBoatCargo(item);
      sound.playMove();
    }
  };

  const handleRowBoat = () => {
    if (solved) return;
    setErrorMsg(null);

    // Save history for undo
    setHistory(prev => [...prev, { left: [...leftBank], right: [...rightBank], boatBank, cargo: boatCargo }]);

    const nextBank = boatBank === 'left' ? 'right' : 'left';
    const remainingItemsOnCurrentBank = boatBank === 'left' ? leftBank : rightBank;

    // Check danger on the bank being left behind by the farmer
    const danger = checkDanger(remainingItemsOnCurrentBank);
    if (danger) {
      setErrorMsg(danger);
      sound.playError();
      return;
    }

    const nextMoves = moves + 1;
    setMoves(nextMoves);
    setBoatBank(nextBank);
    sound.playClick();

    // Check victory condition
    // Victory: Wolf, Goat, and Cabbage all on right bank (or in boat at right bank)
    const nextRightBank = nextBank === 'right' && boatCargo ? [...rightBank, boatCargo] : rightBank;
    if (nextRightBank.length === 3 || (nextRightBank.length === 2 && boatCargo && nextBank === 'right')) {
      const allOnRight = ['wolf', 'goat', 'cabbage'].every(
        i => nextRightBank.includes(i as Item) || (nextBank === 'right' && boatCargo === i)
      );

      if (allOnRight) {
        setSolved(true);
        sound.playSuccess();
        let stars = 1;
        if (nextMoves <= 7) stars = 3;
        else if (nextMoves <= 9) stars = 2;
        onSolved(stars, nextMoves);
      }
    }
  };

  const handleReset = () => {
    setLeftBank(['wolf', 'goat', 'cabbage']);
    setRightBank([]);
    setBoatBank('left');
    setBoatCargo(null);
    setMoves(0);
    setHistory([]);
    setErrorMsg(null);
    setSolved(false);
    sound.playMove();
  };

  const handleUndo = () => {
    if (history.length === 0 || solved) return;
    const last = history[history.length - 1];
    setLeftBank(last.left);
    setRightBank(last.right);
    setBoatBank(last.boatBank);
    setBoatCargo(last.cargo);
    setHistory(prev => prev.slice(0, -1));
    setMoves(prev => Math.max(0, prev - 1));
    setErrorMsg(null);
    sound.playMove();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls & Metrics Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Crossings</span>
            <div className="text-xl font-bold font-mono text-indigo-400">{moves}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Optimal Goal</span>
            <div className="text-xl font-bold font-mono text-green-400">7 Moves</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Boat Position</span>
            <div className="text-xs font-bold text-cyan-400 uppercase">{boatBank} Bank</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || solved}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 border border-slate-700 transition"
          >
            Undo
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

      {/* Error / Alert Message */}
      {errorMsg && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs animate-shake">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Interactive River Simulation View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col gap-6 relative overflow-hidden">
        {/* Sky / Environment Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
          <span className="font-semibold text-slate-300 flex items-center gap-2">
            🏞️ River Crossing Simulation
          </span>
          <span className="text-[11px] text-slate-500">
            Rules: Wolf eats Goat; Goat eats Cabbage when Farmer leaves
          </span>
        </div>

        {/* River World Landscape */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-stretch min-h-[280px]">
          {/* Left Bank (2 cols) */}
          <div
            className={`md:col-span-2 rounded-2xl p-4 flex flex-col justify-between border transition-all ${
              boatBank === 'left' ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-800/30 border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Left Bank</span>
                <span className="text-[10px] text-slate-500 font-mono">{leftBank.length} items</span>
              </div>

              <div className="flex flex-col gap-2">
                {leftBank.map(item => (
                  <button
                    key={item}
                    onClick={() => handleToggleCargo(item, 'left')}
                    disabled={boatBank !== 'left' || solved}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-left transition disabled:opacity-50 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{ITEM_ICONS[item].icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition">
                          {ITEM_ICONS[item].name}
                        </div>
                        <div className="text-[10px] text-slate-400">{ITEM_ICONS[item].desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      Load Boat
                    </span>
                  </button>
                ))}
                {leftBank.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-600 italic">Empty Bank</div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>{boatBank === 'left' ? '👨‍🌾 Farmer Present' : 'No Farmer'}</span>
            </div>
          </div>

          {/* River & Boat Area (3 cols) */}
          <div className="md:col-span-3 rounded-2xl p-4 bg-cyan-950/20 border border-cyan-500/20 flex flex-col justify-between relative overflow-hidden">
            {/* Water Wave Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(6,182,212,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Waves className="w-4 h-4 text-cyan-400 animate-pulse" /> River
              </span>
              <span className="text-[10px] text-cyan-500/80 font-mono">Max Capacity: Farmer + 1 item</span>
            </div>

            {/* Boat Element */}
            <div
              className={`my-6 flex flex-col items-center gap-3 p-4 rounded-xl border bg-slate-900/90 shadow-xl transition-all duration-300 relative z-10 ${
                boatBank === 'left' ? 'md:-translate-x-3 border-cyan-500/40' : 'md:translate-x-3 border-cyan-500/40'
              }`}
            >
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                🛶 Rowboat ({boatBank} bank)
              </div>

              {/* Cargo Slot */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300">
                  <span>👨‍🌾</span> Farmer (Driver)
                </div>

                {boatCargo ? (
                  <button
                    onClick={() => handleToggleCargo(boatCargo, boatBank)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/50 hover:bg-indigo-600/40 text-xs font-bold text-indigo-200 transition"
                  >
                    <span>{ITEM_ICONS[boatCargo].icon}</span>
                    <span>{ITEM_ICONS[boatCargo].name}</span>
                    <span className="text-[10px] text-indigo-400 underline ml-1">Unload</span>
                  </button>
                ) : (
                  <div className="px-3 py-1.5 rounded-lg border border-dashed border-slate-700 text-[11px] text-slate-500">
                    Empty Seat
                  </div>
                )}
              </div>

              {/* Row Button */}
              <button
                onClick={handleRowBoat}
                disabled={solved}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
              >
                {boatBank === 'left' ? (
                  <>
                    <span>Row to Right Bank</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Row to Left Bank</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-[10px] text-cyan-400/60 relative z-10">
              Click items on either bank to load/unload
            </div>
          </div>

          {/* Right Bank (2 cols) */}
          <div
            className={`md:col-span-2 rounded-2xl p-4 flex flex-col justify-between border transition-all ${
              boatBank === 'right' ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-slate-800/30 border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Right Bank (Goal)</span>
                <span className="text-[10px] text-slate-500 font-mono">{rightBank.length} items</span>
              </div>

              <div className="flex flex-col gap-2">
                {rightBank.map(item => (
                  <button
                    key={item}
                    onClick={() => handleToggleCargo(item, 'right')}
                    disabled={boatBank !== 'right' || solved}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-left transition disabled:opacity-50 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{ITEM_ICONS[item].icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition">
                          {ITEM_ICONS[item].name}
                        </div>
                        <div className="text-[10px] text-slate-400">{ITEM_ICONS[item].desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      Load Boat
                    </span>
                  </button>
                ))}
                {rightBank.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-600 italic">No items yet</div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>{boatBank === 'right' ? '👨‍🌾 Farmer Present' : 'No Farmer'}</span>
            </div>
          </div>
        </div>

        {/* Victory Banner */}
        {solved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-emerald-300">All Items Safely Transported!</div>
                <div className="text-[11px] text-slate-400">
                  Completed in {moves} moves {moves <= 7 ? '(Optimal 3-Star solution!)' : ''}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(s => (
                <Award
                  key={s}
                  className={`w-5 h-5 ${
                    s <= (moves <= 7 ? 3 : moves <= 9 ? 2 : 1) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
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
