import React, { useState } from 'react';
import { RotateCcw, Award, Play, BarChart3, CheckCircle2 } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

export const MontyHallDemo: React.FC<Props> = ({ onSolved }) => {
  // 0, 1, 2 representing Door 1, 2, 3
  const [carDoor, setCarDoor] = useState<number>(() => Math.floor(Math.random() * 3));
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);
  const [revealedGoatDoor, setRevealedGoatDoor] = useState<number | null>(null);
  const [finalChoice, setFinalChoice] = useState<number | null>(null);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [wonRound, setWonRound] = useState<boolean>(false);
  const [switched, setSwitched] = useState<boolean>(false);

  // Simulation stats
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simStayWins, setSimStayWins] = useState<number>(33);
  const [simSwitchWins, setSimSwitchWins] = useState<number>(67);
  const [simTotal, setSimTotal] = useState<number>(100);

  // User pick initial door
  const handleSelectInitial = (doorIdx: number) => {
    if (selectedDoor !== null) return;
    setSelectedDoor(doorIdx);

    // Host reveals one of the OTHER doors that contains a goat
    const eligibleDoors = [0, 1, 2].filter(d => d !== doorIdx && d !== carDoor);
    const hostChoice = eligibleDoors[Math.floor(Math.random() * eligibleDoors.length)];
    setRevealedGoatDoor(hostChoice);
  };

  // User chooses Stay or Switch
  const handleDecision = (willSwitch: boolean) => {
    if (selectedDoor === null || revealedGoatDoor === null || gameEnded) return;

    let finalDoor = selectedDoor;
    if (willSwitch) {
      finalDoor = [0, 1, 2].find(d => d !== selectedDoor && d !== revealedGoatDoor)!;
    }

    setSwitched(willSwitch);
    setFinalChoice(finalDoor);
    setGameEnded(true);

    const isWin = finalDoor === carDoor;
    setWonRound(isWin);

    if (willSwitch && isWin) {
      onSolved(3, 1);
    } else if (willSwitch) {
      onSolved(2, 1); // Recognized optimal strategy!
    } else if (isWin) {
      onSolved(1, 1);
    }
  };

  const handleResetGame = () => {
    setCarDoor(Math.floor(Math.random() * 3));
    setSelectedDoor(null);
    setRevealedGoatDoor(null);
    setFinalChoice(null);
    setGameEnded(false);
    setWonRound(false);
    setSwitched(false);
  };

  // Run 100 auto-trials
  const runSimulation = (trials: number) => {
    setSimRunning(true);
    let stayWins = 0;
    let switchWins = 0;

    for (let i = 0; i < trials; i++) {
      const car = Math.floor(Math.random() * 3);
      const initial = Math.floor(Math.random() * 3);
      // Stay wins if initial === car
      if (initial === car) {
        stayWins++;
      } else {
        // Switch wins whenever initial !== car because host removes other goat
        switchWins++;
      }
    }

    setTimeout(() => {
      setSimStayWins(stayWins);
      setSimSwitchWins(switchWins);
      setSimTotal(trials);
      setSimRunning(false);
    }, 400);
  };

  const stayPct = Math.round((simStayWins / simTotal) * 100);
  const switchPct = Math.round((simSwitchWins / simTotal) * 100);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Step:</span>
          <span className="text-cyan-400 font-semibold">
            {selectedDoor === null
              ? '1. Pick any door'
              : !gameEnded
              ? '2. Stay or Switch?'
              : wonRound
              ? '🎉 Winner!'
              : '🐐 Better luck next time'}
          </span>
        </div>
        <button
          onClick={handleResetGame}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Play Again
        </button>
      </div>

      {/* 3 Doors Interactive Stage */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full py-4">
        {[0, 1, 2].map(idx => {
          const isSelected = selectedDoor === idx;
          const isRevealedGoat = revealedGoatDoor === idx;
          const isFinal = finalChoice === idx;
          const isCar = carDoor === idx;
          const isOpen = (gameEnded && (isFinal || isCar)) || isRevealedGoat;

          return (
            <div
              key={idx}
              onClick={() => handleSelectInitial(idx)}
              className={`relative flex flex-col items-center justify-center h-48 sm:h-56 rounded-2xl border-2 transition-all cursor-pointer select-none overflow-hidden ${
                isSelected && !gameEnded
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : isOpen
                  ? 'border-slate-700 bg-slate-950'
                  : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              {/* Door Content (Shown when opened) */}
              <div className="flex flex-col items-center justify-center gap-2">
                {isOpen ? (
                  <div className="text-center animate-in fade-in zoom-in duration-300">
                    <span className="text-5xl sm:text-6xl filter drop-shadow">
                      {isCar ? '🏎️' : '🐐'}
                    </span>
                    <div className="mt-2 text-xs font-bold uppercase tracking-wider">
                      {isCar ? (
                        <span className="text-emerald-400">Sports Car!</span>
                      ) : (
                        <span className="text-amber-400">Goat</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold font-mono text-base">
                      {idx + 1}
                    </div>
                    <span className="text-xs font-medium text-slate-400 mt-2">Door {idx + 1}</span>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                        Your Pick
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Host comment sticker */}
              {isRevealedGoat && !gameEnded && (
                <div className="absolute top-2 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow">
                  Host Opened
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Decision Box */}
      {selectedDoor !== null && revealedGoatDoor !== null && !gameEnded && (
        <div className="flex flex-col items-center gap-3 p-5 bg-slate-900/90 border border-cyan-500/40 rounded-2xl w-full shadow-lg text-center animate-in fade-in">
          <p className="text-sm font-medium text-slate-200">
            Host Monty opened Door {revealedGoatDoor + 1} with a goat. Do you want to stick with your original choice or switch?
          </p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => handleDecision(false)}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition"
            >
              Stay with Door {selectedDoor + 1} (33.3%)
            </button>
            <button
              onClick={() => handleDecision(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
            >
              Switch Door (66.7%)
            </button>
          </div>
        </div>
      )}

      {/* Round End Result */}
      {gameEnded && (
        <div className={`p-4 rounded-xl border w-full flex items-center justify-between text-xs font-medium ${
          wonRound ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            {wonRound ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <RotateCcw className="w-5 h-5 text-amber-400" />}
            <span>
              {wonRound
                ? `You Won the Sports Car! (${switched ? 'Switched strategy paid off!' : 'Lucky 1/3 hit on Stay!'})`
                : `You got the goat! (${switched ? 'Unlucky 1/3 case.' : 'Staying only wins 33.3% of the time.'})`}
            </span>
          </div>
          <button
            onClick={handleResetGame}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
          >
            Play Another
          </button>
        </div>
      )}

      {/* Auto Simulation Section */}
      <div className="flex flex-col gap-3 w-full bg-slate-950 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Monte Carlo Simulation ({simTotal} Trials)</span>
          </div>
          <div className="flex gap-2">
            <button
              disabled={simRunning}
              onClick={() => runSimulation(100)}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-[11px] font-medium text-slate-300 rounded border border-slate-700 transition"
            >
              <Play className="w-3 h-3 text-cyan-400" />
              100 Trials
            </button>
            <button
              disabled={simRunning}
              onClick={() => runSimulation(1000)}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-[11px] font-medium text-slate-300 rounded border border-slate-700 transition"
            >
              <Play className="w-3 h-3 text-cyan-400" />
              1,000 Trials
            </button>
          </div>
        </div>

        {/* CSS Bar Chart */}
        <div className="flex flex-col gap-2.5 pt-2">
          {/* Switch strategy bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-cyan-300 font-semibold">Switching Strategy: {simSwitchWins} wins</span>
              <span className="text-cyan-400 font-mono font-bold">{switchPct}% Win Rate (~2/3)</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${switchPct}%` }}
              />
            </div>
          </div>

          {/* Stay strategy bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-semibold">Staying Strategy: {simStayWins} wins</span>
              <span className="text-slate-400 font-mono font-bold">{stayPct}% Win Rate (~1/3)</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className="bg-slate-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${stayPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
