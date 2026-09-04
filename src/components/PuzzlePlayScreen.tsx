import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Lightbulb,
  BookOpen,
  Zap,
  Star,
  Clock,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Building2,
  Tag,
  ShieldCheck,
  Volume2,
  VolumeX,
  Palette,
} from 'lucide-react';
import { PuzzleMeta, PuzzleProgress } from '../types';
import { sound } from '../utils/audio';
import { ThemeId, THEMES } from '../utils/theme';

// Demos
import { WaterJugDemo } from './demos/WaterJugDemo';
import { BulbsSwitchesDemo } from './demos/BulbsSwitchesDemo';
import { MontyHallDemo } from './demos/MontyHallDemo';
import { EggsFloorsDemo } from './demos/EggsFloorsDemo';
import { TorchBridgeDemo } from './demos/TorchBridgeDemo';
import { AntsTriangleDemo } from './demos/AntsTriangleDemo';
import { ChessboardDominosDemo } from './demos/ChessboardDominosDemo';
import { CakeCutsDemo } from './demos/CakeCutsDemo';
import { MarblesDemo } from './demos/MarblesDemo';
import { DiceCalendarDemo } from './demos/DiceCalendarDemo';
import { BallsLinesDemo } from './demos/BallsLinesDemo';
import { SnailWallDemo } from './demos/SnailWallDemo';
import { MislabeledJarsDemo } from './demos/MislabeledJarsDemo';
import { PrisonersHatsDemo } from './demos/PrisonersHatsDemo';
import { HeavenHellDemo } from './demos/HeavenHellDemo';
import { CamelBananaDemo } from './demos/CamelBananaDemo';
import { PoisonRatDemo } from './demos/PoisonRatDemo';
import { MatchstickDemo } from './demos/MatchstickDemo';
import { CoinTableDemo } from './demos/CoinTableDemo';
import { NineDotsDemo } from './demos/NineDotsDemo';
import { RiverCrossingDemo } from './demos/RiverCrossingDemo';
import { BalanceScaleDemo } from './demos/BalanceScaleDemo';
import { BurningRopesDemo } from './demos/BurningRopesDemo';
import { TowerOfHanoiDemo } from './demos/TowerOfHanoiDemo';
import { HundredDoorsDemo } from './demos/HundredDoorsDemo';

interface Props {
  puzzle: PuzzleMeta;
  progress?: PuzzleProgress;
  onBack: () => void;
  onSaveProgress: (puzzleId: string, stars: number, hintsUsed: number, moves: number) => void;
  onNextPuzzle?: () => void;
  theme?: ThemeId;
  onSetTheme?: (theme: ThemeId) => void;
}

