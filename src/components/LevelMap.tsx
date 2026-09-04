import React, { useState } from 'react';
import {
  Brain,
  Calculator,
  Grid,
  Shapes,
  Star,
  Search,
  CheckCircle2,
  Building2,
  Sparkles,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Volume2,
  VolumeX,
  X,
  Palette,
  Flame,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { PuzzleMeta, PuzzleProgress } from '../types';
import { ThemeId, THEMES } from '../utils/theme';
import { sound } from '../utils/audio';

interface Props {
  puzzles: PuzzleMeta[];
  progress: Record<string, PuzzleProgress>;
  onSelectPuzzle: (puzzle: PuzzleMeta) => void;
  onResetProgress: () => void;
  streak: number;
  theme: ThemeId;
  onSetTheme: (theme: ThemeId) => void;
}

const STORAGE_KEY_FAVORITES = 'puzzlemaster_favorites_v1';

const POPULAR_COMPANIES = ['All', 'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Goldman Sachs'];

export const LevelMap: React.FC<Props> = ({
  puzzles,
  progress,
  onSelectPuzzle,
  onResetProgress,
  streak,
  theme,
  onSetTheme,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);
  const [showThemePicker, setShowThemePicker] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());

  const themeConfig = THEMES[theme] || THEMES['cyber-indigo'];

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  // Stats computation
  const progressList = Object.values(progress) as PuzzleProgress[];
  const totalStarsEarned = progressList.reduce(
    (acc, cur) => acc + (cur.starsEarned ?? cur.stars ?? 0),
    0
  );
  const solvedCount = progressList.filter(p => p.solved).length;
  const progressPercentage = Math.round((solvedCount / (puzzles.length || 1)) * 100);

  // Filtering
  const filteredPuzzles = puzzles.filter(p => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'favorites'
        ? favorites.includes(p.id)
        : p.category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;

    const matchesCompany =
      selectedCompany === 'All' ||
      p.companies.some(c => c.toLowerCase().includes(selectedCompany.toLowerCase()));

    const title = p.name || p.title || '';
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.companies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesDifficulty && matchesCompany && matchesSearch;
  });

  const categories: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: 'All Puzzles', value: 'All', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Favorites', value: 'favorites', icon: <BookmarkCheck className="w-4 h-4 text-amber-400" /> },
    { label: 'Logical', value: 'logical', icon: <Brain className="w-4 h-4" /> },
    { label: 'Math & Analytical', value: 'math', icon: <Calculator className="w-4 h-4" /> },
    { label: 'Arrangement', value: 'arrangement', icon: <Grid className="w-4 h-4" /> },
    { label: 'Shape & Spatial', value: 'spatial', icon: <Shapes className="w-4 h-4" /> },
  ];

  return (
    <div className={`min-h-screen ${themeConfig.bgClass} text-slate-200 flex flex-col relative transition-colors duration-500`}>
      {/* Dynamic Ambient Theme Glow in Background */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] pointer-events-none blur-3xl opacity-40 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at top, ${themeConfig.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Top Header Bar */}
      <header className="flex flex-col sm:flex-row items-center justify-between px-6 py-3.5 bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-xl sticky top-0 z-40 gap-4 shadow-sm">
        {/* Brand */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center space-x-3">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${themeConfig.gradient} flex items-center justify-center font-extrabold text-white shadow-lg text-lg tracking-wider`}
            >
              P
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white uppercase flex items-center gap-2">
                PuzzleMaster <span className={themeConfig.primaryColor}>Interview</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={handleToggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="p-2 bg-slate-800/80 text-slate-400 rounded-xl border border-slate-700"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
            </button>
            <button
              onClick={onResetProgress}
              title="Reset Progress"
              className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sleek Controls, Theme Switcher & Stats */}
        <div className="flex items-center flex-wrap gap-2.5 sm:space-x-3 text-xs sm:text-sm font-medium relative">
          {/* Theme Palette Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setShowThemePicker(!showThemePicker);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-bold text-slate-200 transition shadow-sm"
              title="Change Color Theme"
            >
              <Palette className="w-3.5 h-3.5 text-slate-300" />
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: themeConfig.dotColor }}
              />
              <span className="hidden md:inline">{themeConfig.name}</span>
            </button>

            {/* Theme Picker Dropdown Popover */}
            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 border border-slate-700 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Select Theme
                </div>
                {(Object.keys(THEMES) as ThemeId[]).map(tKey => {
                  const t = THEMES[tKey];
                  const isCur = theme === tKey;
                  return (
                    <button
                      key={tKey}
                      onClick={() => {
                        onSetTheme(tKey);
                        setShowThemePicker(false);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isCur
                          ? 'bg-white/10 text-white font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: t.dotColor }}
                        />
                        <span>{t.name}</span>
                      </div>
                      {isCur && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Formula Cheat Sheet Button */}
          <button
            onClick={() => {
              sound.playClick();
              setShowCheatSheet(true);
            }}
            className={`flex items-center space-x-1.5 ${themeConfig.badgeBg} hover:opacity-90 ${themeConfig.badgeText} border ${themeConfig.badgeBorder} px-3 py-1.5 rounded-full transition shadow-sm`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Cheat Sheet</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute SFX' : 'Mute SFX'}
            className="hidden sm:flex p-2 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
          </button>

          {/* Progress Pill */}
          <div className="flex items-center space-x-2 bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-700/80">
            <span className="text-slate-400 uppercase text-[10px] tracking-widest font-bold">Solved</span>
            <span className={`${themeConfig.primaryColor} font-mono font-bold`}>
              {solvedCount < 10 ? `0${solvedCount}` : solvedCount} / {puzzles.length}
            </span>
          </div>

          {/* Stars Pill */}
          <div className="flex items-center space-x-1.5 bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-700/80">
            <span className="text-slate-400 uppercase text-[10px] tracking-widest font-bold">Stars</span>
            <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {totalStarsEarned}
            </span>
          </div>

          {/* Streak Pill */}
          <div className="flex items-center space-x-1.5 bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-700/80">
            <span className="text-orange-500 font-bold italic font-mono flex items-center gap-1">
              🔥 {streak}
            </span>
          </div>

          {/* Reset Button */}
          <button
            onClick={onResetProgress}
            title="Reset Progress"
            className="hidden sm:flex p-2 bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Sleek Category Navigation */}
      <nav className="flex border-b border-slate-800/80 bg-slate-900/40 px-4 sm:px-6 overflow-x-auto scrollbar-none z-20 backdrop-blur-md">
        {categories.map(c => {
          const isActive = selectedCategory === c.value;
          const count =
            c.value === 'All'
              ? puzzles.length
              : c.value === 'favorites'
              ? favorites.length
              : puzzles.filter(p => p.category === c.value).length;

          return (
            <button
              key={c.value}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(c.value);
              }}
              className={`px-5 sm:px-7 py-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border-b-2 ${
                isActive
                  ? `border-current ${themeConfig.primaryColor}`
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.icon}
              <span>{c.label}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? `${themeConfig.badgeBg} ${themeConfig.badgeText} border ${themeConfig.badgeBorder}`
                    : 'bg-slate-800/80 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Global Progress Line */}
      <div className="w-full bg-slate-950 h-1 overflow-hidden border-b border-slate-800/60">
        <div
          className={`${themeConfig.progressClass} h-full transition-all duration-500 shadow-sm`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6 relative z-10">
        {/* Eye-catching Hero Header Banner */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${themeConfig.badgeBg} ${themeConfig.badgeBorder} ${themeConfig.badgeText}`}
              >
                FAANG & Tier-1 Interview Preparation
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-xs font-semibold text-slate-400">25 Interactive Simulations</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Master Technical Puzzles Through{' '}
              <span className={`bg-gradient-to-r ${themeConfig.gradient} bg-clip-text text-transparent`}>
                Playable Games & Visual Logic
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed font-normal">
              Test constraints directly, experiment with edge cases, and discover mathematical invariants.
              Each puzzle is accompanied by progressive hints, full mathematical breakdowns, and algorithmic insights.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex flex-col justify-center min-w-[130px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mastery</span>
              <div className={`text-2xl font-black font-mono ${themeConfig.primaryColor} mt-0.5`}>
                {progressPercentage}%
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">{solvedCount} of 25 Solved</span>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex flex-col justify-center min-w-[130px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Star Rating</span>
              <div className="text-2xl font-black font-mono text-amber-400 mt-0.5 flex items-center gap-1">
                <Trophy className="w-5 h-5 text-amber-400" />
                {totalStarsEarned}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">out of 75 total</span>
            </div>
          </div>
        </div>

        {/* Search, Difficulty, and Company Filter Toolbar */}
        <div className="flex flex-col gap-3.5 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-88">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search puzzle, concept, or company..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Difficulty filter buttons */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto scrollbar-none">
              {['All', 'Easy', 'Medium', 'Hard'].map(d => {
                const isCur = selectedDifficulty === d;
                return (
                  <button
                    key={d}
                    onClick={() => {
                      sound.playClick();
                      setSelectedDifficulty(d);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition uppercase tracking-wider whitespace-nowrap ${
                      isCur
                        ? `${themeConfig.buttonClass}`
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Company Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mr-1.5 whitespace-nowrap flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Target Company:
            </span>
            {POPULAR_COMPANIES.map(comp => {
              const isCur = selectedCompany === comp;
              return (
                <button
                  key={comp}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCompany(comp);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition whitespace-nowrap ${
                    isCur
                      ? `${themeConfig.badgeBg} ${themeConfig.badgeBorder} ${themeConfig.badgeText} font-bold`
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {comp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Puzzle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPuzzles.map(puzzle => {
            const puzzleProgress = progress[puzzle.id];
            const isSolved = puzzleProgress?.solved || false;
            const stars = puzzleProgress?.starsEarned ?? puzzleProgress?.stars ?? 0;
            const title = puzzle.name || puzzle.title || '';
            const desc = puzzle.problemStatement || puzzle.statement || '';
            const isFavorite = favorites.includes(puzzle.id);

            return (
              <div
                key={puzzle.id}
                onClick={() => {
                  sound.playClick();
                  onSelectPuzzle(puzzle);
                }}
                className={`group cursor-pointer rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl relative ${
                  isSolved
                    ? 'bg-slate-900/70 border-emerald-500/30 hover:border-emerald-500/60 shadow-emerald-950/20'
                    : `bg-slate-900/50 border-slate-800/80 hover:border-slate-600 ${themeConfig.cardGlowHover}`
                }`}
              >
                <div>
                  {/* Card Header: Difficulty & Bookmark & Stars */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl transform group-hover:scale-110 transition duration-200">
                        {puzzle.icon}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1.5 ${
                          puzzle.difficulty === 'Easy'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : puzzle.difficulty === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            puzzle.difficulty === 'Easy'
                              ? 'bg-green-400'
                              : puzzle.difficulty === 'Medium'
                              ? 'bg-yellow-400'
                              : 'bg-red-400'
                          }`}
                        />
                        {puzzle.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Bookmark Toggle */}
                      <button
                        onClick={e => toggleFavorite(puzzle.id, e)}
                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition"
                      >
                        {isFavorite ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400/40" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      {/* Star Rating */}
                      <div className="flex items-center gap-0.5 bg-slate-950/60 px-2 py-0.5 rounded-full border border-slate-800">
                        {[1, 2, 3].map(s => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              stars >= s
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-white group-hover:text-white transition-colors tracking-tight">
                    {title}
                  </h3>

                  {/* Snippet */}
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {desc}
                  </p>
                </div>

                {/* Card Footer: Companies & CTA */}
                <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium truncate max-w-[60%]">
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    <span className="truncate px-2 py-0.5 bg-slate-950/70 rounded-md uppercase font-bold text-slate-300 border border-slate-800">
                      {puzzle.companies.slice(0, 2).join(', ')}
                    </span>
                  </div>

                  <span className={`text-xs font-bold ${themeConfig.primaryColor} group-hover:underline flex items-center gap-1 transition-all`}>
                    {isSolved ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Practice
                      </span>
                    ) : (
                      <>
                        <span>Play Game</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition" />
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPuzzles.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-sm bg-slate-900/40 rounded-3xl border border-slate-800">
            No puzzles match your filter. Try clearing your search query or selecting a different category!
          </div>
        )}
      </main>

      {/* Formula & Interview Cheat Sheet Modal */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${themeConfig.badgeBg} border ${themeConfig.badgeBorder} ${themeConfig.badgeText}`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                    Interview Formula & Logic Cheat Sheet
                  </h2>
                  <p className="text-xs text-slate-400">Essential mathematical paradigms for FAANG puzzle rounds</p>
                </div>
              </div>

              <button
                onClick={() => setShowCheatSheet(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className={`text-xs font-bold ${themeConfig.primaryColor} uppercase tracking-wider mb-1 flex items-center gap-1.5`}>
                  📐 1. Bézout's Identity & Linear Diophantine Equations
                </div>
                <div className="font-mono text-slate-200 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] mb-2 inline-block">
                  ax + by = d is solvable iff gcd(a, b) divides d
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Used in <strong>Water Jug Problem</strong>. You can measure any target amount that is an integer multiple of the greatest common divisor of the two jugs.
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className={`text-xs font-bold ${themeConfig.primaryColor} uppercase tracking-wider mb-1 flex items-center gap-1.5`}>
                  ⚖️ 2. Information Theory & Ternary Pan Scales
                </div>
                <div className="font-mono text-slate-200 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] mb-2 inline-block">
                  Outcomes = 3^k ≥ N coins
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Used in <strong>Counterfeit Coin & Balance Scale</strong>. A balance scale has 3 states: Left heavier, Right heavier, or Equal. Thus, each weighing divides candidate states by 3. With 2 weighings, 3² = 9 coins can be resolved.
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className={`text-xs font-bold ${themeConfig.primaryColor} uppercase tracking-wider mb-1 flex items-center gap-1.5`}>
                  🚪 3. Divisor Pairs & Factor Parity
                </div>
                <div className="font-mono text-slate-200 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] mb-2 inline-block">
                  d(n) is odd ⟺ n is a perfect square (k²)
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Used in <strong>The 100 Doors Problem</strong>. Every integer has divisors that come in pairs (a × b = n), except perfect squares where √n × √n is paired with itself. An odd number of toggles leaves doors open.
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className={`text-xs font-bold ${themeConfig.primaryColor} uppercase tracking-wider mb-1 flex items-center gap-1.5`}>
                  🗼 4. Divide-and-Conquer & Hanoi Recursion
                </div>
                <div className="font-mono text-slate-200 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] mb-2 inline-block">
                  T(n) = 2T(n-1) + 1 = 2^n - 1
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Used in <strong>Tower of Hanoi</strong>. Moving n disks requires moving n-1 disks to auxiliary rod, moving bottom disk, and moving n-1 disks onto destination.
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className={`text-xs font-bold ${themeConfig.primaryColor} uppercase tracking-wider mb-1 flex items-center gap-1.5`}>
                  🥚 5. Triangular Numbers & Minimax Balancing
                </div>
                <div className="font-mono text-slate-200 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] mb-2 inline-block">
                  x(x + 1) / 2 ≥ Floors
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Used in <strong>2 Eggs & 100 Floors</strong>. To keep worst-case constant across all floors, successive drops decrease step size by 1 (x + x-1 + x-2 ... + 1 ≥ 100 ⟹ x = 14 drops).
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className={`text-xs font-bold ${themeConfig.primaryColor} uppercase tracking-wider mb-1 flex items-center gap-1.5`}>
                  🎲 6. Bayes' Theorem & Monty Hall
                </div>
                <div className="font-mono text-slate-200 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] mb-2 inline-block">
                  P(A|B) = [P(B|A) × P(A)] / P(B)
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Used in <strong>Monty Hall Problem</strong>. Initial pick has 1/3 probability of car; the host's informed goat reveal transfers the combined 2/3 probability to the unopened door. Switching doubles winning odds from 33.3% to 66.7%.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowCheatSheet(false)}
                className={`px-5 py-2 rounded-xl ${themeConfig.buttonClass} font-bold text-xs transition shadow-md`}
              >
                Close Cheat Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
