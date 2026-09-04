export type ThemeId = 'cyber-indigo' | 'emerald-matrix' | 'violet-nebula' | 'crimson-ember' | 'golden-amber';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  dotColor: string;
  gradient: string;
  bgClass: string;
  glowColor: string;
  primaryColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  activeTabClass: string;
  cardGlowHover: string;
  buttonClass: string;
  progressClass: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'cyber-indigo': {
    id: 'cyber-indigo',
    name: 'Cyber Indigo',
    dotColor: '#6366f1',
    gradient: 'from-indigo-500 to-cyan-500',
    bgClass: 'bg-slate-950',
    glowColor: 'rgba(79, 70, 229, 0.16)',
    primaryColor: 'text-indigo-400',
    badgeBg: 'bg-indigo-600/20',
    badgeBorder: 'border-indigo-500/40',
    badgeText: 'text-indigo-300',
    activeTabClass: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border-indigo-500',
    cardGlowHover: 'group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/10',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20',
    progressClass: 'bg-indigo-500',
  },
  'emerald-matrix': {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    dotColor: '#10b981',
    gradient: 'from-emerald-500 to-teal-400',
    bgClass: 'bg-[#05110d]',
    glowColor: 'rgba(16, 185, 129, 0.16)',
    primaryColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-600/20',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-300',
    activeTabClass: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 border-emerald-500',
    cardGlowHover: 'group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/10',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20',
    progressClass: 'bg-emerald-500',
  },
  'violet-nebula': {
    id: 'violet-nebula',
    name: 'Violet Nebula',
    dotColor: '#a855f7',
    gradient: 'from-purple-500 to-fuchsia-500',
    bgClass: 'bg-[#0b0716]',
    glowColor: 'rgba(168, 85, 247, 0.16)',
    primaryColor: 'text-purple-400',
    badgeBg: 'bg-purple-600/20',
    badgeBorder: 'border-purple-500/40',
    badgeText: 'text-purple-300',
    activeTabClass: 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 border-purple-500',
    cardGlowHover: 'group-hover:border-purple-500/50 group-hover:shadow-purple-500/10',
    buttonClass: 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20',
    progressClass: 'bg-purple-500',
  },
  'crimson-ember': {
    id: 'crimson-ember',
    name: 'Crimson Ember',
    dotColor: '#f43f5e',
    gradient: 'from-rose-500 to-orange-500',
    bgClass: 'bg-[#120609]',
    glowColor: 'rgba(244, 63, 94, 0.16)',
    primaryColor: 'text-rose-400',
    badgeBg: 'bg-rose-600/20',
    badgeBorder: 'border-rose-500/40',
    badgeText: 'text-rose-300',
    activeTabClass: 'bg-rose-600 text-white shadow-lg shadow-rose-500/25 border-rose-500',
    cardGlowHover: 'group-hover:border-rose-500/50 group-hover:shadow-rose-500/10',
    buttonClass: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/20',
    progressClass: 'bg-rose-500',
  },
  'golden-amber': {
    id: 'golden-amber',
    name: 'Golden Amber',
    dotColor: '#f59e0b',
    gradient: 'from-amber-500 to-yellow-400',
    bgClass: 'bg-[#100d05]',
    glowColor: 'rgba(245, 158, 11, 0.16)',
    primaryColor: 'text-amber-400',
    badgeBg: 'bg-amber-600/20',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-300',
    activeTabClass: 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25 border-amber-400',
    cardGlowHover: 'group-hover:border-amber-500/50 group-hover:shadow-amber-500/10',
    buttonClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20',
    progressClass: 'bg-amber-500',
  },
};
