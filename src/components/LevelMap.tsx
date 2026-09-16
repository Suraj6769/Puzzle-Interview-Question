import React, { useState, useEffect } from 'react';
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
  ArrowUpDown,
  LogOut,
  User,
  Check,
  Smartphone,
  Layers,
  BarChart3,
  Award,
  Zap,
} from 'lucide-react';
import { PuzzleMeta, PuzzleProgress, UserProfile, SortOption } from '../types';
import { ThemeId, THEMES } from '../utils/theme';
import { sound } from '../utils/audio';
import { MobileNavBar, MobileTab } from './MobileNavBar';
import { authStorage } from '../utils/authStorage';

interface Props {
  puzzles: PuzzleMeta[];
  progress: Record<string, PuzzleProgress>;
  onSelectPuzzle: (puzzle: PuzzleMeta) => void;
  onResetProgress: () => void;
  streak: number;
  theme: ThemeId;
  onSetTheme: (theme: ThemeId) => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
}

const POPULAR_COMPANIES = ['All', 'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Goldman Sachs'];

export const LevelMap: React.FC<Props> = ({
  puzzles,
  progress,
  onSelectPuzzle,
  onResetProgress,
  streak,
  theme,
  onSetTheme,
  currentUser,
  onLogout,
}) => {
  const [mobileTab, setMobileTab] = useState<MobileTab>('puzzles');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('difficulty-asc');
  const [showSortPicker, setShowSortPicker] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);
  const [showThemePicker, setShowThemePicker] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const themeConfig = THEMES[theme] || THEMES['cyber-indigo'];

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = () => {
    sound.playClick();
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then(() => setInstallPrompt(null));
    } else {
      alert(
        '📱 To install PuzzleMaster on your mobile home screen:\n\n' +
          '• iPhone (Safari): Tap the Share icon (box with arrow) at the bottom, then tap "Add to Home Screen".\n' +
          '• Android (Chrome): Tap the three-dot menu icon in top right, then tap "Install App" or "Add to Home Screen".'
      );
    }
  };

  const [favorites, setFavorites] = useState<string[]>(() => {
    return currentUser ? authStorage.getUserFavorites(currentUser.id) : [];
  });

  useEffect(() => {
    if (currentUser) {
      setFavorites(authStorage.getUserFavorites(currentUser.id));
    }
  }, [currentUser?.id]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      if (currentUser) {
        authStorage.saveUserFavorites(currentUser.id, next);
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

  // Difficulty Tier Stats
  const easyPuzzles = puzzles.filter(p => p.difficulty === 'Easy');
  const mediumPuzzles = puzzles.filter(p => p.difficulty === 'Medium');
  const hardPuzzles = puzzles.filter(p => p.difficulty === 'Hard');

  const solvedEasy = easyPuzzles.filter(p => progress[p.id]?.solved).length;
  const solvedMedium = mediumPuzzles.filter(p => progress[p.id]?.solved).length;
  const solvedHard = hardPuzzles.filter(p => progress[p.id]?.solved).length;

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

  // Sorting
  const diffRankAsc: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
  const diffRankDesc: Record<string, number> = { Hard: 1, Medium: 2, Easy: 3 };

  const sortedPuzzles = [...filteredPuzzles].sort((a, b) => {
    if (sortBy === 'difficulty-asc') {
      const diffA = diffRankAsc[a.difficulty] || 99;
      const diffB = diffRankAsc[b.difficulty] || 99;
      if (diffA !== diffB) return diffA - diffB;
      return (a.number || 0) - (b.number || 0);
    }
    if (sortBy === 'difficulty-desc') {
      const diffA = diffRankDesc[a.difficulty] || 99;
      const diffB = diffRankDesc[b.difficulty] || 99;
      if (diffA !== diffB) return diffA - diffB;
      return (a.number || 0) - (b.number || 0);
    }
    if (sortBy === 'stars-desc') {
      const starsA = progress[a.id]?.starsEarned ?? progress[a.id]?.stars ?? 0;
      const starsB = progress[b.id]?.starsEarned ?? progress[b.id]?.stars ?? 0;
      if (starsA !== starsB) return starsB - starsA;
      return (a.number || 0) - (b.number || 0);
    }
    if (sortBy === 'name-asc') {
      const nameA = a.name || a.title || '';
      const nameB = b.name || b.title || '';
      return nameA.localeCompare(nameB);
    }
    if (sortBy === 'number-asc') {
      return (a.number || 0) - (b.number || 0);
    }
    return 0;
  });

  const categories: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: 'All Puzzles', value: 'All', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Favorites', value: 'favorites', icon: <BookmarkCheck className="w-4 h-4 text-amber-400" /> },
    { label: 'Logical', value: 'logical', icon: <Brain className="w-4 h-4" /> },
    { label: 'Math & Analytical', value: 'math', icon: <Calculator className="w-4 h-4" /> },
    { label: 'Arrangement', value: 'arrangement', icon: <Grid className="w-4 h-4" /> },
    { label: 'Shape & Spatial', value: 'spatial', icon: <Shapes className="w-4 h-4" /> },
  ];

  // Helper to render tier puzzle list
  const renderTierPuzzleList = (tierPuzzles: PuzzleMeta[], tierColor: string) => (
    <div className="flex flex-col gap-2 pt-1">
      {tierPuzzles.map(pz => {
        const isDone = progress[pz.id]?.solved;
        const stars = progress[pz.id]?.starsEarned ?? progress[pz.id]?.stars ?? 0;
        return (
          <div
            key={pz.id}
            onClick={() => { sound.playClick(); onSelectPuzzle(pz); }}
            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.01] ${
              isDone
                ? `bg-${tierColor}-500/8 border-${tierColor}-500/20 text-slate-200`
                : 'bg-white/[0.02] border-white/[0.04] text-slate-300 hover:border-white/[0.08]'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="text-lg">{pz.icon}</span>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">
                  #{pz.number}. {pz.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{pz.companies.slice(0, 2).join(', ')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isDone ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-amber-400 font-mono flex items-center">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {stars}
                  </span>
                </span>
              ) : (
                <span className={`text-[11px] font-bold ${themeConfig.primaryColor} flex items-center gap-0.5`}>
                  Play <ArrowRight className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={`min-h-screen ${themeConfig.bgClass} text-slate-200 flex flex-col relative transition-colors duration-500`}>
      {/* Dynamic Ambient Theme Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] pointer-events-none blur-3xl opacity-30 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at top, ${themeConfig.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* ─── Top Header Bar ─── */}
      <header className="pt-safe flex items-center justify-between px-3.5 sm:px-6 pb-2.5 sm:pb-3.5 bg-slate-900/50 border-b border-white/[0.04] backdrop-blur-2xl sticky top-0 z-40 w-full max-w-full relative">
        {/* Gradient Accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: themeConfig.headerAccent }}
        />

        {/* Brand */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 overflow-hidden">
          <div className="relative group">
            <div
              className="absolute -inset-1 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500"
              style={{ background: `rgba(${themeConfig.accentRgb}, 0.4)` }}
            />
            <img
              src="/icon.png"
              alt="Interview Puzzles Logo"
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-lg border border-white/[0.06] object-cover shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-sm sm:text-lg font-black tracking-tight text-white uppercase flex items-center gap-1.5 truncate">
              Interview <span className={`${themeConfig.primaryColor} font-mono text-xs sm:text-base`}>Puzzles</span>
            </h1>
          </div>
        </div>

        {/* Mobile Quick Actions */}
        <div className="flex md:hidden items-center gap-2">
          <div
            className="flex items-center space-x-1 px-2 py-0.5 rounded-full border text-xs font-mono font-bold text-orange-400"
            style={{
              background: 'rgba(251, 146, 60, 0.08)',
              borderColor: 'rgba(251, 146, 60, 0.15)',
            }}
          >
            🔥 {streak}
          </div>
          {currentUser && (
            <button
              onClick={() => setMobileTab('profile')}
              className={`w-7 h-7 rounded-full bg-gradient-to-tr ${themeConfig.gradient} flex items-center justify-center text-[10px] text-white font-black shadow-md shrink-0 ring-2 ring-white/10`}
              title="Candidate Profile"
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </button>
          )}
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center flex-wrap gap-2 sm:space-x-2.5 text-xs sm:text-sm font-medium relative">
          {/* Install App */}
          <button
            onClick={handleInstallApp}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-bold text-slate-200 transition-all duration-300"
            title="Install Mobile App"
          >
            <Smartphone className="w-3.5 h-3.5" style={{ color: themeConfig.dotColor }} />
            <span className="hidden sm:inline">Install App</span>
          </button>

          {/* Theme Picker */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setShowThemePicker(!showThemePicker);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-bold text-slate-200 transition-all duration-300"
              title="Change Color Theme"
            >
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span className="w-2.5 h-2.5 rounded-full inline-block ring-1 ring-white/10" style={{ backgroundColor: themeConfig.dotColor }} />
              <span className="hidden md:inline text-slate-300">{themeConfig.name}</span>
            </button>

            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-52 glass-panel-premium rounded-2xl p-2 z-50 flex flex-col gap-0.5 animate-fade-scale">
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
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
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isCur ? 'bg-white/[0.08] text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full shrink-0 ring-1 ring-white/10" style={{ backgroundColor: t.dotColor }} />
                        <span>{t.name}</span>
                      </div>
                      {isCur && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cheat Sheet */}
          <button
            onClick={() => { sound.playClick(); setShowCheatSheet(true); }}
            className={`flex items-center space-x-1.5 ${themeConfig.badgeBg} hover:opacity-90 ${themeConfig.badgeText} border ${themeConfig.badgeBorder} px-3 py-1.5 rounded-full transition-all duration-300`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Cheat Sheet</span>
          </button>

          {/* Audio Mute */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute SFX' : 'Mute SFX'}
            className="hidden sm:flex p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-white transition-all duration-300"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" style={{ color: themeConfig.dotColor }} />}
          </button>

          {/* Progress Pill */}
          <div
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border"
            style={{
              background: `rgba(${themeConfig.accentRgb}, 0.06)`,
              borderColor: `rgba(${themeConfig.accentRgb}, 0.12)`,
            }}
          >
            <span className="text-slate-500 uppercase text-[10px] tracking-widest font-bold">Solved</span>
            <span className={`${themeConfig.primaryColor} font-mono font-bold`}>
              {solvedCount < 10 ? `0${solvedCount}` : solvedCount} / {puzzles.length}
            </span>
          </div>

          {/* Stars Pill */}
          <div className="flex items-center space-x-1.5 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/[0.06]">
            <span className="text-slate-500 uppercase text-[10px] tracking-widest font-bold">Stars</span>
            <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {totalStarsEarned}
            </span>
          </div>

          {/* Streak Pill */}
          <div
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border"
            style={{
              background: 'rgba(251, 146, 60, 0.06)',
              borderColor: 'rgba(251, 146, 60, 0.12)',
            }}
          >
            <span className="text-orange-400 font-bold italic font-mono flex items-center gap-1">
              🔥 {streak}
            </span>
          </div>

          {/* Reset */}
          <button
            onClick={onResetProgress}
            title="Reset Progress"
            className="hidden sm:flex p-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white rounded-full border border-white/[0.06] transition-all duration-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* User Profile */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => { sound.playClick(); setShowProfileMenu(!showProfileMenu); }}
                className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-bold text-slate-200 transition-all duration-300"
                title="Candidate Profile"
              >
                <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${themeConfig.gradient} flex items-center justify-center text-[10px] text-white font-black shrink-0 ring-1 ring-white/10`}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline max-w-[95px] truncate text-xs text-slate-300">
                  {currentUser.name}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-extrabold ${themeConfig.badgeBg} ${themeConfig.badgeText} border ${themeConfig.badgeBorder} hidden lg:inline`}>
                  {currentUser.targetCompany}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 glass-panel-premium rounded-2xl p-4 z-50 flex flex-col gap-3 animate-fade-scale">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/[0.04]">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${themeConfig.gradient} flex items-center justify-center text-sm text-white font-black shadow-md shrink-0`}>
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-black text-white truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                      <div className={`text-[10px] ${themeConfig.primaryColor} font-bold mt-0.5 truncate`}>
                        {currentUser.targetCompany} • {currentUser.targetRole}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                    <div className="p-2 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                      <div className={`font-mono font-black text-xs ${themeConfig.primaryColor}`}>
                        {solvedCount} / {puzzles.length}
                      </div>
                      <div className="text-slate-600 font-bold uppercase mt-0.5">Solved</div>
                    </div>
                    <div className="p-2 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                      <div className="font-mono font-black text-xs text-amber-400 flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {totalStarsEarned}
                      </div>
                      <div className="text-slate-600 font-bold uppercase mt-0.5">Stars</div>
                    </div>
                  </div>

                  {onLogout && (
                    <button
                      onClick={() => { setShowProfileMenu(false); onLogout(); }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-500/8 hover:bg-rose-500/15 text-rose-300 border border-rose-500/20 text-xs font-bold transition-all duration-300"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out / Switch Candidate</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ─── Category Navigation ─── */}
      <nav className={`${mobileTab === 'puzzles' ? 'flex' : 'hidden md:flex'} border-b border-white/[0.03] bg-slate-900/30 px-3 sm:px-6 overflow-x-auto scrollbar-none z-20 backdrop-blur-xl gap-0.5 sm:gap-1`}>
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
              onClick={() => { sound.playClick(); setSelectedCategory(c.value); }}
              className={`px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 sm:gap-2 border-b-2 shrink-0 ${
                isActive
                  ? `border-current ${themeConfig.primaryColor}`
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {c.icon}
              <span>{c.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? `${themeConfig.badgeBg} ${themeConfig.badgeText} border ${themeConfig.badgeBorder}`
                    : 'bg-white/[0.04] text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Global Progress Line */}
      <div className="w-full bg-slate-950 h-0.5 overflow-hidden">
        <div
          className={`${themeConfig.progressClass} h-full transition-all duration-700 ease-out`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 relative z-10 pb-24 md:pb-8">

        {/* Mobile Tab: Tiers Roadmap */}
        {mobileTab === 'tiers' && (
          <div className="md:hidden flex flex-col gap-5 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Layers className={`w-5 h-5 ${themeConfig.primaryColor}`} />
                  Difficulty Roadmap
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Progressive 3-Tier FAANG Preparation</p>
              </div>
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${themeConfig.badgeBg} ${themeConfig.badgeText} border ${themeConfig.badgeBorder}`}>
                {solvedCount} / {puzzles.length} Solved
              </span>
            </div>

            {/* Tier 1: Easy */}
            <div className="glass-panel-premium rounded-2xl p-4 flex flex-col gap-3" style={{ borderColor: 'rgba(34, 197, 94, 0.15)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <h3 className="text-sm font-black text-white">Tier 1: Easy Fundamentals</h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 border border-green-500/20">Levels 1–5</span>
                </div>
                <span className="text-xs font-mono font-black text-green-400">{solvedEasy} / 5</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(solvedEasy / 5) * 100}%` }} />
              </div>
              <p className="text-[11px] text-slate-500">
                Foundational logic, binary state machines, invariance testing, and parity puzzles. Perfect for warmups and screen rounds.
              </p>
              {renderTierPuzzleList(easyPuzzles, 'green')}
            </div>

            {/* Tier 2: Medium */}
            <div className="glass-panel-premium rounded-2xl p-4 flex flex-col gap-3" style={{ borderColor: 'rgba(234, 179, 8, 0.15)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <h3 className="text-sm font-black text-white">Tier 2: Medium Core FAANG</h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/20">Levels 6–19</span>
                </div>
                <span className="text-xs font-mono font-black text-yellow-400">{solvedMedium} / 14</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-yellow-500 h-full transition-all duration-500" style={{ width: `${(solvedMedium / 14) * 100}%` }} />
              </div>
              <p className="text-[11px] text-slate-500">
                Probability, state machines, recursive transitions, and minimax optimization. Core interview round material.
              </p>
              <div className="flex flex-col gap-2 pt-1 max-h-96 overflow-y-auto pr-1">
                {mediumPuzzles.map(pz => {
                  const isDone = progress[pz.id]?.solved;
                  const stars = progress[pz.id]?.starsEarned ?? progress[pz.id]?.stars ?? 0;
                  return (
                    <div
                      key={pz.id}
                      onClick={() => { sound.playClick(); onSelectPuzzle(pz); }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.01] ${
                        isDone
                          ? 'bg-yellow-500/8 border-yellow-500/20 text-slate-200'
                          : 'bg-white/[0.02] border-white/[0.04] text-slate-300 hover:border-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <span className="text-lg">{pz.icon}</span>
                        <div className="truncate">
                          <div className="text-xs font-bold text-white truncate">#{pz.number}. {pz.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{pz.companies.slice(0, 2).join(', ')}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isDone ? (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-amber-400 font-mono flex items-center"><Star className="w-3 h-3 fill-amber-400" />{stars}</span>
                          </span>
                        ) : (
                          <span className={`text-[11px] font-bold ${themeConfig.primaryColor} flex items-center gap-0.5`}>Play <ArrowRight className="w-3 h-3" /></span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tier 3: Hard */}
            <div className="glass-panel-premium rounded-2xl p-4 flex flex-col gap-3" style={{ borderColor: 'rgba(239, 68, 68, 0.15)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <h3 className="text-sm font-black text-white">Tier 3: Hard FAANG Challenge</h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/20">Levels 20–25</span>
                </div>
                <span className="text-xs font-mono font-black text-red-400">{solvedHard} / 6</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${(solvedHard / 6) * 100}%` }} />
              </div>
              <p className="text-[11px] text-slate-500">
                Information theory, binary encoding, ternary decision trees, and extreme minimax DP. Senior/Staff candidate level.
              </p>
              {renderTierPuzzleList(hardPuzzles, 'red')}
            </div>
          </div>
        )}

        {/* Mobile Tab: Mastery & Stats */}
        {mobileTab === 'stats' && (
          <div className="md:hidden flex flex-col gap-5 animate-slide-up">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <BarChart3 className={`w-5 h-5 ${themeConfig.primaryColor}`} />
                Candidate Mastery
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time Performance & Technical Readiness</p>
            </div>

            {/* Main Stats Card */}
            <div className="glass-panel-premium rounded-3xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500">FAANG Readiness</span>
                  <div className={`text-3xl font-black font-mono mt-1 bg-gradient-to-r ${themeConfig.gradient} text-gradient`}>
                    {progressPercentage}%
                  </div>
                  <div className="text-xs text-slate-500">{solvedCount} of 25 Puzzles Cleared</div>
                </div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg"
                  style={{
                    background: `rgba(${themeConfig.accentRgb}, 0.1)`,
                    border: `1px solid rgba(${themeConfig.accentRgb}, 0.15)`,
                  }}
                >
                  🎯
                </div>
              </div>

              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-white/[0.04]">
                <div className={`${themeConfig.progressClass} h-full transition-all duration-700`} style={{ width: `${progressPercentage}%` }} />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.04]">
                  <div className="flex items-center gap-1.5 text-amber-400 font-black text-lg">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{totalStarsEarned}</span>
                    <span className="text-slate-600 text-xs font-normal">/ 75</span>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Total Stars</div>
                </div>

                <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.04]">
                  <div className="flex items-center gap-1.5 text-orange-400 font-black text-lg">
                    <Flame className="w-4 h-4 fill-orange-400" />
                    <span>{streak} Days</span>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Daily Streak</div>
                </div>
              </div>
            </div>

            {/* Candidate Level Ranking */}
            <div
              className="glass-panel-premium rounded-2xl p-4 flex items-center gap-3.5"
              style={{ borderColor: `rgba(${themeConfig.accentRgb}, 0.1)` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{
                  background: `rgba(${themeConfig.accentRgb}, 0.1)`,
                  border: `1px solid rgba(${themeConfig.accentRgb}, 0.15)`,
                }}
              >
                <Award className={`w-6 h-6 ${themeConfig.primaryColor}`} />
              </div>
              <div>
                <div className={`text-[10px] uppercase font-extrabold ${themeConfig.primaryColor} tracking-wider`}>Candidate Rank</div>
                <div className="text-sm font-black text-white">
                  {solvedCount >= 25 ? 'Staff Engineer / Principal Architect' : solvedCount >= 18 ? 'Senior FAANG Software Engineer' : solvedCount >= 10 ? 'Mid-Level Software Engineer (L4)' : solvedCount >= 4 ? 'Junior Software Engineer (L3)' : 'Candidate in Training'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {25 - solvedCount === 0 ? 'All 25 puzzles solved! Outstanding work.' : `${25 - solvedCount} puzzles left to achieve Grandmaster.`}
                </div>
              </div>
            </div>

            {/* Domain Performance */}
            <div className="glass-panel-premium rounded-2xl p-4 flex flex-col gap-3">
              <div className="text-xs font-extrabold text-white uppercase tracking-wider">Domain Performance</div>
              {[
                { name: 'Logic & Deduction', icon: '🧠', cat: 'logic' },
                { name: 'Math & Counting', icon: '🔢', cat: 'math' },
                { name: 'Grid & Strategy', icon: '📐', cat: 'grid' },
                { name: 'Lateral Thinking', icon: '✨', cat: 'lateral' },
              ].map(domain => {
                const totalInCat = puzzles.filter(p => p.category === domain.cat).length;
                const solvedInCat = puzzles.filter(p => p.category === domain.cat && progress[p.id]?.solved).length;
                const pct = totalInCat > 0 ? Math.round((solvedInCat / totalInCat) * 100) : 0;
                return (
                  <div key={domain.cat} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <span>{domain.icon}</span>
                        <span>{domain.name}</span>
                      </span>
                      <span className="font-mono text-slate-500 font-bold">
                        {solvedInCat} / {totalInCat} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className={`${themeConfig.progressClass} h-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => { sound.playClick(); setShowCheatSheet(true); }}
                className={`w-full py-3 rounded-xl ${themeConfig.badgeBg} border ${themeConfig.badgeBorder} ${themeConfig.badgeText} text-xs font-bold flex items-center justify-center gap-2`}
              >
                <BookOpen className="w-4 h-4" />
                Open Interview Formula Cheat Sheet
              </button>
              <button
                onClick={onResetProgress}
                className="w-full py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-slate-500 hover:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All Solved Progress
              </button>
            </div>
          </div>
        )}

        {/* Mobile Tab: Profile & App Settings */}
        {mobileTab === 'profile' && (
          <div className="md:hidden flex flex-col gap-5 animate-slide-up">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <User className={`w-5 h-5 ${themeConfig.primaryColor}`} />
                Candidate Profile
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Account Details & Mobile App Preferences</p>
            </div>

            {/* User Card */}
            {currentUser && (
              <div className="glass-panel-premium rounded-3xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${themeConfig.gradient} flex items-center justify-center text-xl text-white font-black shadow-lg shrink-0 ring-2 ring-white/10`}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-base font-black text-white truncate">{currentUser.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${themeConfig.badgeBg} ${themeConfig.badgeText} border ${themeConfig.badgeBorder}`}>
                        {currentUser.targetCompany}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold truncate">
                        {currentUser.targetRole}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04]">
                  <div className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.04] text-center">
                    <div className={`text-base font-mono font-black ${themeConfig.primaryColor}`}>
                      {solvedCount} / {puzzles.length}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-600">Puzzles Solved</div>
                  </div>
                  <div className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.04] text-center">
                    <div className="text-base font-mono font-black text-amber-400 flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {totalStarsEarned}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-600">Total Stars</div>
                  </div>
                </div>
              </div>
            )}

            {/* App Actions */}
            <div className="glass-panel-premium rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">App Actions</div>

              <button
                onClick={handleInstallApp}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-white hover:border-emerald-400/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-xs font-black">Install Mobile App (PWA)</div>
                    <div className="text-[10px] text-emerald-300/60">Add to your Home Screen for instant offline access</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={handleToggleMute}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-slate-300 hover:text-white transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" style={{ color: themeConfig.dotColor }} />}
                  <div className="text-left">
                    <div className="text-xs font-bold">Sound Effects & Chimes</div>
                    <div className="text-[10px] text-slate-500">{isMuted ? 'Muted' : 'Enabled (Audio Synthesizer)'}</div>
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${isMuted ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                  {isMuted ? 'OFF' : 'ON'}
                </span>
              </button>

              <button
                onClick={() => { sound.playClick(); setShowCheatSheet(true); }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-slate-300 hover:text-white transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5" style={{ color: themeConfig.dotColor }} />
                  <div className="text-left">
                    <div className="text-xs font-bold">Formula Cheat Sheet</div>
                    <div className="text-[10px] text-slate-500">Bayes, Divisors, Recursion & Pigeonhole</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Theme Selector */}
            <div className="glass-panel-premium rounded-2xl p-4 flex flex-col gap-3">
              <div className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Cyber Theme</span>
                <span className={`text-[10px] ${themeConfig.primaryColor} font-mono`}>{themeConfig.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(THEMES).map(tKey => {
                  const t = THEMES[tKey as ThemeId];
                  const isCur = theme === tKey;
                  return (
                    <button
                      key={tKey}
                      onClick={() => { sound.playClick(); onSetTheme(tKey as ThemeId); }}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all duration-300 text-left ${
                        isCur ? 'bg-white/[0.06] border-white/20 text-white font-bold' : 'bg-white/[0.02] border-white/[0.04] text-slate-500 hover:border-white/[0.08]'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full shrink-0 ring-1 ring-white/10" style={{ backgroundColor: t.dotColor }} />
                      <span className="text-xs truncate">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-rose-500/8 hover:bg-rose-500/15 text-rose-300 border border-rose-500/20 text-xs font-bold transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Sign Out / Switch Candidate
              </button>
            )}
          </div>
        )}

        {/* ─── Puzzles Catalog ─── */}
        <div className={`${mobileTab === 'puzzles' ? 'flex' : 'hidden md:flex'} flex-col gap-4 sm:gap-6`}>
          {/* Mobile Compact Hero Banner */}
          <div className="md:hidden rounded-2xl p-3 glass-panel-premium flex flex-col gap-2 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${themeConfig.badgeBg} ${themeConfig.badgeBorder} ${themeConfig.badgeText} shrink-0`}>
                  FAANG Prep
                </span>
                <span className="text-slate-700 text-xs">•</span>
                <span className="text-[10px] text-slate-400 font-bold truncate">
                  {currentUser?.targetCompany || 'Tier-1'} Ready
                </span>
              </div>
              <span className={`text-xs font-mono font-black ${themeConfig.primaryColor} shrink-0`}>
                {solvedCount}/25 ({progressPercentage}%)
              </span>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/[0.03]">
              <div className={`${themeConfig.progressClass} h-full transition-all duration-700`} style={{ width: `${progressPercentage}%` }} />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
              <div className="flex items-center gap-1 font-semibold text-white">
                <span>🎮</span> 25 Simulations
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3 h-3 fill-amber-400" /> {totalStarsEarned}/75
                </span>
                <span className="text-slate-700">|</span>
                <span className="flex items-center gap-1 text-orange-400 font-bold">🔥 {streak}d</span>
              </div>
            </div>
          </div>

          {/* Desktop Hero Header Banner */}
          <div className="hidden md:flex relative rounded-3xl overflow-hidden p-6 sm:p-8 glass-panel-premium flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-slide-up">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${themeConfig.badgeBg} ${themeConfig.badgeBorder} ${themeConfig.badgeText}`}>
                  FAANG & Tier-1 Interview Preparation
                </span>
                <span className="text-slate-700 text-xs">•</span>
                <span className="text-xs font-semibold text-slate-500">25 Interactive Simulations</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Master Technical Puzzles Through{' '}
                <span className={`bg-gradient-to-r ${themeConfig.gradient} text-gradient`}>
                  Playable Games & Visual Logic
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed font-normal">
                Test constraints directly, experiment with edge cases, and discover mathematical invariants.
                Each puzzle is accompanied by progressive hints, full mathematical breakdowns, and algorithmic insights.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
              <div
                className="p-3.5 rounded-2xl border flex flex-col justify-center min-w-[130px]"
                style={{
                  background: `rgba(${themeConfig.accentRgb}, 0.06)`,
                  borderColor: `rgba(${themeConfig.accentRgb}, 0.12)`,
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mastery</span>
                <div className={`text-2xl font-black font-mono bg-gradient-to-r ${themeConfig.gradient} text-gradient mt-0.5`}>
                  {progressPercentage}%
                </div>
                <span className="text-[10px] text-slate-600 mt-0.5">{solvedCount} of 25 Solved</span>
              </div>

              <div className="p-3.5 bg-white/[0.03] rounded-2xl border border-white/[0.06] flex flex-col justify-center min-w-[130px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Star Rating</span>
                <div className="text-2xl font-black font-mono text-amber-400 mt-0.5 flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  {totalStarsEarned}
                </div>
                <span className="text-[10px] text-slate-600 mt-0.5">out of 75 total</span>
              </div>
            </div>
          </div>

          {/* ─── Search, Difficulty, and Company Filter Toolbar ─── */}
          <div className="flex flex-col gap-2.5 sm:gap-3.5 glass-panel-premium p-3 sm:p-4 rounded-2xl animate-slide-up stagger-2" style={{ opacity: 0, animationFillMode: 'forwards' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
              {/* Search Input */}
              <div className="relative w-full sm:w-88">
                <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search puzzle, concept, or company..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-white/20 transition-all duration-300"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Difficulty & Sort */}
              <div className="flex items-center justify-between gap-1.5 w-full sm:w-auto">
                <div className="flex items-center gap-1">
                  {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => {
                    const isCur = selectedDifficulty === d;
                    return (
                      <button
                        key={d}
                        onClick={() => { sound.playClick(); setSelectedDifficulty(d); }}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold border transition-all duration-300 uppercase tracking-wider shrink-0 ${
                          isCur
                            ? `${themeConfig.buttonClass} shadow-md`
                            : 'bg-white/[0.02] border-white/[0.04] text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                        }`}
                        style={isCur ? { boxShadow: `0 4px 16px rgba(${themeConfig.accentRgb}, 0.15)` } : {}}
                      >
                        {d === 'Medium' ? (
                          <>
                            <span className="sm:hidden">Med</span>
                            <span className="hidden sm:inline">Medium</span>
                          </>
                        ) : d}
                      </button>
                    );
                  })}
                </div>

                {/* Sort Dropdown */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => { sound.playClick(); setShowSortPicker(!showSortPicker); }}
                    className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-[10px] sm:text-xs font-bold text-slate-300 transition-all duration-300 whitespace-nowrap shrink-0"
                    title="Sort Puzzles"
                  >
                    <ArrowUpDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${themeConfig.primaryColor}`} />
                    <span className="hidden md:inline text-slate-500">Sort:</span>
                    <span className="text-white font-semibold">
                      {sortBy === 'difficulty-asc' ? 'Easy ↗' : sortBy === 'difficulty-desc' ? 'Hard ↘' : sortBy === 'number-asc' ? '1–25' : sortBy === 'stars-desc' ? 'Stars' : 'A–Z'}
                    </span>
                  </button>

                  {showSortPicker && (
                    <div className="absolute right-0 mt-2 w-56 glass-panel-premium rounded-2xl p-2 z-50 flex flex-col gap-0.5 animate-fade-scale">
                      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Sort Progression</div>
                      {[
                        { id: 'difficulty-asc', label: 'Difficulty: Easy → Hard (Recommended)' },
                        { id: 'difficulty-desc', label: 'Difficulty: Hard → Easy' },
                        { id: 'number-asc', label: 'Puzzle Number (1 → 25)' },
                        { id: 'stars-desc', label: 'Highest Stars Earned' },
                        { id: 'name-asc', label: 'Alphabetical (A → Z)' },
                      ].map(opt => {
                        const isCur = sortBy === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => { sound.playClick(); setSortBy(opt.id as SortOption); setShowSortPicker(false); }}
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all duration-200 ${
                              isCur ? 'bg-white/[0.08] text-white font-bold' : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isCur && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Company Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mr-1.5 whitespace-nowrap flex items-center gap-1 shrink-0">
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                Company:
              </span>
              {POPULAR_COMPANIES.map(comp => {
                const isCur = selectedCompany === comp;
                return (
                  <button
                    key={comp}
                    onClick={() => { sound.playClick(); setSelectedCompany(comp); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-300 whitespace-nowrap shrink-0 ${
                      isCur
                        ? `${themeConfig.badgeBg} ${themeConfig.badgeBorder} ${themeConfig.badgeText} font-bold`
                        : 'bg-white/[0.02] border-white/[0.04] text-slate-500 hover:text-slate-300 hover:border-white/[0.08]'
                    }`}
                  >
                    {comp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Progression Tier Bar (Desktop Only) */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { diff: 'Easy', label: 'Easy Fundamentals', emoji: '🟢', count: 5, solved: solvedEasy, color: 'green', levels: 'Levels 1–5' },
              { diff: 'Medium', label: 'Medium Core Round', emoji: '🟡', count: 14, solved: solvedMedium, color: 'yellow', levels: 'Levels 6–19' },
              { diff: 'Hard', label: 'Hard FAANG Challenge', emoji: '🔴', count: 6, solved: solvedHard, color: 'red', levels: 'Levels 20–25' },
            ].map(tier => (
              <div
                key={tier.diff}
                onClick={() => { sound.playClick(); setSelectedDifficulty(selectedDifficulty === tier.diff ? 'All' : tier.diff); }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between hover:scale-[1.01] ${
                  selectedDifficulty === tier.diff
                    ? `bg-${tier.color}-500/10 border-${tier.color}-500/30 shadow-lg shadow-${tier.color}-500/5`
                    : 'bg-white/[0.02] border-white/[0.04] hover:border-white/[0.08]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl bg-${tier.color}-500/15 border border-${tier.color}-500/20 flex items-center justify-center text-sm font-bold`}>
                    {tier.emoji}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <span>{tier.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded bg-${tier.color}-500/15 text-${tier.color}-400 border border-${tier.color}-500/20 font-mono font-bold`}>
                        {tier.count}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{tier.levels}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-mono font-bold text-${tier.color}-400`}>{tier.solved} / {tier.count}</span>
                  <div className="text-[9px] text-slate-600 font-medium">Completed</div>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Puzzle Cards Grid ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {sortedPuzzles.map((puzzle, idx) => {
              const puzzleProgress = progress[puzzle.id];
              const isSolved = puzzleProgress?.solved || false;
              const stars = puzzleProgress?.starsEarned ?? puzzleProgress?.stars ?? 0;
              const title = puzzle.name || puzzle.title || '';
              const desc = puzzle.problemStatement || puzzle.statement || '';
              const isFavorite = favorites.includes(puzzle.id);

              return (
                <div
                  key={puzzle.id}
                  onClick={() => { sound.playClick(); onSelectPuzzle(puzzle); }}
                  className={`group cursor-pointer rounded-2xl border transition-all duration-300 p-3.5 sm:p-5 flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden animate-slide-up ${
                    isSolved
                      ? 'bg-emerald-500/[0.04] border-emerald-500/20 hover:border-emerald-500/40'
                      : `bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12] ${themeConfig.cardGlowHover}`
                  }`}
                  style={{
                    animationDelay: `${Math.min(idx * 0.04, 0.5)}s`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
                  }}
                >
                  {/* Top Accent Line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: isSolved ? 'linear-gradient(90deg, #10b981, #14b8a6)' : themeConfig.headerAccent }}
                  />

                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-xl sm:text-2xl transform group-hover:scale-110 transition-transform duration-300 shrink-0">
                          {puzzle.icon}
                        </span>
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg flex items-center gap-1.5 shrink-0 ${
                            puzzle.difficulty === 'Easy'
                              ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                              : puzzle.difficulty === 'Medium'
                              ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                              : 'bg-red-500/15 text-red-400 border border-red-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            puzzle.difficulty === 'Easy' ? 'bg-green-400' : puzzle.difficulty === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'
                          }`} />
                          {puzzle.difficulty}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 bg-white/[0.03] px-1.5 py-0.5 rounded-lg border border-white/[0.04] shrink-0">
                          #{puzzle.number}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={e => toggleFavorite(puzzle.id, e)}
                          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          className="p-1 rounded-lg text-slate-600 hover:text-amber-400 hover:bg-white/[0.04] transition-all duration-200"
                        >
                          {isFavorite ? (
                            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <div className="flex items-center gap-0.5 bg-white/[0.03] px-1.5 py-0.5 rounded-full border border-white/[0.04]">
                          {[1, 2, 3].map(s => (
                            <Star
                              key={s}
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-all duration-300 ${
                                stars >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-white transition-colors tracking-tight leading-snug">
                      {title}
                    </h3>

                    {/* Snippet */}
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-3.5 sm:mt-5 pt-2.5 sm:pt-3.5 border-t border-white/[0.04] flex items-center justify-between gap-2 overflow-hidden">
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-slate-500 font-medium truncate flex-1 min-w-0 mr-2">
                      <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-slate-600" />
                      <span className="truncate px-1.5 py-0.5 bg-white/[0.03] rounded-lg uppercase font-bold text-slate-400 border border-white/[0.04]">
                        {puzzle.companies.slice(0, 2).join(', ')}
                      </span>
                    </div>

                    <span className={`text-xs font-bold ${themeConfig.primaryColor} group-hover:underline flex items-center gap-1 transition-all duration-300`}>
                      {isSolved ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Practice
                        </span>
                      ) : (
                        <>
                          <span>Play Game</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPuzzles.length === 0 && (
            <div className="p-12 text-center text-slate-500 text-sm glass-panel-premium rounded-3xl">
              No puzzles match your filter. Try clearing your search query or selecting a different category!
            </div>
          )}
        </div>
      </main>

      {/* Bottom Mobile Navigation Bar */}
      <MobileNavBar
        activeTab={mobileTab}
        onSelectTab={tab => {
          sound.playClick();
          setMobileTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        solvedCount={solvedCount}
        totalPuzzles={puzzles.length}
        streak={streak}
        theme={theme}
      />

      {/* ─── Formula Cheat Sheet Modal ─── */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="glass-panel-premium rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-fade-scale relative">
            {/* Shimmer Accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] animate-shimmer"
              style={{ background: themeConfig.headerAccent, backgroundSize: '200% auto' }}
            />

            {/* Modal Header */}
            <div className="p-6 border-b border-white/[0.04] flex items-center justify-between bg-slate-900/50 sticky top-0 z-10 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-2xl"
                  style={{
                    background: `rgba(${themeConfig.accentRgb}, 0.1)`,
                    border: `1px solid rgba(${themeConfig.accentRgb}, 0.15)`,
                  }}
                >
                  <BookOpen className={`w-5 h-5 ${themeConfig.primaryColor}`} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                    Interview Formula & Logic Cheat Sheet
                  </h2>
                  <p className="text-xs text-slate-500">Essential mathematical paradigms for FAANG puzzle rounds</p>
                </div>
              </div>

              <button
                onClick={() => setShowCheatSheet(false)}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
              {[
                { title: '📐 1. Bézout\'s Identity & Linear Diophantine Equations', formula: 'ax + by = d is solvable iff gcd(a, b) divides d', desc: 'Used in Water Jug Problem. You can measure any target amount that is an integer multiple of the greatest common divisor of the two jugs.' },
                { title: '⚖️ 2. Information Theory & Ternary Pan Scales', formula: 'Outcomes = 3^k ≥ N coins', desc: 'Used in Counterfeit Coin & Balance Scale. A balance scale has 3 states: Left heavier, Right heavier, or Equal. Thus, each weighing divides candidate states by 3.' },
                { title: '🚪 3. Divisor Pairs & Factor Parity', formula: 'd(n) is odd ⟺ n is a perfect square (k²)', desc: 'Used in The 100 Doors Problem. Every integer has divisors that come in pairs (a × b = n), except perfect squares where √n × √n is paired with itself.' },
                { title: '🗼 4. Divide-and-Conquer & Hanoi Recursion', formula: 'T(n) = 2T(n-1) + 1 = 2^n - 1', desc: 'Used in Tower of Hanoi. Moving n disks requires moving n-1 disks to auxiliary rod, moving bottom disk, and moving n-1 disks onto destination.' },
                { title: '🥚 5. Triangular Numbers & Minimax Balancing', formula: 'x(x + 1) / 2 ≥ Floors', desc: 'Used in 2 Eggs & 100 Floors. To keep worst-case constant across all floors, successive drops decrease step size by 1 (x + x-1 + x-2 ... + 1 ≥ 100 ⟹ x = 14 drops).' },
                { title: '🎲 6. Bayes\' Theorem & Monty Hall', formula: 'P(A|B) = [P(B|A) × P(A)] / P(B)', desc: 'Used in Monty Hall Problem. Initial pick has 1/3 probability of car; the host\'s informed goat reveal transfers the combined 2/3 probability to the unopened door.' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-white/[0.02] rounded-2xl border border-white/[0.04] relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                    style={{ background: themeConfig.headerAccent }}
                  />
                  <div className={`text-xs font-bold ${themeConfig.primaryColor} uppercase tracking-wider mb-1 flex items-center gap-1.5 pl-2`}>
                    {item.title}
                  </div>
                  <div className="font-mono text-slate-200 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.04] text-[11px] mb-2 inline-block ml-2">
                    {item.formula}
                  </div>
                  <p className="text-slate-500 leading-relaxed pl-2">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/60 border-t border-white/[0.04] flex justify-end">
              <button
                onClick={() => setShowCheatSheet(false)}
                className={`px-5 py-2 rounded-xl ${themeConfig.buttonClass} font-bold text-xs transition-all duration-300 hover:scale-105`}
                style={{ boxShadow: themeConfig.glowShadow }}
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
