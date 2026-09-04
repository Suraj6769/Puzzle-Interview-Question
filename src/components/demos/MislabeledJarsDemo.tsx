import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, HelpCircle } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

type FruitType = 'Apple' | 'Orange' | 'Mixed';

export const MislabeledJarsDemo: React.FC<Props> = ({ onSolved }) => {
  // Ground truth reality (every jar label is WRONG):
  // Current wrong labels:
  // Jar 1 label: "Apples"
  // Jar 2 label: "Oranges"
  // Jar 3 label: "Apples & Oranges"

  // Let's set a consistent real content:
  // Jar 3 ("Apples & Oranges") is actually purely APPLES!
  // Jar 2 ("Oranges") is actually MIXED!
  // Jar 1 ("Apples") is actually purely ORANGES!
  // Notice all 3 are indeed wrong!
  const trueContents: Record<number, FruitType> = {
    1: 'Orange',
    2: 'Mixed',
    3: 'Apple',
  };

  const initialLabels: Record<number, string> = {
    1: 'Apples',
    2: 'Oranges',
    3: 'Apples & Oranges',
  };

  const [pickedJar, setPickedJar] = useState<number | null>(null);
  const [revealedFruit, setRevealedFruit] = useState<string | null>(null);
  const [assignedLabels, setAssignedLabels] = useState<Record<number, string | null>>({
    1: null,
    2: null,
    3: null,
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState<boolean>(false);

  const handlePickFruit = (jarId: number) => {
    if (pickedJar !== null || solved) return;
    setPickedJar(jarId);

    const actual = trueContents[jarId];
    if (actual === 'Apple') {
      setRevealedFruit('🍎 Apple');
    } else if (actual === 'Orange') {
      setRevealedFruit('🍊 Orange');
    } else {
      // Mixed: random sample
      setRevealedFruit(Math.random() < 0.5 ? '🍎 Apple (Sample)' : '🍊 Orange (Sample)');
    }
  };

  const handleSetLabel = (jarId: number, label: string) => {
    if (solved) return;
    setAssignedLabels(prev => ({ ...prev, [jarId]: label }));
    setFeedback(null);
  };

  const handleValidate = () => {
    // Check if assignments match trueContents:
    // Jar 1: 'Oranges', Jar 2: 'Apples & Oranges', Jar 3: 'Apples'
    const correct1 = assignedLabels[1] === 'Oranges';
    const correct2 = assignedLabels[2] === 'Apples & Oranges';
    const correct3 = assignedLabels[3] === 'Apples';

    if (correct1 && correct2 && correct3) {
      setSolved(true);
      // Star rating: 3 stars if picked from Jar 3 (Apples & Oranges), as that is the mathematically deterministic choice!
      const stars = pickedJar === 3 ? 3 : 2;
      onSolved(stars, 1);
      setFeedback('Brilliant logical deduction! All 3 jars are now accurately labeled.');
    } else {
      setFeedback('Incorrect labeling. Remember: ALL 3 initial labels were guaranteed to be completely false!');
    }
  };

  const handleReset = () => {
    setPickedJar(null);
    setRevealedFruit(null);
    setAssignedLabels({ 1: null, 2: null, 3: null });
    setFeedback(null);
    setSolved(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Step:</span>
          <span className="text-cyan-400 font-semibold">
            {pickedJar === null
              ? '1. Draw ONE fruit from ANY one jar'
              : '2. Relabel all 3 jars correctly'}
          </span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* 3 Jars Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {[1, 2, 3].map(jarId => {
          const isPicked = pickedJar === jarId;
          const assigned = assignedLabels[jarId];

          return (
            <div
              key={jarId}
              className={`flex flex-col items-center p-5 rounded-2xl border transition-all ${
                isPicked
                  ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              {/* Current Mislabel Badge */}
              <div className="text-[11px] font-bold text-rose-400 bg-rose-950/70 border border-rose-800/80 px-2.5 py-1 rounded-full mb-3 text-center">
                Current: &quot;{initialLabels[jarId]}&quot; (FALSE)
              </div>

              {/* Jar Graphic */}
              <div className="w-24 h-28 rounded-2xl border-4 border-slate-600 bg-slate-950 flex flex-col items-center justify-center relative shadow-inner">
                <span className="text-4xl filter drop-shadow">🏺</span>
                {isPicked && revealedFruit && (
                  <div className="absolute -bottom-3 bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full shadow animate-bounce">
                    Drew: {revealedFruit}
                  </div>
                )}
              </div>

              {/* Action: Pick Fruit button */}
              {pickedJar === null && (
                <button
                  onClick={() => handlePickFruit(jarId)}
                  className="mt-4 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shadow transition"
                >
                  Pick 1 Fruit
                </button>
              )}

              {/* Relabel selection options */}
              {pickedJar !== null && (
                <div className="flex flex-col gap-1.5 w-full mt-4 pt-3 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold text-center">
                    Assign True Label:
                  </span>
                  {['Apples', 'Oranges', 'Apples & Oranges'].map(label => (
                    <button
                      key={label}
                      disabled={solved}
                      onClick={() => handleSetLabel(jarId, label)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition ${
                        assigned === label
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Validate Button */}
      {pickedJar !== null && (
        <button
          onClick={handleValidate}
          disabled={solved || !assignedLabels[1] || !assignedLabels[2] || !assignedLabels[3]}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
        >
          Validate New Labels
        </button>
      )}

      {feedback && (
        <div className={`w-full p-4 rounded-xl border text-xs font-medium flex items-center gap-2 ${
          solved ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300'
        }`}>
          {solved && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
};
