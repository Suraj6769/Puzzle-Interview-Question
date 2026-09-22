import { UserAccount, UserProfile, PuzzleProgress } from '../types';

const STORAGE_KEY_USERS_DB = 'puzzlemaster_users_db_v2';
const STORAGE_KEY_AUTH_USER = 'puzzlemaster_auth_user_v2';
const PROGRESS_KEY_PREFIX = 'puzzlemaster_progress_user_';
const STREAK_KEY_PREFIX = 'puzzlemaster_streak_user_';
const FAVORITES_KEY_PREFIX = 'puzzlemaster_favorites_user_';
const LAST_LOGIN_KEY_PREFIX = 'puzzlemaster_last_login_user_';

// Default initial preset accounts
const DEFAULT_PRESETS: Record<string, UserAccount> = {
  'alex.chen@google.dev': {
    id: 'user_alex_chen',
    name: 'Alex Chen',
    email: 'alex.chen@google.dev',
    password: 'password123',
    targetCompany: 'Google',
    targetRole: 'Software Engineer II (L4/E4)',
    joinedDate: 'Jan 2026',
    isGuest: false,
  },
  'priya.s@meta.career': {
    id: 'user_priya_sharma',
    name: 'Priya Sharma',
    email: 'priya.s@meta.career',
    password: 'password123',
    targetCompany: 'Meta',
    targetRole: 'Senior Software Engineer (L5/E5)',
    joinedDate: 'Feb 2026',
    isGuest: false,
  },
  'marcus.v@amazon.jobs': {
    id: 'user_marcus_vance',
    name: 'Marcus Vance',
    email: 'marcus.v@amazon.jobs',
    password: 'password123',
    targetCompany: 'Amazon',
    targetRole: 'Staff / Principal Engineer (L6+)',
    joinedDate: 'Mar 2026',
    isGuest: false,
  },
  'candidate@faang.prep': {
    id: 'user_demo_candidate',
    name: 'Demo Candidate',
    email: 'candidate@faang.prep',
    password: 'interview123',
    targetCompany: 'Google',
    targetRole: 'Software Engineer II (L4/E4)',
    joinedDate: 'Sep 2026',
    isGuest: false,
  },
};

// Pre-seeded progress for preset accounts so users can test switching accounts and see real progress differences
const PRESET_PROGRESS_SEEDS: Record<string, Record<string, PuzzleProgress>> = {
  user_alex_chen: {
    'heaven-hell': { puzzleId: 'heaven-hell', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 1 },
    'mislabeled-jars': { puzzleId: 'mislabeled-jars', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 2 },
    'snail-wall': { puzzleId: 'snail-wall', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 1 },
    'ants-triangle': { puzzleId: 'ants-triangle', solved: true, stars: 2, starsEarned: 2, hintsUsed: 1, bestMoves: 3 },
    'hundred-doors': { puzzleId: 'hundred-doors', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 1 },
    'water-jug': { puzzleId: 'water-jug', solved: true, stars: 2, starsEarned: 2, hintsUsed: 1, bestMoves: 6 },
    'bulbs-switches': { puzzleId: 'bulbs-switches', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 3 },
  },
  user_priya_sharma: {
    'heaven-hell': { puzzleId: 'heaven-hell', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 1 },
    'mislabeled-jars': { puzzleId: 'mislabeled-jars', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 2 },
    'snail-wall': { puzzleId: 'snail-wall', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 1 },
    'ants-triangle': { puzzleId: 'ants-triangle', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 2 },
    'hundred-doors': { puzzleId: 'hundred-doors', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 1 },
    'water-jug': { puzzleId: 'water-jug', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 6 },
    'bulbs-switches': { puzzleId: 'bulbs-switches', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 3 },
    'monty-hall': { puzzleId: 'monty-hall', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 2 },
    'torch-bridge': { puzzleId: 'torch-bridge', solved: true, stars: 2, starsEarned: 2, hintsUsed: 1, bestMoves: 5 },
    'marbles-jars': { puzzleId: 'marbles-jars', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 2 },
    'dice-calendar': { puzzleId: 'dice-calendar', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 3 },
    'matchstick-squares': { puzzleId: 'matchstick-squares', solved: true, stars: 2, starsEarned: 2, hintsUsed: 1, bestMoves: 4 },
  },
  user_marcus_vance: {
    'heaven-hell': { puzzleId: 'heaven-hell', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 1 },
    'mislabeled-jars': { puzzleId: 'mislabeled-jars', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 2 },
    'snail-wall': { puzzleId: 'snail-wall', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 1 },
    'ants-triangle': { puzzleId: 'ants-triangle', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 2 },
    'hundred-doors': { puzzleId: 'hundred-doors', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 1 },
    'water-jug': { puzzleId: 'water-jug', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 6 },
    'bulbs-switches': { puzzleId: 'bulbs-switches', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 3 },
    'monty-hall': { puzzleId: 'monty-hall', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 2 },
    'torch-bridge': { puzzleId: 'torch-bridge', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 5 },
    'marbles-jars': { puzzleId: 'marbles-jars', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 2 },
    'dice-calendar': { puzzleId: 'dice-calendar', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 3 },
    'matchstick-squares': { puzzleId: 'matchstick-squares', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 3 },
    'round-table-coins': { puzzleId: 'round-table-coins', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 1 },
    'chessboard-dominos': { puzzleId: 'chessboard-dominos', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 1 },
    'cake-cuts': { puzzleId: 'cake-cuts', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 3 },
    'nine-dots': { puzzleId: 'nine-dots', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 4 },
    'river-crossing': { puzzleId: 'river-crossing', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 7 },
    'burning-ropes': { puzzleId: 'burning-ropes', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 2 },
    'tower-of-hanoi': { puzzleId: 'tower-of-hanoi', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 7 },
    'prisoners-hats': { puzzleId: 'prisoners-hats', solved: true, stars: 3, starsEarned: 3, hintsUsed: 0, bestMoves: 1 },
  },
};

