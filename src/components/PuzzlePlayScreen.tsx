import React, { useState, useEffect, useRef } from 'react';
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
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { PuzzleMeta, PuzzleProgress } from '../types';
import { sound } from '../utils/audio';
import { ThemeId, THEMES } from '../utils/theme';
import CompanyLogo from './CompanyLogo';

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

function CompanyBadge({ company }: { company: string; key?: React.Key }) {
  return <CompanyLogo company={company} className="company-badge" />;
}

function PuzzleArtwork({ puzzle }: { puzzle: PuzzleMeta }) {
  const art = puzzle.id === 'heaven-hell'
    ? { icon: '🚪', secondary: '🚪', label: 'Choose your path' }
    : puzzle.id === 'mislabeled-jars'
    ? { icon: '🏺', secondary: '🍊', label: 'Decode the labels' }
    : puzzle.id === 'water-jug'
    ? { icon: '🫗', secondary: '💧', label: 'Measure exactly' }
    : { icon: puzzle.icon || '✦', secondary: '✧', label: puzzle.category === 'math' ? 'Find the pattern' : 'Solve the challenge' };

  return (
    <div className="puzzle-artwork" aria-label={`${puzzle.name} illustration`}>
      <div className="puzzle-art-glow" />
      <span className="puzzle-art-secondary">{art.secondary}</span>
      <span className="puzzle-art-icon">{art.icon}</span>
      <span className="puzzle-art-label">{art.label}</span>
    </div>
  );
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
  const timerStorageKey = `pm-puzzle-time-${puzzle.id}`;
  const [timerSeconds, setTimerSeconds] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(timerStorageKey) || 0);
    } catch {
      return 0;
    }
  });
  const timerRef = useRef(timerSeconds);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());

  const themeConfig = THEMES[theme] || THEMES['cyber-indigo'];

  // Keep elapsed time per puzzle so leaving the screen does not reset progress.
  useEffect(() => {
    let savedSeconds = 0;
    try {
      savedSeconds = Number(localStorage.getItem(timerStorageKey) || 0);
    } catch {
      savedSeconds = 0;
    }
    timerRef.current = savedSeconds;
    setTimerSeconds(savedSeconds);
    const timer = setInterval(() => {
      timerRef.current += 1;
      setTimerSeconds(timerRef.current);
      try {
        localStorage.setItem(timerStorageKey, String(timerRef.current));
      } catch {
        // Ignore storage failures and keep the in-memory timer running.
      }
    }, 1000);
    return () => {
      clearInterval(timer);
      try {
        localStorage.setItem(timerStorageKey, String(timerRef.current));
      } catch {
        // Ignore storage failures.
      }
    };
  }, [timerStorageKey]);

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

  const tabItems = [
    { id: 'demo' as const, label: 'Interactive Simulation', shortLabel: 'Sim', icon: <Sparkles className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'hints' as const, label: `Progressive Hints (${revealedHints.length}/${puzzle.hints.length})`, shortLabel: `Hints (${revealedHints.length})`, icon: <Lightbulb className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'solution' as const, label: 'Interview Solution & Breakdown', shortLabel: 'Solution', icon: <BookOpen className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'code' as const, label: 'Algorithmic Insight', shortLabel: 'Insight', icon: <Zap className="w-3.5 h-3.5 shrink-0" /> },
  ];

  return (
    <div className={`puzzle-player flex flex-col min-h-screen ${themeConfig.bgClass} text-slate-200 relative transition-colors duration-500`}>
      {/* Subtle Dynamic Radial Glow Background */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] pointer-events-none blur-3xl opacity-25 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at top, ${themeConfig.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* ─── Top Header Bar ─── */}
      <header className="pt-safe sticky top-0 z-40 bg-slate-900/60 backdrop-blur-2xl border-b border-white/[0.04] px-3 sm:px-6 pb-2.5 sm:pb-3 w-full max-w-full relative">
        {/* Gradient Accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: themeConfig.headerAccent }}
        />

        {/* Desktop Header Layout */}
        <div className="hidden md:flex max-w-6xl mx-auto items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="puzzle-brand" aria-label="PuzzleMaster Interview Edition">
              <img src="/icon.png" alt="" />
              <span>Puzzle<span>Master</span><small>INTERVIEW EDITION</small></span>
            </div>
            <button
              onClick={onBack}
              className="bg-white/[0.04] hover:bg-white/[0.08] p-2 rounded-xl text-slate-400 hover:text-white transition-all duration-300 border border-white/[0.06] flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase px-1">Back to Map</span>
            </button>

            <div>
              <div className="flex items-center gap-2.5">
                <span className={`text-[10px] font-bold ${themeConfig.primaryColor} uppercase tracking-widest font-mono`}>
                  Puzzle {puzzle.number < 10 ? `0${puzzle.number}` : puzzle.number}
                </span>
                <span className="text-slate-700">•</span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {puzzle.name || puzzle.title}
                </h2>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                    puzzle.difficulty === 'Easy'
                      ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                      : puzzle.difficulty === 'Medium'
                      ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                      : 'bg-red-500/15 text-red-400 border border-red-500/20'
                  }`}
                >
                  {puzzle.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                {puzzle.companies.slice(0, 3).map(company => <CompanyBadge key={company} company={company} />)}
                <span className="text-slate-700">•</span>
                <span className="text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
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
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-1.5"
                  title="Switch Color Theme"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span
                    className="w-2 h-2 rounded-full inline-block ring-1 ring-white/10"
                    style={{ backgroundColor: themeConfig.dotColor }}
                  />
                </button>

                {showThemePicker && (
                  <div className="absolute right-0 mt-2 w-48 glass-panel-premium rounded-2xl p-1.5 z-50 flex flex-col gap-0.5 animate-fade-scale">
                    {(Object.keys(THEMES) as ThemeId[]).map(tKey => {
                      const t = THEMES[tKey];
                      return (
                        <button
                          key={tKey}
                          onClick={() => {
                            onSetTheme(tKey);
                            setShowThemePicker(false);
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200 text-left ${
                            theme === tKey ? 'bg-white/[0.06] text-white font-bold' : ''
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full ring-1 ring-white/10" style={{ backgroundColor: t.dotColor }} />
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
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-white transition-all duration-300"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" style={{ color: themeConfig.dotColor }} />}
            </button>

            {/* Timer Pill */}
            <div
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-mono text-slate-300"
              style={{
                background: `rgba(${themeConfig.accentRgb}, 0.06)`,
                borderColor: `rgba(${themeConfig.accentRgb}, 0.12)`,
              }}
            >
              <Clock className="w-3.5 h-3.5" style={{ color: themeConfig.dotColor }} />
              <span>{formatTimer(timerSeconds)}</span>
            </div>

            {/* Stars Pill */}
            <div className="flex items-center space-x-1.5 bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/[0.06]">
              {[1, 2, 3].map(s => {
                const isStar = (progress?.starsEarned ?? progress?.stars ?? 0) >= s;
                return (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 transition-all duration-300 ${
                      isStar ? 'fill-amber-400 text-amber-400 scale-110' : 'text-slate-700'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Header Layout */}
        <div className="flex md:hidden flex-col gap-2 w-full max-w-full">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
              <button
                onClick={onBack}
                className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06] shrink-0 transition-all duration-300 active:scale-95"
                title="Back to Map"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className={`text-[10px] font-bold ${themeConfig.primaryColor} font-mono shrink-0`}>
                  #{puzzle.number < 10 ? `0${puzzle.number}` : puzzle.number}
                </span>
                <h2 className="text-xs font-bold text-white tracking-tight truncate">
                  {puzzle.name || puzzle.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className="flex items-center space-x-1 px-2 py-1 rounded-full border text-[11px] font-mono text-slate-300"
                style={{
                  background: `rgba(${themeConfig.accentRgb}, 0.06)`,
                  borderColor: `rgba(${themeConfig.accentRgb}, 0.12)`,
                }}
              >
                <Clock className="w-3 h-3" style={{ color: themeConfig.dotColor }} />
                <span>{formatTimer(timerSeconds)}</span>
              </div>

              <div className="flex items-center space-x-0.5 bg-white/[0.04] px-1.5 py-1 rounded-full border border-white/[0.06]">
                {[1, 2, 3].map(s => {
                  const isStar = (progress?.starsEarned ?? progress?.stars ?? 0) >= s;
                  return (
                    <Star
                      key={s}
                      className={`w-2.5 h-2.5 transition-all duration-300 ${
                        isStar ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  );
                })}
              </div>

              <button
                onClick={handleToggleMute}
                className="p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white transition-all duration-300"
              >
                {isMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3" style={{ color: themeConfig.dotColor }} />}
              </button>
            </div>
          </div>

          {/* Sub Bar */}
          <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 pt-1 border-t border-white/[0.03]">
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-lg text-[9px] ${
                  puzzle.difficulty === 'Easy'
                    ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                    : puzzle.difficulty === 'Medium'
                    ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                    : 'bg-red-500/15 text-red-400 border border-red-500/20'
                }`}
              >
                {puzzle.difficulty}
              </span>
              <span className="uppercase text-[9px] font-semibold text-slate-500 px-1.5 py-0.5 bg-white/[0.03] rounded-lg border border-white/[0.04]">
                {puzzle.category}
              </span>
            </div>

            <div className="flex items-center gap-1 overflow-hidden justify-end">
              {puzzle.companies.slice(0, 2).map(company => <CompanyBadge key={company} company={company} />)}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3.5 sm:p-6 flex flex-col gap-4 sm:gap-6 relative z-10 pb-28 sm:pb-28 md:pb-8">
        {/* Puzzle Problem Statement Card */}
        <div className="glass-panel-premium rounded-2xl p-4 sm:p-6 relative overflow-hidden animate-slide-up">
          {/* Top Accent */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: themeConfig.headerAccent }}
          />
          <div className="puzzle-problem-layout">
            <PuzzleArtwork puzzle={puzzle} />
            <div className="puzzle-problem-copy">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 mb-2.5">
                <span className={`text-[10px] font-bold ${themeConfig.primaryColor} uppercase tracking-widest`}>
                  Interview Scenario & Rules
                </span>
                <div className="flex flex-wrap gap-1">
                  {(puzzle.tags || puzzle.companies.slice(0, 2)).map(t => (
                    <span key={t} className="text-[9px] sm:text-[10px] font-mono text-slate-500 bg-white/[0.03] px-2 py-0.5 rounded-lg border border-white/[0.04]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {puzzle.problemStatement || puzzle.statement}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Navigation Tabs ─── */}
        <div className="relative bg-white/[0.02] p-1 rounded-2xl border border-white/[0.04] animate-slide-up stagger-1" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <div className="grid grid-cols-4 gap-1 sm:flex sm:items-center sm:gap-1">
            {tabItems.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleSwitchTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2.5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-300 whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? `${themeConfig.buttonClass} shadow-lg`
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
                }`}
                style={activeTab === tab.id ? { boxShadow: `0 4px 20px rgba(${themeConfig.accentRgb}, 0.2)` } : {}}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Interactive Sandbox */}
        {activeTab === 'demo' && (
          <div className="w-full glass-panel-premium rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 relative overflow-hidden animate-fade-scale">
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl"
              style={{
                background: `radial-gradient(circle at center, rgba(${themeConfig.accentRgb}, 0.03) 0%, transparent 70%)`,
              }}
            />
            <div className="relative z-10 w-full max-w-full overflow-x-auto">
              {renderDemo()}
            </div>
          </div>
        )}

        {/* Tab 2: Progressive Hints */}
        {activeTab === 'hints' && (
          <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full animate-slide-up">
            <div className="text-xs text-slate-400 glass-panel-premium p-3.5 rounded-xl flex items-center gap-2">
              <span className="text-amber-400 font-bold text-sm">💡</span>
              <span>Hint Policy: Revealing 1 hint retains your 3-star potential. Revealing 2 or more hints caps your score to 2 or 1 stars!</span>
            </div>

            {puzzle.hints.map((hint, idx) => {
              const isRevealed = revealedHints.includes(idx);

              return (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                    isRevealed
                      ? 'glass-panel-premium border-white/[0.08]'
                      : 'bg-white/[0.02] border-white/[0.04]'
                  }`}
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black"
                        style={{
                          background: `rgba(${themeConfig.accentRgb}, 0.12)`,
                          border: `1px solid rgba(${themeConfig.accentRgb}, 0.2)`,
                        }}
                      >
                        {idx + 1}
                      </div>
                      Hint {idx + 1}
                    </span>

                    {!isRevealed && (
                      <button
                        onClick={() => handleRevealHint(idx)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition-all duration-300 hover:scale-105 active:scale-95 ${themeConfig.buttonClass}`}
                        style={{ boxShadow: `0 4px 16px rgba(${themeConfig.accentRgb}, 0.15)` }}
                      >
                        Reveal Hint
                      </button>
                    )}
                  </div>

                  {isRevealed ? (
                    <p className="mt-3 text-sm text-slate-200 leading-relaxed animate-expand">
                      {hint}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-600 italic">
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
          <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full animate-slide-up">
            <div className="glass-panel-premium rounded-2xl p-6 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, #10b981, #14b8a6, #10b981)' }}
              />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Comprehensive Solution & Proof
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {puzzle.explanation || puzzle.solution}
              </p>
            </div>

            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: `rgba(${themeConfig.accentRgb}, 0.06)`,
                border: `1px solid rgba(${themeConfig.accentRgb}, 0.15)`,
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                style={{ background: themeConfig.headerAccent }}
              />
              <h3 className={`text-xs font-bold ${themeConfig.primaryColor} uppercase tracking-wider mb-2 flex items-center gap-1.5`}>
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
          <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full animate-slide-up">
            <div className="glass-panel-premium rounded-2xl p-5 sm:p-6 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: themeConfig.headerAccent }}
              />
              <h3 className={`text-xs font-bold uppercase tracking-wider ${themeConfig.primaryColor} mb-2`}>
                Computer Science & Algorithmic Principle
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-mono">
                {puzzle.codeInsight || puzzle.interviewTip}
              </p>
            </div>

            <div
              className="p-4 rounded-xl text-xs text-slate-400"
              style={{
                background: `rgba(${themeConfig.accentRgb}, 0.04)`,
                border: `1px solid rgba(${themeConfig.accentRgb}, 0.1)`,
              }}
            >
              <span className="font-semibold text-slate-300">Recommended Next Step: </span>
              Try applying this principle to similar dynamic programming, parity invariant, or greedy search questions on LeetCode!
            </div>
          </div>
        )}
      </main>

      {/* ─── Success Modal Overlay ─── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-scale">
          <div className="glass-panel-premium max-w-md w-full rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden">
            {/* Top Accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] animate-shimmer"
              style={{
                background: themeConfig.headerAccent,
                backgroundSize: '200% auto',
              }}
            />

            <div className="relative mb-4 group">
              <div
                className="absolute -inset-3 rounded-2xl blur-lg opacity-60"
                style={{ background: `rgba(${themeConfig.accentRgb}, 0.3)` }}
              />
              <img
                src="/icon.png"
                alt="Interview Puzzles"
                className="relative w-20 h-20 rounded-2xl shadow-xl border border-white/10 object-cover"
              />
            </div>

            <h3 className="text-xl font-bold text-white">Puzzle Solved!</h3>
            <p className="text-xs text-slate-400 mt-1">
              You mastered the {puzzle.name || puzzle.title} interview challenge.
            </p>

            {/* Stars Display */}
            <div className="flex items-center gap-3 my-5">
              {[1, 2, 3].map((s, idx) => (
                <Star
                  key={s}
                  className={`w-8 h-8 ${
                    earnedStars >= s ? 'fill-amber-400 text-amber-400 animate-star-pop' : 'text-slate-700'
                  }`}
                  style={earnedStars >= s ? { animationDelay: `${idx * 0.15}s` } : {}}
                />
              ))}
            </div>

            <div
              className="text-xs text-slate-300 p-4 rounded-xl w-full mb-6 text-left"
              style={{
                background: `rgba(${themeConfig.accentRgb}, 0.06)`,
                border: `1px solid rgba(${themeConfig.accentRgb}, 0.12)`,
              }}
            >
              <div className={`text-[11px] font-bold ${themeConfig.primaryColor} uppercase tracking-wider mb-1.5`}>
                Interview Performance Summary:
              </div>
              <div className="space-y-0.5">
                <div>• Stars Awarded: {earnedStars} / 3 ⭐</div>
                <div>• Hints Revealed: {revealedHints.length}</div>
                <div>• Solved in: {formatTimer(timerSeconds)}</div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 font-bold uppercase text-xs rounded-xl border border-white/[0.06] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Review
              </button>

              {onNextPuzzle ? (
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    onNextPuzzle();
                  }}
                  className={`flex-1 py-3 ${themeConfig.buttonClass} font-bold uppercase text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]`}
                  style={{ boxShadow: themeConfig.glowShadow }}
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
                  className={`flex-1 py-3 ${themeConfig.buttonClass} font-bold uppercase text-xs rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
                  style={{ boxShadow: themeConfig.glowShadow }}
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
