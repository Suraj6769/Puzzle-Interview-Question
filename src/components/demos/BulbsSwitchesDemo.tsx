import React, { useState } from 'react';
import { Lightbulb, RotateCcw, Clock, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

type SwitchId = 1 | 2 | 3;
type BulbId = 'A' | 'B' | 'C';

export const BulbsSwitchesDemo: React.FC<Props> = ({ onSolved }) => {
  // Random mapping generated per session (e.g. Switch 1 -> Bulb B, Switch 2 -> Bulb A, Switch 3 -> Bulb C)
  const [switchState, setSwitchState] = useState<Record<SwitchId, { on: boolean; wasOnWarm: boolean }>>({
    1: { on: false, wasOnWarm: false },
    2: { on: false, wasOnWarm: false },
    3: { on: false, wasOnWarm: false },
  });

  const [inRoom, setInRoom] = useState<boolean>(false);
  const [minutesWaited, setMinutesWaited] = useState<number>(0);
  const [matches, setMatches] = useState<Record<SwitchId, BulbId | null>>({
    1: null,
    2: null,
    3: null,
  });
  const [attempts, setAttempts] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState<boolean>(false);

  // Hidden ground truth mapping (fixed for stability, Switch 1 -> B, Switch 2 -> A, Switch 3 -> C)
  const trueMapping: Record<SwitchId, BulbId> = {
    1: 'B',
    2: 'A',
    3: 'C',
  };

  const toggleSwitch = (id: SwitchId) => {
    if (inRoom || solved) return;
    setSwitchState(prev => {
      const current = prev[id];
      const willBeOn = !current.on;
      return {
        ...prev,
        [id]: {
          on: willBeOn,
          // if it was on for minutesWaited >= 5, it became warm
          wasOnWarm: current.wasOnWarm || (current.on && minutesWaited >= 5),
        },
      };
    });
  };

  const handleWaitMinutes = () => {
    if (inRoom || solved) return;
    const newMinutes = minutesWaited + 10;
    setMinutesWaited(newMinutes);
    // Mark any switches currently ON as warm
    setSwitchState(prev => ({
      1: { ...prev[1], wasOnWarm: prev[1].wasOnWarm || prev[1].on },
      2: { ...prev[2], wasOnWarm: prev[2].wasOnWarm || prev[2].on },
      3: { ...prev[3], wasOnWarm: prev[3].wasOnWarm || prev[3].on },
    }));
  };

  const handleEnterRoom = () => {
    if (solved) return;
    setInRoom(true);
  };

  // Determine physical state of each bulb
  // BulbId can be ON, OFF_WARM, or OFF_COLD
  const getBulbPhysicalState = (bulb: BulbId) => {
    // find which switch controls this bulb
    const switchId = (Object.keys(trueMapping) as unknown as SwitchId[]).find(
      s => trueMapping[s] === bulb
    );
    if (!switchId) return 'OFF_COLD';
    const sw = switchState[switchId];
    if (sw.on) return 'ON';
    if (sw.wasOnWarm) return 'OFF_WARM';
    return 'OFF_COLD';
  };

  const handleCheck = () => {
    if (!inRoom || solved) return;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Verify all 3
    const isCorrect =
      matches[1] === trueMapping[1] &&
      matches[2] === trueMapping[2] &&
      matches[3] === trueMapping[3];

    if (isCorrect) {
      setSolved(true);
      setFeedback('Brilliant! All 3 switches correctly identified by their physical thermal & light states!');
      const stars = newAttempts === 1 ? 3 : newAttempts === 2 ? 2 : 1;
      onSolved(stars, newAttempts);
    } else {
      setFeedback('Incorrect mapping. Notice the bulb thermal states (bright vs warm vs cold) carefully!');
    }
  };

  const handleReset = () => {
    setSwitchState({
      1: { on: false, wasOnWarm: false },
      2: { on: false, wasOnWarm: false },
      3: { on: false, wasOnWarm: false },
    });
    setInRoom(false);
    setMinutesWaited(0);
    setMatches({ 1: null, 2: null, 3: null });
    setFeedback(null);
    setSolved(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Status Bar */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Current Room:</span>
          <span className={`font-semibold px-2.5 py-0.5 rounded text-xs uppercase tracking-wider ${
            inRoom ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' : 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60'
          }`}>
            {inRoom ? 'Room B (Bulbs - Entered)' : 'Room A (Switches)'}
          </span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Two Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Room A: Switches */}
        <div className={`flex flex-col gap-4 p-5 rounded-2xl border transition-all ${
          inRoom ? 'bg-slate-950/60 border-slate-800/60 opacity-60' : 'bg-slate-900 border-indigo-900/50 shadow-lg'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <span>Room A (Switches)</span>
              {inRoom && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Timer: {minutesWaited} min
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Flip switches and simulate time so bulbs have time to heat up before you enter Room B.
          </p>

          <div className="flex flex-col gap-3 py-2">
            {([1, 2, 3] as SwitchId[]).map(id => (
              <div
                key={id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800"
              >
                <span className="font-bold text-slate-300 text-sm">Switch {id}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold ${switchState[id].on ? 'text-amber-400' : 'text-slate-500'}`}>
                    {switchState[id].on ? 'ON' : 'OFF'}
                  </span>
                  <button
                    disabled={inRoom || solved}
                    onClick={() => toggleSwitch(id)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      switchState[id].on ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
                    } disabled:opacity-50`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!inRoom && (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={handleWaitMinutes}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
              >
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Wait 10 Minutes (Heat up ON bulbs)
              </button>
              <button
                onClick={handleEnterRoom}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition"
              >
                Enter Room B (One-Way)
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Room B: Bulbs */}
        <div className={`flex flex-col gap-4 p-5 rounded-2xl border transition-all ${
          !inRoom ? 'bg-slate-950/60 border-slate-800/60' : 'bg-slate-900 border-amber-900/50 shadow-lg'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 text-sm">Room B (Bulbs)</h3>
            <span className="text-xs text-slate-400">
              {inRoom ? 'Inspecting Bulbs' : 'Door Locked (Must Enter)'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 py-3">
            {(['A', 'B', 'C'] as BulbId[]).map(bulb => {
              const state = inRoom ? getBulbPhysicalState(bulb) : 'LOCKED';
              const isOn = state === 'ON';
              const isWarm = state === 'OFF_WARM';

              return (
                <div
                  key={bulb}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    isOn
                      ? 'bg-amber-950/40 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                      : isWarm
                      ? 'bg-orange-950/30 border-orange-700/60'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-400">Bulb {bulb}</span>
                  <div className="p-3 rounded-full bg-slate-900 relative">
                    <Lightbulb
                      className={`w-8 h-8 transition-colors ${
                        isOn
                          ? 'text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)] animate-pulse'
                          : isWarm
                          ? 'text-amber-600 drop-shadow-[0_0_6px_rgba(217,119,6,0.6)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </div>
                  <div className="text-[10px] text-center font-medium leading-tight">
                    {!inRoom ? (
                      <span className="text-slate-500">???</span>
                    ) : isOn ? (
                      <span className="text-yellow-400 font-bold">ON & Hot</span>
                    ) : isWarm ? (
                      <span className="text-orange-400 font-bold">OFF (Warm)</span>
                    ) : (
                      <span className="text-slate-400">OFF (Cold)</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Match Assignment Selector */}
          {inRoom && (
            <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-300 font-semibold">Match Switch to Bulb:</span>
              {([1, 2, 3] as SwitchId[]).map(s => (
                <div key={s} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Switch {s} controls:</span>
                  <div className="flex gap-1.5">
                    {(['A', 'B', 'C'] as BulbId[]).map(b => (
                      <button
                        key={b}
                        disabled={solved}
                        onClick={() => setMatches(prev => ({ ...prev, [s]: b }))}
                        className={`w-8 h-7 rounded font-bold border transition ${
                          matches[s] === b
                            ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleCheck}
                disabled={solved || !matches[1] || !matches[2] || !matches[3]}
                className="mt-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition"
              >
                Validate Mapping
              </button>
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div className={`w-full p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
          solved ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300' : 'bg-rose-950/60 border-rose-800/80 text-rose-300'
        }`}>
          {solved && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
};
