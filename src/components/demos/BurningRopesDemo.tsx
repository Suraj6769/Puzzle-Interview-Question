import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Flame, Play, Pause, CheckCircle2, Clock, AlertTriangle, Award } from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

export const BurningRopesDemo: React.FC<Props> = ({ onSolved }) => {
  // Rope 1 burning from Left (1A) and Right (1B)
  const [lit1A, setLit1A] = useState<boolean>(false);
  const [lit1B, setLit1B] = useState<boolean>(false);
  // Rope 2 burning from Left (2A) and Right (2B)
  const [lit2A, setLit2A] = useState<boolean>(false);
  const [lit2B, setLit2B] = useState<boolean>(false);

  // Time in virtual minutes (0 to 60)
  const [simMinutes, setSimMinutes] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1); // 1x or 2x
  const [solved, setSolved] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Burn progress percentages (0 to 100)
  const [rope1Burn, setRope1Burn] = useState<number>(0);
  const [rope2Burn, setRope2Burn] = useState<number>(0);

  // Keep track of state transitions
  const rope1FinishedAt = useRef<number | null>(null);
  const rope2FinishedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning || solved) return;

    const interval = setInterval(() => {
      setSimMinutes(prev => {
        const nextMin = +(prev + 0.25 * speedMultiplier).toFixed(2);

        // Update Rope 1 burn progress
        // If 1 end lit: burns at 100% in 60 mins -> ~1.667% per minute
        // If 2 ends lit: burns at 100% in 30 mins -> ~3.333% per minute
        const ends1 = (lit1A ? 1 : 0) + (lit1B ? 1 : 0);
        let currentR1 = 0;
        setRope1Burn(r1 => {
          if (r1 >= 100) return 100;
          const delta1 = ends1 * 1.667 * 0.25 * speedMultiplier;
          const nextR1 = Math.min(100, +(r1 + delta1).toFixed(2));
          if (nextR1 >= 100 && rope1FinishedAt.current === null) {
            rope1FinishedAt.current = nextMin;
            sound.playHint();
          }
          currentR1 = nextR1;
          return nextR1;
        });

        // Update Rope 2 burn progress
        const ends2 = (lit2A ? 1 : 0) + (lit2B ? 1 : 0);
        setRope2Burn(r2 => {
          if (r2 >= 100) return 100;
          const delta2 = ends2 * 1.667 * 0.25 * speedMultiplier;
          const nextR2 = Math.min(100, +(r2 + delta2).toFixed(2));
          if (nextR2 >= 100 && rope2FinishedAt.current === null) {
            rope2FinishedAt.current = nextMin;
            sound.playHint();
          }
          return nextR2;
        });

        // If both ropes completely burned out, stop simulation
        if (currentR1 >= 100 && rope2Burn >= 100) {
          setIsRunning(false);
        }

        return nextMin;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, speedMultiplier, lit1A, lit1B, lit2A, lit2B, rope2Burn, solved]);

  const handleLightEnd = (rope: 1 | 2, end: 'A' | 'B') => {
    if (solved) return;
    sound.playClick();
    if (rope === 1) {
      if (end === 'A') setLit1A(true);
      if (end === 'B') setLit1B(true);
    } else {
      if (end === 'A') setLit2A(true);
      if (end === 'B') setLit2B(true);
    }
    // Auto-start simulation if not started
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const handleCheckTiming = () => {
    if (solved) return;

    // Check if the classic strategy was followed:
    // Rope 1 lit at both ends initially
    // Rope 2 lit at 1 end initially, then second end lit around minute 30
    // And both ropes are now extinguished at minute ~45 (within tolerance 43 - 47)
    if (rope1Burn >= 99 && rope2Burn >= 99) {
      if (simMinutes >= 43 && simMinutes <= 47) {
        setSolved(true);
        setIsRunning(false);
        sound.playSuccess();
        setFeedback(`Brilliant! Both ropes finished burning in exactly ${simMinutes.toFixed(0)} virtual minutes!`);
        onSolved(3, 1);
        return;
      }
    }

    if (simMinutes < 30) {
      setFeedback(`Only ${simMinutes.toFixed(1)} minutes have passed. Keep observing the burn rate!`);
      sound.playError();
    } else if (rope2Burn < 95) {
      setFeedback(`Rope 2 is still burning (${rope2Burn.toFixed(0)}% burned). Wait until it is fully consumed!`);
      sound.playError();
    } else {
      setFeedback(
        `Total time elapsed was ${simMinutes.toFixed(1)} minutes (Target is exactly 45 minutes). Reset to retry the optimal lighting sequence!`
      );
      sound.playError();
    }
  };

  const handleReset = () => {
    setLit1A(false);
    setLit1B(false);
    setLit2A(false);
    setLit2B(false);
    setSimMinutes(0);
    setRope1Burn(0);
    setRope2Burn(0);
    setIsRunning(false);
    setSolved(false);
    setFeedback(null);
    rope1FinishedAt.current = null;
    rope2FinishedAt.current = null;
    sound.playMove();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Virtual Clock</span>
            <div className="text-xl font-bold font-mono text-amber-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              {simMinutes.toFixed(1)} mins
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Time</span>
            <div className="text-xl font-bold font-mono text-green-400">45.0 mins</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Simulation</span>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="text-xs font-bold text-indigo-400 flex items-center gap-1 mt-0.5 hover:underline"
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isRunning ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeedMultiplier(prev => (prev === 1 ? 2 : 1))}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            {speedMultiplier}x Speed
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Ropes
          </button>
        </div>
      </div>

      {/* Main Ropes Chamber */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            Combustion Laboratory
          </span>
          <span className="text-[11px] text-slate-500">Each full rope burns out in exactly 60 minutes</span>
        </div>

        {/* ROPE 1 */}
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <span>🧵 Rope 1</span>
              <span className="text-[10px] font-mono text-slate-500">
                {lit1A && lit1B ? 'Burning from BOTH ends (30m capacity)' : lit1A || lit1B ? 'Burning from 1 end (60m capacity)' : 'Unlit'}
              </span>
            </span>
            <span className="font-mono text-[11px] text-amber-400">{rope1Burn.toFixed(0)}% Burned</span>
          </div>

          <div className="flex items-center gap-3">
            {/* End 1A Button */}
            <button
              onClick={() => handleLightEnd(1, 'A')}
              disabled={lit1A || solved || rope1Burn >= 100}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                lit1A
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 cursor-default'
                  : 'bg-slate-800 hover:bg-orange-600/30 hover:border-orange-500 text-slate-300 border-slate-700'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${lit1A ? 'text-orange-400 animate-bounce' : 'text-slate-500'}`} />
              {lit1A ? 'Lit' : 'Light 1A'}
            </button>

            {/* Visual Rope Body */}
            <div className="flex-1 h-5 bg-amber-950/30 rounded-full border border-amber-800/40 relative overflow-hidden flex items-center px-1">
              {/* Rope fibers pattern */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#78350f_0px,#78350f_4px,#451a03_4px,#451a03_8px)] opacity-60" />

              {/* Burn mask overlay */}
              <div
                className="absolute inset-0 bg-slate-950/90 transition-all duration-150"
                style={{
                  width: `${rope1Burn}%`,
                  margin: lit1A && lit1B ? '0 auto' : lit1B ? '0 0 0 auto' : '0 auto 0 0',
                }}
              />

              {/* Flame Marker */}
              {rope1Burn > 0 && rope1Burn < 100 && (
                <div
                  className="absolute text-sm -translate-y-0.5 transition-all duration-150"
                  style={{ left: `${Math.min(95, Math.max(5, rope1Burn))}%` }}
                >
                  🔥
                </div>
              )}
            </div>

            {/* End 1B Button */}
            <button
              onClick={() => handleLightEnd(1, 'B')}
              disabled={lit1B || solved || rope1Burn >= 100}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                lit1B
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 cursor-default'
                  : 'bg-slate-800 hover:bg-orange-600/30 hover:border-orange-500 text-slate-300 border-slate-700'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${lit1B ? 'text-orange-400 animate-bounce' : 'text-slate-500'}`} />
              {lit1B ? 'Lit' : 'Light 1B'}
            </button>
          </div>
        </div>

        {/* ROPE 2 */}
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <span>🧵 Rope 2</span>
              <span className="text-[10px] font-mono text-slate-500">
                {lit2A && lit2B ? 'Burning from BOTH ends' : lit2A || lit2B ? 'Burning from 1 end' : 'Unlit'}
              </span>
            </span>
            <span className="font-mono text-[11px] text-amber-400">{rope2Burn.toFixed(0)}% Burned</span>
          </div>

          <div className="flex items-center gap-3">
            {/* End 2A Button */}
            <button
              onClick={() => handleLightEnd(2, 'A')}
              disabled={lit2A || solved || rope2Burn >= 100}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                lit2A
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 cursor-default'
                  : 'bg-slate-800 hover:bg-orange-600/30 hover:border-orange-500 text-slate-300 border-slate-700'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${lit2A ? 'text-orange-400 animate-bounce' : 'text-slate-500'}`} />
              {lit2A ? 'Lit' : 'Light 2A'}
            </button>

            {/* Visual Rope Body */}
            <div className="flex-1 h-5 bg-amber-950/30 rounded-full border border-amber-800/40 relative overflow-hidden flex items-center px-1">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#78350f_0px,#78350f_4px,#451a03_4px,#451a03_8px)] opacity-60" />

              <div
                className="absolute inset-0 bg-slate-950/90 transition-all duration-150"
                style={{
                  width: `${rope2Burn}%`,
                  margin: lit2A && lit2B ? '0 auto' : lit2B ? '0 0 0 auto' : '0 auto 0 0',
                }}
              />

              {rope2Burn > 0 && rope2Burn < 100 && (
                <div
                  className="absolute text-sm -translate-y-0.5 transition-all duration-150"
                  style={{ left: `${Math.min(95, Math.max(5, rope2Burn))}%` }}
                >
                  🔥
                </div>
              )}
            </div>

            {/* End 2B Button */}
            <button
              onClick={() => handleLightEnd(2, 'B')}
              disabled={lit2B || solved || rope2Burn >= 100}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                lit2B
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 cursor-default'
                  : 'bg-slate-800 hover:bg-orange-600/30 hover:border-orange-500 text-slate-300 border-slate-700'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${lit2B ? 'text-orange-400 animate-bounce' : 'text-slate-500'}`} />
              {lit2B ? 'Lit' : 'Light 2B'}
            </button>
          </div>
        </div>

        {/* Measure Verification Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-950/70 rounded-xl border border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-200">Have 45 Minutes Passed?</div>
            <div className="text-[11px] text-slate-400">
              When both ropes extinguish according to the timing strategy, claim your measurement!
            </div>
          </div>

          <button
            onClick={handleCheckTiming}
            disabled={solved}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Declare 45 Minutes Measured!
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              solved
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            {solved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
            <span>{feedback}</span>
          </div>
        )}
      </div>
    </div>
  );
};