class AuthStorageService {
  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      const existing = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (!existing) {
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(DEFAULT_PRESETS));
      } else {
        // Ensure defaults exist in DB
        const parsed = JSON.parse(existing);
        let updated = false;
        for (const [key, preset] of Object.entries(DEFAULT_PRESETS)) {
          if (!parsed[key]) {
            parsed[key] = preset;
            updated = true;
          }
        }
        if (updated) {
          localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(parsed));
        }
      }

      // Seed preset progress if not yet initialized
      for (const [userId, progressSeed] of Object.entries(PRESET_PROGRESS_SEEDS)) {
        const key = PROGRESS_KEY_PREFIX + userId;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify(progressSeed));
        }
      }
    } catch {
      // localStorage error fallback
    }
  }

  public getUsers(): Record<string, UserAccount> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USERS_DB);
      return data ? JSON.parse(data) : { ...DEFAULT_PRESETS };
    } catch {
      return { ...DEFAULT_PRESETS };
    }
  }

  public registerUser(
    name: string,
    email: string,
    password: string,
    targetCompany: string,
    targetRole: string
  ): { success: boolean; user?: UserProfile; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const users = this.getUsers();
    if (users[cleanEmail]) {
      return {
        success: false,
        error: 'An account with this email already exists. Please Sign In instead.',
      };
    }

    const newUser: UserAccount = {
      id: 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: cleanName || cleanEmail.split('@')[0],
      email: cleanEmail,
      password,
      targetCompany: targetCompany || 'Google',
      targetRole: targetRole || 'Software Engineer II (L4/E4)',
      joinedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      isGuest: false,
    };

    users[cleanEmail] = newUser;
    try {
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
      // Initialize fresh empty progress for new user
      localStorage.setItem(PROGRESS_KEY_PREFIX + newUser.id, JSON.stringify({}));
      localStorage.setItem(STREAK_KEY_PREFIX + newUser.id, '1');
      localStorage.setItem(FAVORITES_KEY_PREFIX + newUser.id, JSON.stringify([]));
    } catch (err) {
      console.error('Failed to save new user to database', err);
    }

    const profile = this.toProfile(newUser);
    this.setCurrentUser(profile);
    return { success: true, user: profile };
  }

  public loginUser(
    email: string,
    password: string
  ): { success: boolean; user?: UserProfile; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();

    const existing = users[cleanEmail];
    if (!existing) {
      return {
        success: false,
        error: 'No candidate account found with this email. Please click "Create Account".',
      };
    }

    if (existing.password && existing.password !== password) {
      return {
        success: false,
        error: 'Invalid password. Please check your credentials.',
      };
    }

    const profile = this.toProfile(existing);
    this.setCurrentUser(profile);
    return { success: true, user: profile };
  }

  public loginGuest(): UserProfile {
    const guestId = 'guest_user';
    const guestUser: UserProfile = {
      id: guestId,
      name: 'Guest Candidate',
      email: 'guest@simulation.local',
      targetCompany: 'FAANG / Tier-1',
      targetRole: 'Full-Stack Track',
      joinedDate: 'Today',
      isGuest: true,
    };

    try {
      // Ensure guest progress storage exists
      if (!localStorage.getItem(PROGRESS_KEY_PREFIX + guestId)) {
        localStorage.setItem(PROGRESS_KEY_PREFIX + guestId, JSON.stringify({}));
      }
    } catch {
      // ignore
    }

    this.setCurrentUser(guestUser);
    return guestUser;
  }

  public loginPreset(email: string): UserProfile | null {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const preset = users[cleanEmail];
    if (!preset) return null;

    const profile = this.toProfile(preset);
    this.setCurrentUser(profile);
    return profile;
  }

  public getCurrentUser(): UserProfile | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  public setCurrentUser(user: UserProfile | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH_USER);
      }
    } catch {
      // ignore
    }
  }

  public logout(): void {
    this.setCurrentUser(null);
  }

  // --- Per-User Progress Operations ---

  public getUserProgress(userId: string): Record<string, PuzzleProgress> {
    try {
      const data = localStorage.getItem(PROGRESS_KEY_PREFIX + userId);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  public saveUserProgress(
    userId: string,
    puzzleId: string,
    stars: number,
    hintsUsed: number,
    moves: number
  ): Record<string, PuzzleProgress> {
    const current = this.getUserProgress(userId);
    const existing = current[puzzleId];
    const highestStars = Math.max(existing?.starsEarned || 0, stars);
    const bestMoves = existing?.bestMoves ? Math.min(existing.bestMoves, moves) : moves;

    const updated: Record<string, PuzzleProgress> = {
      ...current,
      [puzzleId]: {
        puzzleId,
        solved: true,
        stars: highestStars,
        starsEarned: highestStars,
        hintsUsed: Math.max(existing?.hintsUsed || 0, hintsUsed),
        bestMoves,
      },
    };

    try {
      localStorage.setItem(PROGRESS_KEY_PREFIX + userId, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save user progress', err);
    }

    return updated;
  }

  public resetUserProgress(userId: string): void {
    try {
      localStorage.setItem(PROGRESS_KEY_PREFIX + userId, JSON.stringify({}));
    } catch {
      // ignore
    }
  }

  // --- Per-User Streak Operations ---

  public getUserStreak(userId: string): number {
    try {
      const data = localStorage.getItem(STREAK_KEY_PREFIX + userId);
      return data ? parseInt(data, 10) : 1;
    } catch {
      return 1;
    }
  }

  public setUserStreak(userId: string, streak: number): void {
    try {
      localStorage.setItem(STREAK_KEY_PREFIX + userId, streak.toString());
    } catch {
      // ignore
    }
  }

  public checkAndUpdateStreak(userId: string): number {
    try {
      const lastLoginKey = LAST_LOGIN_KEY_PREFIX + userId;
      const lastLogin = localStorage.getItem(lastLoginKey);
      const today = new Date().toDateString();
      let curStreak = this.getUserStreak(userId);

      if (lastLogin !== today) {
        if (lastLogin) {
          const lastDate = new Date(lastLogin);
          const diffDays = Math.round(
            (new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === 1) {
            curStreak += 1;
            this.setUserStreak(userId, curStreak);
          } else if (diffDays > 1) {
            curStreak = 1;
            this.setUserStreak(userId, 1);
          }
        }
        localStorage.setItem(lastLoginKey, today);
      }
      return curStreak;
    } catch {
      return 1;
    }
  }

  // --- Per-User Favorites Operations ---

  public getUserFavorites(userId: string): string[] {
    try {
      const data = localStorage.getItem(FAVORITES_KEY_PREFIX + userId);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveUserFavorites(userId: string, favorites: string[]): void {
    try {
      localStorage.setItem(FAVORITES_KEY_PREFIX + userId, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }

  private toProfile(account: UserAccount): UserProfile {
    return {
      id: account.id,
      name: account.name,
      email: account.email,
      targetCompany: account.targetCompany,
      targetRole: account.targetRole,
      avatar: account.avatar,
      joinedDate: account.joinedDate,
      isGuest: account.isGuest,
    };
  }
}

export const authStorage = new AuthStorageService();
