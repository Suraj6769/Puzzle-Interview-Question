export type Category = 'logical' | 'math' | 'arrangement' | 'spatial';

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