export const PuzzlePlayScreen: React.FC<Props> = ({
  puzzle,
  progress,
  onBack,
  onSaveProgress,
  onNextPuzzle,
  theme = 'cyber-indigo',
  onSetTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'hints' | 'solution' | 'code'>('demo');
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showThemePicker, setShowThemePicker] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [sessionMoves, setSessionMoves] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());

  const themeConfig = THEMES[theme] || THEMES['cyber-indigo'];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const handleSwitchTab = (tab: 'demo' | 'hints' | 'solution' | 'code') => {
    sound.playClick();
    setActiveTab(tab);
  };

  const handleRevealHint = (index: number) => {
    if (!revealedHints.includes(index)) {
      sound.playHint();
      setRevealedHints(prev => [...prev, index]);
    }
  };

  const handleSolved = (stars: number, moves: number) => {
    // Calculate final stars considering hints used
    let finalStars = stars;
    if (revealedHints.length >= 2 && finalStars > 2) finalStars = 2;
    if (revealedHints.length >= 3 && finalStars > 1) finalStars = 1;

    setEarnedStars(finalStars);
    setSessionMoves(moves);
    setShowSuccessModal(true);

    // Save progress
    onSaveProgress(puzzle.id, finalStars, revealedHints.length, moves);

    // Trigger sound & celebration confetti
    sound.playSuccess();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Render proper interactive demo component
  const renderDemo = () => {
    switch (puzzle.id) {
      case 'water-jug':
        return <WaterJugDemo onSolved={handleSolved} />;
      case 'bulbs-switches':
        return <BulbsSwitchesDemo onSolved={handleSolved} />;
      case 'monty-hall':
        return <MontyHallDemo onSolved={handleSolved} />;
      case 'eggs-floors':
        return <EggsFloorsDemo onSolved={handleSolved} />;
      case 'torch-bridge':
        return <TorchBridgeDemo onSolved={handleSolved} />;
      case 'ants-triangle':
        return <AntsTriangleDemo onSolved={handleSolved} />;
      case 'chessboard-dominos':
        return <ChessboardDominosDemo onSolved={handleSolved} />;
      case 'cake-cuts':
        return <CakeCutsDemo onSolved={handleSolved} />;
      case 'marbles-jars':
        return <MarblesDemo onSolved={handleSolved} />;
      case 'dice-calendar':
        return <DiceCalendarDemo onSolved={handleSolved} />;
      case 'balls-lines':
        return <BallsLinesDemo onSolved={handleSolved} />;
      case 'snail-wall':
        return <SnailWallDemo onSolved={handleSolved} />;
      case 'mislabeled-jars':
        return <MislabeledJarsDemo onSolved={handleSolved} />;
      case 'prisoners-hats':
        return <PrisonersHatsDemo onSolved={handleSolved} />;
      case 'heaven-hell':
        return <HeavenHellDemo onSolved={handleSolved} />;
      case 'camel-banana':
        return <CamelBananaDemo onSolved={handleSolved} />;
      case 'poison-rat':
        return <PoisonRatDemo onSolved={handleSolved} />;
      case 'matchstick-squares':
      case 'matchstick-puzzle':
        return <MatchstickDemo onSolved={handleSolved} />;
      case 'round-table-coins':
      case 'coin-table':
        return <CoinTableDemo onSolved={handleSolved} />;
      case 'nine-dots':
        return <NineDotsDemo onSolved={handleSolved} />;
      case 'river-crossing':
        return <RiverCrossingDemo onSolved={handleSolved} />;
      case 'balance-scale':
        return <BalanceScaleDemo onSolved={handleSolved} />;
      case 'burning-ropes':
        return <BurningRopesDemo onSolved={handleSolved} />;
      case 'tower-of-hanoi':
        return <TowerOfHanoiDemo onSolved={handleSolved} />;
      case 'hundred-doors':
        return <HundredDoorsDemo onSolved={handleSolved} />;
      default:
        return <div>Demo loading...</div>;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${themeConfig.bgClass} text-slate-200 relative transition-colors duration-500`}>
      {/* Subtle Dynamic Radial Glow Background */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] pointer-events-none blur-3xl opacity-30 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at top, ${themeConfig.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-700 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase px-1">Back to Map</span>
            </button>

            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                  Puzzle {puzzle.number < 10 ? `0${puzzle.number}` : puzzle.number}
                </span>
                <span className="text-slate-600">•</span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {puzzle.name || puzzle.title}
                </h2>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    puzzle.difficulty === 'Easy'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : puzzle.difficulty === 'Medium'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {puzzle.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded uppercase font-bold text-slate-400 border border-slate-700/60">
                  {puzzle.companies.slice(0, 3).join(', ')}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  {puzzle.category}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Selector Popover */}
            {onSetTheme && (
              <div className="relative">
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowThemePicker(!showThemePicker);
                  }}
                  className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition flex items-center gap-1.5"
                  title="Switch Color Theme"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: themeConfig.dotColor }}
                  />
                </button>

                {showThemePicker && (
                  <div className="absolute right-0 mt-2 w-44 bg-slate-900/95 border border-slate-700 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-1">
                    {(Object.keys(THEMES) as ThemeId[]).map(tKey => {
                      const t = THEMES[tKey];
                      return (
                        <button
                          key={tKey}
                          onClick={() => {
                            onSetTheme(tKey);
                            setShowThemePicker(false);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition text-left"
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.dotColor }} />
                          <span>{t.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Audio Mute Toggle */}
            <button
              onClick={handleToggleMute}
              title={isMuted ? 'Unmute SFX' : 'Mute SFX'}
              className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
            </button>

            {/* Timer Pill */}
            <div className="flex items-center space-x-2 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/80 text-xs font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>

            {/* Stars Pill */}
            <div className="flex items-center space-x-1.5 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
              {[1, 2, 3].map(s => {
                const isStar = (progress?.starsEarned ?? progress?.stars ?? 0) >= s;
                return (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      isStar ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6 relative z-10">
        {/* Puzzle Problem Statement Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              Interview Scenario & Rules
            </span>
            <div className="flex gap-1.5">
              {(puzzle.tags || puzzle.companies.slice(0, 2)).map(t => (
                <span
                  key={t}
                  className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {puzzle.problemStatement || puzzle.statement}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => handleSwitchTab('demo')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'demo'
                ? themeConfig.activeTabClass
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Simulation
          </button>

          <button
            onClick={() => handleSwitchTab('hints')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition relative whitespace-nowrap ${
              activeTab === 'hints'
                ? themeConfig.activeTabClass
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Progressive Hints ({revealedHints.length}/{puzzle.hints.length})
          </button>

          <button
            onClick={() => handleSwitchTab('solution')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'solution'
                ? themeConfig.activeTabClass
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Interview Solution & Breakdown
          </button>

          <button
            onClick={() => handleSwitchTab('code')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'code'
                ? themeConfig.activeTabClass
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Algorithmic Insight
          </button>
        </div>

        {/* Tab 1: Interactive Sandbox */}
        {activeTab === 'demo' && (
          <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.05)_0%,transparent_70%)] pointer-events-none rounded-3xl" />
            <div className="relative z-10">
              {renderDemo()}
            </div>
          </div>
        )}

        {/* Tab 2: Progressive Hints */}
        {activeTab === 'hints' && (
          <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
            <div className="text-xs text-slate-400 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex items-center gap-2">
              <span className="text-amber-400 font-bold text-sm">💡</span>
              <span>Hint Policy: Revealing 1 hint retains your 3-star potential. Revealing 2 or more hints caps your score to 2 or 1 stars!</span>
            </div>

            {puzzle.hints.map((hint, idx) => {
              const isRevealed = revealedHints.includes(idx);

              return (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isRevealed
                      ? 'bg-slate-900/80 border-slate-700'
                      : 'bg-slate-900/30 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Hint {idx + 1}
                    </span>

                    {!isRevealed && (
                      <button
                        onClick={() => handleRevealHint(idx)}
                        className="px-4 py-1.5 rounded-lg border border-slate-700 text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/40 text-xs font-bold uppercase transition"
                      >
                        Reveal Hint
                      </button>
                    )}
                  </div>

                  {isRevealed ? (
                    <p className="mt-3 text-sm text-slate-200 leading-relaxed animate-in fade-in">
                      {hint}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-500 italic">
                      Click reveal to inspect this progressive clue...
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Detailed Interview Solution */}
        {activeTab === 'solution' && (
          <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Comprehensive Solution & Proof
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {puzzle.explanation || puzzle.solution}
              </p>
            </div>

            <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                FAANG Interviewer Secret Takeaway
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {puzzle.interviewTip ||
                  `Interviewers at ${puzzle.companies.join(', ')} evaluate how methodically you formulate state invariants, test edge boundary conditions, and articulate your thoughts under ambiguity.`}
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Algorithmic & Code Insight */}
        {activeTab === 'code' && (
          <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                Computer Science & Algorithmic Principle
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-mono">
                {puzzle.codeInsight || puzzle.interviewTip}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Recommended Next Step: </span>
              Try applying this principle to similar dynamic programming, parity invariant, or greedy search questions on LeetCode!
            </div>
          </div>
        )}
      </main>

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 max-w-md w-full rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-3xl mb-4 shadow-lg shadow-indigo-500/20">
              🏆
            </div>

            <h3 className="text-xl font-bold text-white">Puzzle Solved!</h3>
            <p className="text-xs text-slate-400 mt-1">
              You mastered the {puzzle.name || puzzle.title} interview challenge.
            </p>

            {/* Stars Display */}
            <div className="flex items-center gap-2 my-5">
              {[1, 2, 3].map(s => (
                <Star
                  key={s}
                  className={`w-8 h-8 ${
                    earnedStars >= s ? 'fill-amber-400 text-amber-400 scale-110' : 'text-slate-700'
                  } transition-all duration-300`}
                />
              ))}
            </div>

            <div className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 w-full mb-6 text-left">
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                Interview Performance Summary:
              </div>
              <div>• Stars Awarded: {earnedStars} / 3 ⭐</div>
              <div>• Hints Revealed: {revealedHints.length}</div>
              <div>• Solved in: {formatTimer(timerSeconds)}</div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold uppercase text-xs rounded-xl border border-slate-700 transition"
              >
                Review
              </button>

              {onNextPuzzle ? (
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    onNextPuzzle();
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-1.5"
                >
                  <span>Next Puzzle</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    onBack();
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition"
                >
                  Return to Map
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
