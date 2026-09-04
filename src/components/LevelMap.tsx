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
} from 'lucide-react';
import { PuzzleMeta, PuzzleProgress } from '../types';

interface Props {
  puzzles: PuzzleMeta[];
  progress: Record<string, PuzzleProgress>;
  onSelectPuzzle: (puzzle: PuzzleMeta) => void;
  onResetProgress: () => void;
  streak: number;
}

export const LevelMap: React.FC<Props> = ({
  puzzles,
  progress,
  onSelectPuzzle,
  onResetProgress,
  streak,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

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
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const title = p.name || p.title || '';
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.companies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const categories: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: 'All Puzzles', value: 'All', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Logical', value: 'logical', icon: <Brain className="w-4 h-4" /> },
    { label: 'Math & Analytical', value: 'math', icon: <Calculator className="w-4 h-4" /> },
    { label: 'Arrangement', value: 'arrangement', icon: <Grid className="w-4 h-4" /> },
    { label: 'Shape & Spatial', value: 'spatial', icon: <Shapes className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col relative">
      {/* Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(79,70,229,0.07)_0%,transparent_65%)] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="flex flex-col sm:flex-row items-center justify-between px-6 py-3.5 bg-slate-900/50 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 text-base">
              P
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white uppercase flex items-center gap-2">
                PuzzleMaster <span className="text-indigo-400">Interview</span>
              </h1>
            </div>
          </div>

          <button
            onClick={onResetProgress}
            title="Reset Progress"
            className="sm:hidden p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sleek Pill Badges */}
        <div className="flex items-center flex-wrap gap-2.5 sm:space-x-4 text-xs sm:text-sm font-medium">
          {/* Progress Pill */}
          <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
            <span className="text-slate-400 uppercase text-[10px] tracking-widest">Progress</span>
            <span className="text-indigo-400 font-mono font-bold">
              {solvedCount < 10 ? `0${solvedCount}` : solvedCount} / {puzzles.length}
            </span>
          </div>

          {/* Stars Pill */}
          <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
            <span className="text-slate-400 uppercase text-[10px] tracking-widest">Stars</span>
            <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {totalStarsEarned}
            </span>
          </div>

          {/* Streak Pill */}
          <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
            <span className="text-slate-400 uppercase text-[10px] tracking-widest">Streak</span>
            <span className="text-orange-500 font-bold italic font-mono flex items-center gap-1">
              🔥 {streak}
            </span>
          </div>

          {/* Reset Button */}
          <button
            onClick={onResetProgress}
            title="Reset Progress"
            className="hidden sm:flex p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Sleek Category Navigation */}
      <nav className="flex border-b border-slate-800 bg-slate-900/30 px-4 sm:px-6 overflow-x-auto scrollbar-none z-20">
        {categories.map(c => {
          const isActive = selectedCategory === c.value;
          const count =
            c.value === 'All'
              ? puzzles.length
              : puzzles.filter(p => p.category === c.value).length;

          return (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-5 sm:px-8 py-3 text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
                isActive
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {c.icon}
              <span>{c.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Global Progress Line */}
      <div className="w-full bg-slate-950 h-1 overflow-hidden border-b border-slate-800/80">
        <div
          className="bg-indigo-500 h-full transition-all duration-500 shadow-sm shadow-indigo-500/50"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Filter & Level Selection Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6 relative z-10">
        {/* Search & Difficulty Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search puzzle, company, or concept..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Difficulty filter buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {['All', 'Easy', 'Medium', 'Hard'].map(d => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition uppercase tracking-wider ${
                  selectedDifficulty === d
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Puzzle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredPuzzles.map(puzzle => {
            const puzzleProgress = progress[puzzle.id];
            const isSolved = puzzleProgress?.solved || false;
            const stars = puzzleProgress?.starsEarned ?? puzzleProgress?.stars ?? 0;
            const title = puzzle.name || puzzle.title || '';
            const desc = puzzle.problemStatement || puzzle.statement || '';

            return (
              <div
                key={puzzle.id}
                onClick={() => onSelectPuzzle(puzzle)}
                className={`group cursor-pointer rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between hover:scale-[1.015] hover:shadow-xl ${
                  isSolved
                    ? 'bg-indigo-600/10 border-indigo-500/30 hover:border-indigo-400/50 hover:bg-indigo-600/15'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  {/* Card Header: Difficulty & Stars */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{puzzle.icon}</span>
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

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            stars >= s
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {title}
                  </h3>

                  {/* Snippet */}
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {desc}
                  </p>
                </div>

                {/* Card Footer: Companies & CTA */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium truncate max-w-[60%]">
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    <span className="truncate px-2 py-0.5 bg-slate-800/80 rounded uppercase font-bold text-slate-400 border border-slate-700/50">
                      {puzzle.companies.slice(0, 2).join(', ')}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    {isSolved ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Practice
                      </span>
                    ) : (
                      'Play Demo →'
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPuzzles.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-sm">
            No puzzles match your filter. Try adjusting your search query or category!
          </div>
        )}
      </main>
    </div>
  );
};
