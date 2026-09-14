import React from 'react';
import { Grid, Layers, Flame, User, Sparkles } from 'lucide-react';
import { ThemeId, THEMES } from '../utils/theme';
import { sound } from '../utils/audio';

export type MobileTab = 'puzzles' | 'tiers' | 'stats' | 'profile';

interface Props {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  solvedCount: number;
  totalPuzzles: number;
  streak: number;
  theme: ThemeId;
}

export const MobileNavBar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  solvedCount,
  totalPuzzles,
  streak,
  theme,
}) => {
  const themeConfig = THEMES[theme] || THEMES['cyber-indigo'];

  const tabs: { id: MobileTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'puzzles',
      label: 'Puzzles',
      icon: <Grid className="w-5 h-5" />,
      badge: `${solvedCount}/${totalPuzzles}`,
    },
    {
      id: 'tiers',
      label: 'Tiers',
      icon: <Layers className="w-5 h-5" />,
    },
    {
      id: 'stats',
      label: 'Mastery',
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      badge: streak > 0 ? `🔥${streak}` : undefined,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2 pb-safe shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Glow Pill */}
              {isActive && (
                <div
                  className={`absolute -top-1.5 w-8 h-1 rounded-full bg-gradient-to-r ${themeConfig.gradient}`}
                />
              )}

              <div className="relative">
                <div
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-110 ' + themeConfig.primaryColor : ''
                  }`}
                >
                  {tab.icon}
                </div>

                {tab.badge && !isActive && (
                  <span className="absolute -top-1.5 -right-3 text-[9px] font-mono px-1 py-0.2 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-bold mt-1 tracking-tight ${
                  isActive ? themeConfig.primaryColor + ' font-extrabold' : ''
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
