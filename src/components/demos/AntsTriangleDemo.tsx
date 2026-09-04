import React, { useState } from 'react';
import { RotateCcw, Play, BarChart3, CheckCircle2, Award, Zap } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

type Direction = 'CW' | 'CCW';

export const AntsTriangleDemo: React.FC<Props> = ({ onSolved }) => {
  // Directions for Ant 0 (Top), Ant 1 (Bottom Right), Ant 2 (Bottom Left)
  const [directions, setDirections] = useState<[Direction, Direction, Direction]>(['CW', 'CW', 'CW']);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<'safe' | 'collision' | null>(null);

  // Monte carlo simulation stats
  const [trialsCount, setTrialsCount] = useState<number>(0);
  const [collisionCount, setCollisionCount] = useState<number>(0);
  const [safeCount, setSafeCount] = useState<number>(0);

  // Quiz input
  const [selectedProb, setSelectedProb] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState<boolean>(false);

  const toggleDirection = (idx: 0 | 1 | 2) => {
    if (isSimulating) return;
    setDirections(prev => {
      const next = [...prev] as [Direction, Direction, Direction];
      next[idx] = next[idx] === 'CW' ? 'CCW' : 'CW';
      return next;
    });
    setSimulationResult(null);
  };

  const handleRunSingle = () => {
    setIsSimulating(true);
    setSimulationResult(null);

    // If all are CW or all are CCW, no collision! Otherwise collision!
    const allCW = directions.every(d => d === 'CW');
    const allCCW = directions.every(d => d === 'CCW');
    const safe = allCW || allCCW;

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResult(safe ? 'safe' : 'collision');
    }, 800);
  };

  const handleRunTrials = (count: number) => {
    let coll = 0;
    let s = 0;
    for (let i = 0; i < count; i++) {
      const d0 = Math.random() < 0.5 ? 'CW' : 'CCW';
      const d1 = Math.random() < 0.5 ? 'CW' : 'CCW';
      const d2 = Math.random() < 0.5 ? 'CW' : 'CCW';
      if ((d0 === 'CW' && d1 === 'CW' && d2 === 'CW') || (d0 === 'CCW' && d1 === 'CCW' && d2 === 'CCW')) {
        s++;
      } else {
        coll++;
      }
    }
    setTrialsCount(count);
    setCollisionCount(coll);
    setSafeCount(s);
  };

  const handleCheckAnswer = (choice: string) => {
    setSelectedProb(choice);
    if (choice === '1/4 (25%)') {
      setSolved(true);
      setQuizFeedback('Correct! 2 safe configurations out of 2^3 = 8 total outcomes yields exactly 2/8 = 1/4 (25%).');
      onSolved(3, 1);
    } else {
      setQuizFeedback(`Incorrect (${choice}). Consider: each ant independently chooses CW or CCW (2^3 = 8 outcomes). Only (CW, CW, CW) and (CCW, CCW, CCW) avoid collisions!`);
    }
  };

  const handleReset = () => {
    setDirections(['CW', 'CW', 'CW']);
    setIsSimulating(false);
    setSimulationResult(null);
    setSelectedProb(null);
    setQuizFeedback(null);
    setSolved(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Current Setup:</span>
          <span className="font-mono text-cyan-400 font-bold">
            [{directions.join(', ')}]
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

      {/* SVG Triangle Stage */}
      <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner">
        <svg viewBox="0 0 300 270" className="w-full h-full overflow-visible">
          {/* Triangle Perimeter */}
          <polygon
            points="150,30 270,240 30,240"
            fill="none"
            stroke="#334155"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Direction indicator arrows */}
          {/* Top vertex (150, 30): CW goes towards bottom-right (270, 240); CCW goes towards bottom-left (30, 240) */}
          <line
            x1="150"
            y1="40"
            x2={directions[0] === 'CW' ? '180' : '120'}
            y2="75"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeDasharray="4 2"
          />
          {/* Bottom-right vertex (270, 240): CW goes left to (30, 240); CCW goes up-left to (150, 30) */}
          <line
            x1="260"
            y1="235"
            x2={directions[1] === 'CW' ? '210' : '235'}
            y2={directions[1] === 'CW' ? '235' : '185'}
            stroke="#06b6d4"
            strokeWidth="3"
            strokeDasharray="4 2"
          />
          {/* Bottom-left vertex (30, 240): CW goes up-right to (150, 30); CCW goes right to (270, 240) */}
          <line
            x1="40"
            y1="235"
            x2={directions[2] === 'CW' ? '65' : '90'}
            y2={directions[2] === 'CW' ? '185' : '235'}
            stroke="#06b6d4"
            strokeWidth="3"
            strokeDasharray="4 2"
          />

          {/* Collision or Safe Blast Overlay */}
          {simulationResult === 'collision' && (
            <text x="150" y="160" textAnchor="middle" fontSize="36" className="animate-bounce">
              💥
            </text>
          )}
          {simulationResult === 'safe' && (
            <text x="150" y="160" textAnchor="middle" fontSize="36" className="animate-pulse">
              🛡️✨
            </text>
          )}
        </svg>

        {/* Ant 0 (Top) */}
        <div className="absolute top-2 flex flex-col items-center">
          <button
            onClick={() => toggleDirection(0)}
            className="flex flex-col items-center p-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 transition"
          >
            <span className="text-2xl">🐜</span>
            <span className="text-[10px] font-bold text-cyan-400 mt-0.5">
              Ant 1 ({directions[0]})
            </span>
          </button>
        </div>

        {/* Ant 1 (Bottom Right) */}
        <div className="absolute bottom-2 right-2 flex flex-col items-center">
          <button
            onClick={() => toggleDirection(1)}
            className="flex flex-col items-center p-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 transition"
          >
            <span className="text-2xl">🐜</span>
            <span className="text-[10px] font-bold text-cyan-400 mt-0.5">
              Ant 2 ({directions[1]})
            </span>
          </button>
        </div>

        {/* Ant 2 (Bottom Left) */}
        <div className="absolute bottom-2 left-2 flex flex-col items-center">
          <button
            onClick={() => toggleDirection(2)}
            className="flex flex-col items-center p-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 transition"
          >
            <span className="text-2xl">🐜</span>
            <span className="text-[10px] font-bold text-cyan-400 mt-0.5">
              Ant 3 ({directions[2]})
            </span>
          </button>
        </div>
      </div>

      {/* Action to test current config */}
      <div className="flex gap-3 w-full">
        <button
          disabled={isSimulating}
          onClick={handleRunSingle}
          className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition"
        >
          {isSimulating ? 'Simulating Walk...' : 'Test Current Directions'}
        </button>
        <button
          onClick={() => handleRunTrials(100)}
          className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
        >
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          Run 100 Random Trials
        </button>
      </div>

      {/* Trial stats if triggered */}
      {trialsCount > 0 && (
        <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs flex justify-between">
          <span className="text-slate-400">Tested: {trialsCount} runs</span>
          <span className="text-rose-400 font-bold">Collisions: {collisionCount} ({Math.round(collisionCount / trialsCount * 100)}%)</span>
          <span className="text-emerald-400 font-bold">Safe (No Collision): {safeCount} ({Math.round(safeCount / trialsCount * 100)}%)</span>
        </div>
      )}

      {/* Math Probability Question */}
      <div className="flex flex-col gap-3 w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Interview Question: What is the exact probability that no ants collide?
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {['1/8 (12.5%)', '1/4 (25%)', '1/2 (50%)', '3/4 (75%)'].map(opt => (
            <button
              key={opt}
              onClick={() => handleCheckAnswer(opt)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                selectedProb === opt
                  ? opt === '1/4 (25%)'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950 border-rose-500 text-rose-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {quizFeedback && (
          <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 mt-1 ${
            solved ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}>
            {solved && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            <span>{quizFeedback}</span>
          </div>
        )}
      </div>
    </div>
  );
};
