export type Category = 'logical' | 'math' | 'arrangement' | 'spatial' | 'Logical' | 'Math' | 'Arrangement' | 'Spatial';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface PuzzleMeta {
  id: string;
  number: number;
  name: string;
  title?: string;
  category: Category;
  companies: string[];
  difficulty: Difficulty;
  icon: string;
  problemStatement: string;
  statement?: string;
  hints: string[];
  explanation: string;
  solution?: string;
  interviewTip: string;
  codeInsight?: string;
  tags?: string[];
}

export interface PuzzleProgress {
  puzzleId: string;
  solved: boolean;
  stars: number; // 0-3
  starsEarned: number;
  movesUsed?: number;
  bestMoves?: number;
  hintsUsed: number;
  bestScore?: string;
}

export interface UserProgressState {
  puzzles: Record<string, PuzzleProgress>;
  streak: number;
  allUnlocked: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetCompany: string;
  targetRole: string;
  avatar?: string;
  joinedDate: string;
  isGuest?: boolean;
  company?: string;
  role?: string;
}

export interface UserAccount extends UserProfile {
  password?: string;
}

export type SortOption =
  | 'difficulty-asc'
  | 'difficulty-desc'
  | 'number-asc'
  | 'stars-desc'
  | 'name-asc';

export type ThemeName = 'dark' | 'light';
export type CategoryName = 'Logical' | 'Math' | 'Arrangement' | 'Spatial';
export type CompanyTag = 'Google' | 'Meta' | 'Amazon' | 'Apple' | 'Microsoft' | 'Goldman' | 'All';
export type PuzzleType = 'choice' | 'grid' | 'order' | 'matrix';

export interface PuzzleChoiceData {
  type: 'choice';
  question: string;
  context?: string;
  options: string[];
  correct: number;
}

export interface Puzzle {
  id: number;
  title: string;
  category: CategoryName;
  difficulty: Difficulty;
  tier: 1 | 2 | 3;
  companies: CompanyTag[];
  data: PuzzleChoiceData;
  hints: [string, string, string];
  solution: string;
  algorithm: string;
  complexity: string;
  takeaway: string;
  minMoves: number;
}

export interface PuzzleResult {
  puzzleId: number;
  stars: number;
  timeSecs: number;
  moves: number;
  hintsUsed: number;
}

export type Screen = 'onboarding' | 'dashboard' | 'tier-map' | 'puzzle' | 'success' | 'mastery' | 'profile';
export type NavTab = 'puzzles' | 'tiers' | 'mastery' | 'profile';


