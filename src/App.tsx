/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LevelMap } from './components/LevelMap';
import { PuzzlePlayScreen } from './components/PuzzlePlayScreen';
import { LoginPage } from './components/LoginPage';
import { PUZZLES } from './data/puzzles';
import { PuzzleMeta, PuzzleProgress, UserProfile } from './types';
import { ThemeId, THEMES } from './utils/theme';
import { sound } from './utils/audio';
import { authStorage } from './utils/authStorage';

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

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return authStorage.getCurrentUser();
  });

  const [progress, setProgress] = useState<Record<string, PuzzleProgress>>(() => {
    const user = authStorage.getCurrentUser();
    return user ? authStorage.getUserProgress(user.id) : {};
  });

  const [streak, setStreak] = useState<number>(() => {
    const user = authStorage.getCurrentUser();
    return user ? authStorage.getUserStreak(user.id) : 1;
  });

  // Whenever currentUser changes, dynamically load that user's isolated progress & streak
  useEffect(() => {
    if (currentUser) {
      const userProg = authStorage.getUserProgress(currentUser.id);
      setProgress(userProg);
      const userStreak = authStorage.checkAndUpdateStreak(currentUser.id);
      setStreak(userStreak);
    } else {
      setProgress({});
      setStreak(1);
    }
  }, [currentUser?.id]);

  const handleSetTheme = (newTheme: ThemeId) => {
    sound.playThemeChange();
    setTheme(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, newTheme);
    } catch {
      // ignore
    }
  };

  const handleLogin = (user: UserProfile) => {
    authStorage.setCurrentUser(user);
    setCurrentUser(user);
    const userProg = authStorage.getUserProgress(user.id);
    setProgress(userProg);
    const userStreak = authStorage.checkAndUpdateStreak(user.id);
    setStreak(userStreak);
  };

  const handleLogout = () => {
    sound.playLogout();
    authStorage.logout();
    setCurrentUser(null);
    setSelectedPuzzle(null);
    setProgress({});
    setStreak(1);
  };

  // Save progress isolated to the current user
  const handleSaveProgress = (
    puzzleId: string,
    stars: number,
    hintsUsed: number,
    moves: number
  ) => {
    if (!currentUser) return;
    const updated = authStorage.saveUserProgress(
      currentUser.id,
      puzzleId,
      stars,
      hintsUsed,
      moves
    );
    setProgress(updated);
  };

  const handleResetProgress = () => {
    if (!currentUser) return;
    if (window.confirm('Are you sure you want to reset all your progress and stars for this candidate profile?')) {
      sound.playReset();
      authStorage.resetUserProgress(currentUser.id);
      setProgress({});
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

  // If user is not authenticated, display the futuristic Login Page
  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        theme={theme}
        onSetTheme={handleSetTheme}
      />
    );
  }

  return (
    <div
      className={`min-h-screen w-full max-w-full overflow-x-hidden ${themeConfig.bgClass} font-sans text-slate-200 selection:bg-indigo-500 selection:text-white flex flex-col justify-between transition-colors duration-500`}
    >
      <div className="flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
        {!selectedPuzzle ? (
          <LevelMap
            puzzles={PUZZLES}
            progress={progress}
            onSelectPuzzle={puzzle => setSelectedPuzzle(puzzle)}
            onResetProgress={handleResetProgress}
            streak={streak}
            theme={theme}
            onSetTheme={handleSetTheme}
            currentUser={currentUser}
            onLogout={handleLogout}
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

      {/* Sleek Interface Footer - Hidden on mobile screens */}
      <footer className="hidden md:flex h-9 bg-slate-950/80 backdrop-blur-md border-t border-slate-900/80 items-center px-6 justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest shrink-0 z-20">
        <span className="hidden lg:inline">Difficulty Tier: Senior Engineering & Staff FAANG</span>
        <span>Connected: FAANG Cloud</span>
        <span>Candidate: {currentUser.name} ({currentUser.targetCompany})</span>
        <span>Theme: {themeConfig.name}</span>
      </footer>
    </div>
  );
}
