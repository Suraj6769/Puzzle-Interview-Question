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
      icon: <Grid className="w-[18px] h-[18px]" />,
      badge: `${solvedCount}/${totalPuzzles}`,
    },
    {
      id: 'tiers',
      label: 'Tiers',
      icon: <Layers className="w-[18px] h-[18px]" />,
    },
    {
      id: 'stats',
      label: 'Mastery',
      icon: <Flame className="w-[18px] h-[18px]" />,
      badge: streak > 0 ? `🔥${streak}` : undefined,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-[18px] h-[18px]" />,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-t border-white/[0.04] px-2 py-1.5 pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
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
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all duration-300 relative ${
                isActive
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {/* Active Background Pill */}
              {isActive && (
                <div
                  className="absolute inset-x-2 inset-y-0 rounded-2xl transition-all duration-300"
                  style={{
                    background: `rgba(${themeConfig.accentRgb}, 0.1)`,
                    border: `1px solid rgba(${themeConfig.accentRgb}, 0.15)`,
                  }}
                />
              )}

              <div className="relative z-10">
                <div
                  className={`transition-all duration-300 ${
                    isActive ? 'scale-110 ' + themeConfig.primaryColor : ''
                  }`}
                >
                  {tab.icon}
                </div>

                {tab.badge && !isActive && (
                  <span className="absolute -top-1.5 -right-3.5 text-[8px] font-mono px-1 py-0.5 rounded-full bg-white/[0.06] text-slate-400 font-bold border border-white/[0.06]">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`relative z-10 text-[10px] font-bold mt-0.5 tracking-tight transition-all duration-300 ${
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
