/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LevelMap } from './components/LevelMap';
import { PuzzlePlayScreen } from './components/PuzzlePlayScreen';
import { PUZZLES } from './data/puzzles';
import { PuzzleMeta, PuzzleProgress } from './types';
import { ThemeId, THEMES } from './utils/theme';
import { sound } from './utils/audio';

const STORAGE_KEY_PROGRESS = 'puzzlemaster_progress_v1';
const STORAGE_KEY_STREAK = 'puzzlemaster_streak_v1';
const STORAGE_KEY_LAST_LOGIN = 'puzzlemaster_last_login_v1';
const STORAGE_KEY_THEME = 'puzzlemaster_theme_v1';

export default function App() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleMeta | null>(null);

  const [theme, setTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME) as ThemeId;
      return saved && THEMES[saved] ? saved : 'cyber-indigo';
    } catch {
      return 'cyber-indigo';
    }
  });

  const [progress, setProgress] = useState<Record<string, PuzzleProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STREAK);
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const handleSetTheme = (newTheme: ThemeId) => {
    sound.playThemeChange();
    setTheme(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, newTheme);
    } catch {
      // ignore
    }
  };

  // Calculate and update daily streak
  useEffect(() => {
    try {
      const lastLogin = localStorage.getItem(STORAGE_KEY_LAST_LOGIN);
      const today = new Date().toDateString();

      if (lastLogin !== today) {
        if (lastLogin) {
          const lastDate = new Date(lastLogin);
          const diffDays = Math.round(
            (new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === 1) {
            const nextStreak = streak + 1;
            setStreak(nextStreak);
            localStorage.setItem(STORAGE_KEY_STREAK, nextStreak.toString());
          } else if (diffDays > 1) {
            setStreak(1);
            localStorage.setItem(STORAGE_KEY_STREAK, '1');
          }
        }
        localStorage.setItem(STORAGE_KEY_LAST_LOGIN, today);
      }
    } catch {
      // localStorage error fallback
    }
  }, []);

  // Save progress
  const handleSaveProgress = (
    puzzleId: string,
    stars: number,
    hintsUsed: number,
    moves: number
  ) => {
    setProgress(prev => {
      const current = prev[puzzleId];
      const highestStars = Math.max(current?.starsEarned || 0, stars);
      const bestMoves = current?.bestMoves ? Math.min(current.bestMoves, moves) : moves;

      const updated = {
        ...prev,
        [puzzleId]: {
          puzzleId,
          solved: true,
          starsEarned: highestStars,
          hintsUsed: Math.max(current?.hintsUsed || 0, hintsUsed),
          bestMoves,
        },
      };

      try {
        localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save progress to localStorage', err);
      }

      return updated;
    });
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your progress and stars?')) {
      sound.playReset();
      setProgress({});
      localStorage.removeItem(STORAGE_KEY_PROGRESS);
    }
  };

  const handleNextPuzzle = () => {
    if (!selectedPuzzle) return;
    const currentIndex = PUZZLES.findIndex(p => p.id === selectedPuzzle.id);
    if (currentIndex !== -1 && currentIndex + 1 < PUZZLES.length) {
      setSelectedPuzzle(PUZZLES[currentIndex + 1]);
    } else {
      setSelectedPuzzle(null);
    }
  };

  const themeConfig = THEMES[theme] || THEMES['cyber-indigo'];

  return (
    <div
      className={`min-h-screen ${themeConfig.bgClass} font-sans text-slate-200 selection:bg-indigo-500 selection:text-white flex flex-col justify-between transition-colors duration-500`}
    >
      <div className="flex-1 flex flex-col">
        {!selectedPuzzle ? (
          <LevelMap
            puzzles={PUZZLES}
            progress={progress}
            onSelectPuzzle={puzzle => setSelectedPuzzle(puzzle)}
            onResetProgress={handleResetProgress}
            streak={streak}
            theme={theme}
            onSetTheme={handleSetTheme}
          />
        ) : (
          <PuzzlePlayScreen
            puzzle={selectedPuzzle}
            progress={progress[selectedPuzzle.id]}
            onBack={() => setSelectedPuzzle(null)}
            onSaveProgress={handleSaveProgress}
            onNextPuzzle={handleNextPuzzle}
            theme={theme}
            onSetTheme={handleSetTheme}
          />
        )}
      </div>

      {/* Sleek Interface Footer */}
      <footer className="h-9 bg-slate-950/80 backdrop-blur-md border-t border-slate-900/80 flex items-center px-6 justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest shrink-0 z-20">
        <span className="hidden sm:inline">Difficulty Tier: Senior Engineering & Staff FAANG</span>
        <span>Connected to: FAANG Cloud Simulation</span>
        <span>Active Theme: {themeConfig.name}</span>
      </footer>
    </div>
  );
}
