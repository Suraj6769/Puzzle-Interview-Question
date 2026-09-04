import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

export const HeavenHellDemo: React.FC<Props> = ({ onSolved }) => {
  // Randomize which door is Heaven (1 or 2)
  const [heavenDoor, setHeavenDoor] = useState<1 | 2>(() => (Math.random() < 0.5 ? 1 : 2));
  // Randomize guard nature: Guard 1 true or Guard 2 true
  const [guard1IsTruth, setGuard1IsTruth] = useState<boolean>(() => Math.random() < 0.5);

  const [selectedGuard, setSelectedGuard] = useState<1 | 2 | null>(null);
  const [askedQuestion, setAskedQuestion] = useState<string | null>(null);
  const [guardAnswer, setGuardAnswer] = useState<string | null>(null);
  const [chosenDoor, setChosenDoor] = useState<1 | 2 | null>(null);
  const [solved, setSolved] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);

  const hellDoor = heavenDoor === 1 ? 2 : 1;

  const QUESTIONS = [
    {
      id: 'other_guard',
      text: 'What would the OTHER guard say if asked which door leads to Heaven?',
      isWinningFormula: true,
    },
    {
      id: 'direct_heaven',
      text: 'Which door leads to Heaven?',
      isWinningFormula: false,
    },
    {
      id: 'liar_check',
      text: 'Are you the guard who always tells the truth?',
      isWinningFormula: false,
    },
    {
      id: 'random_math',
      text: 'Does 2 + 2 = 4?',
      isWinningFormula: false,
    },
  ];

  const handleAsk = (guardId: 1 | 2, qId: string) => {
    if (guardAnswer !== null || solved) return;
    setSelectedGuard(guardId);
    setAskedQuestion(qId);

    const isTargetTruth = guardId === 1 ? guard1IsTruth : !guard1IsTruth;

    let reply = '';
    if (qId === 'other_guard') {
      // The other guard would point to:
      // If other guard is Liar: Liar would say HellDoor. Truth guard honestly reports: HellDoor.
      // If other guard is Truth: Truth guard would say HeavenDoor. Liar falsely reports: HellDoor.
      // BOTH guards inevitably answer the HELL door!
      reply = `The other guard would point to Door ${hellDoor}.`;
    } else if (qId === 'direct_heaven') {
      if (isTargetTruth) {
        reply = `Door ${heavenDoor} leads to Heaven.`;
      } else {
        reply = `Door ${hellDoor} leads to Heaven.`;
      }
    } else if (qId === 'liar_check') {
      // Both will answer "Yes!"
      reply = 'Yes, of course I am.';
    } else if (qId === 'random_math') {
      reply = isTargetTruth ? 'Yes.' : 'No.';
    }

    setGuardAnswer(reply);
  };

  const handlePickDoor = (doorId: 1 | 2) => {
    if (revealed || solved) return;
    setChosenDoor(doorId);
    setRevealed(true);

    if (doorId === heavenDoor) {
      setSolved(true);
      const stars = askedQuestion === 'other_guard' ? 3 : 2;
      onSolved(stars, 1);
    }
  };

  const handleReset = () => {
    setHeavenDoor(Math.random() < 0.5 ? 1 : 2);
    setGuard1IsTruth(Math.random() < 0.5);
    setSelectedGuard(null);
    setAskedQuestion(null);
    setGuardAnswer(null);
    setChosenDoor(null);
    setRevealed(false);
    setSolved(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Status:</span>
          <span className="text-cyan-400 font-semibold">
            {guardAnswer === null
              ? 'Select a guard & question'
              : !revealed
              ? 'Choose a door based on logic'
              : chosenDoor === heavenDoor
              ? '🌤️ Reached Heaven!'
              : '🔥 Fallen into Hell!'}
          </span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Game
        </button>
      </div>

      {/* The Two Guards */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {[1, 2].map(g => {
          const isSelected = selectedGuard === g;

          return (
            <div
              key={g}
              className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="text-4xl filter drop-shadow">💂‍♂️</div>
              <span className="text-xs font-bold text-slate-200 mt-2">Guard {g}</span>
              <span className="text-[10px] text-slate-500">(Truth or Liar unknown)</span>

              {/* Guard speech bubble */}
              {isSelected && guardAnswer && (
                <div className="mt-3 p-2.5 rounded-xl bg-cyan-950 border border-cyan-700 text-xs text-cyan-200 text-center font-medium animate-in fade-in">
                  &quot;{guardAnswer}&quot;
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Question Selection */}
      {guardAnswer === null && (
        <div className="flex flex-col gap-2.5 w-full bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Ask ONE question to either Guard 1 or Guard 2:
          </span>
          <div className="flex flex-col gap-2">
            {QUESTIONS.map(q => (
              <div
                key={q.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 text-xs"
              >
                <span className="text-slate-300 pr-2">&quot;{q.text}&quot;</span>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleAsk(1, q.id)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white rounded font-semibold text-[11px] transition"
                  >
                    Ask G1
                  </button>
                  <button
                    onClick={() => handleAsk(2, q.id)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white rounded font-semibold text-[11px] transition"
                  >
                    Ask G2
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* The Two Doors */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {([1, 2] as (1 | 2)[]).map(doorId => {
          const isHeaven = heavenDoor === doorId;
          const isChosen = chosenDoor === doorId;

          return (
            <button
              key={doorId}
              disabled={guardAnswer === null || revealed}
              onClick={() => handlePickDoor(doorId)}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                revealed
                  ? isHeaven
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                    : 'bg-rose-950/80 border-rose-600 shadow-[0_0_25px_rgba(225,29,72,0.3)]'
                  : guardAnswer !== null
                  ? 'bg-slate-900 border-cyan-500/60 hover:border-cyan-400 hover:scale-[1.02] cursor-pointer'
                  : 'bg-slate-950 border-slate-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-5xl filter drop-shadow">
                {revealed ? (isHeaven ? '🌤️' : '🔥') : '🚪'}
              </div>
              <span className="font-bold text-sm text-slate-200 mt-3">
                Door {doorId}
              </span>
              {revealed && (
                <span
                  className={`text-xs font-bold uppercase mt-1 ${
                    isHeaven ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isHeaven ? 'Heaven' : 'Hell'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div
          className={`w-full p-4 rounded-xl border text-xs font-medium flex items-center gap-2 ${
            chosenDoor === heavenDoor
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          {chosenDoor === heavenDoor ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>
            {chosenDoor === heavenDoor
              ? 'Victory! By asking what the other guard would say, Truth × Lie and Lie × Truth both yield the false door (Hell), so choosing the OPPOSITE door guarantees Heaven!'
              : 'You selected the door to Hell! Review the double-negation logic in the hints.'}
          </span>
        </div>
      )}
    </div>
  );
};
