import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Lock,
  Mail,
  User,
  Building2,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  Palette,
  CheckCircle2,
  Cpu,
  Trophy,
  Flame,
  Star,
  Target,
  Gamepad2,
} from 'lucide-react';
import { UserProfile } from '../types';
import { ThemeId, THEMES } from '../utils/theme';
import { sound } from '../utils/audio';
import { authStorage } from '../utils/authStorage';

interface Props {
  onLogin: (user: UserProfile) => void;
  theme: ThemeId;
  onSetTheme: (theme: ThemeId) => void;
}

const FAANG_COMPANIES = [
  'Google',
  'Meta',
  'Amazon',
  'Apple',
  'Microsoft',
  'Netflix',
  'Goldman Sachs',
  'Bloomberg',
];

const TARGET_ROLES = [
  'Software Engineer I (L3/E3)',
  'Software Engineer II (L4/E4)',
  'Senior Software Engineer (L5/E5)',
  'Staff / Principal Engineer (L6+)',
  'Quant / Algorithmic Trader',
];

const QUICK_PROFILES: {
  name: string;
  email: string;
  targetCompany: string;
  targetRole: string;
  badgeColor: string;
  icon: string;
}[] = [
  {
    name: 'Alex Chen',
    email: 'alex.chen@google.dev',
    targetCompany: 'Google',
    targetRole: 'Software Engineer II (L4/E4)',
    badgeColor: 'from-blue-500 to-emerald-400',
    icon: '🎯',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.s@meta.career',
    targetCompany: 'Meta',
    targetRole: 'Senior Software Engineer (L5/E5)',
    badgeColor: 'from-indigo-500 to-purple-500',
    icon: '🚀',
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.v@amazon.jobs',
    targetCompany: 'Amazon',
    targetRole: 'Staff / Principal Engineer (L6+)',
    badgeColor: 'from-amber-500 to-orange-500',
    icon: '⚡',
  },
];

export const LoginPage: React.FC<Props> = ({ onLogin, theme, onSetTheme }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showThemePicker, setShowThemePicker] = useState<boolean>(false);

  // Form State
  const [email, setEmail] = useState<string>('candidate@faang.prep');
  const [password, setPassword] = useState<string>('interview123');
  const [name, setName] = useState<string>('');
  const [targetCompany, setTargetCompany] = useState<string>('Google');
  const [targetRole, setTargetRole] = useState<string>('Software Engineer II (L4/E4)');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const themeConfig = THEMES[theme] || THEMES['cyber-indigo'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      sound.playError();
      setErrorMessage('Please enter a valid candidate email address.');
      return;
    }

    if (!password || password.length < 4) {
      sound.playError();
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      sound.playError();
      setErrorMessage('Please enter your full name or candidate handle.');
      return;
    }

    if (mode === 'signup') {
      const result = authStorage.registerUser(
        name.trim(),
        email.trim(),
        password,
        targetCompany,
        targetRole
      );
      if (!result.success || !result.user) {
        sound.playError();
        setErrorMessage(result.error || 'Failed to create candidate account.');
        return;
      }
      sound.playLogin();
      onLogin(result.user);
    } else {
      const result = authStorage.loginUser(email.trim(), password);
      if (!result.success || !result.user) {
        sound.playError();
        setErrorMessage(result.error || 'Invalid credentials. Please verify your email and password.');
        return;
      }
      sound.playLogin();
      onLogin(result.user);
    }
  };

  const handleGuestLogin = () => {
    sound.playLogin();
    const guestUser = authStorage.loginGuest();
    onLogin(guestUser);
  };

  const handleQuickProfileLogin = (p: typeof QUICK_PROFILES[0]) => {
    sound.playLogin();
    const user = authStorage.loginPreset(p.email);
    if (user) {
      onLogin(user);
    } else {
      // Fallback if preset wasn't found
      const res = authStorage.registerUser(p.name, p.email, 'password123', p.targetCompany, p.targetRole);
      if (res.user) onLogin(res.user);
    }
  };

  return (
    <div
      className={`min-h-screen ${themeConfig.bgClass} text-slate-200 flex flex-col justify-between relative overflow-hidden transition-colors duration-500`}
    >
      {/* ─── Animated Floating Orbs ─── */}
      <div
        className="absolute top-20 left-[15%] w-64 h-64 rounded-full blur-[100px] pointer-events-none orb-float"
        style={{ background: `rgba(${themeConfig.accentRgb}, 0.12)` }}
      />
      <div
        className="absolute top-40 right-[10%] w-80 h-80 rounded-full blur-[120px] pointer-events-none orb-float-delayed"
        style={{ background: `rgba(${themeConfig.accentRgb}, 0.08)` }}
      />
      <div
        className="absolute bottom-20 left-[30%] w-48 h-48 rounded-full blur-[80px] pointer-events-none orb-float-slow"
        style={{ background: 'rgba(14, 165, 233, 0.08)' }}
      />

      {/* Decorative Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* ─── Top Bar Navigation ─── */}
      <header className="pt-safe relative z-20 flex items-center justify-between px-4 sm:px-6 pb-3 sm:pb-4 bg-slate-900/40 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div
              className="absolute -inset-1 rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500"
              style={{ background: `rgba(${themeConfig.accentRgb}, 0.4)` }}
            />
            <img
              src="/icon.png"
              alt="Interview Puzzles Logo"
              className="relative w-10 h-10 rounded-xl shadow-lg border border-white/10 object-cover shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase flex items-center gap-1.5">
                PuzzleMaster <span className={themeConfig.primaryColor}>Interview</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-400 border border-white/[0.06] hidden sm:inline-block">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              FAANG Technical Interview & Logic Assessment
            </p>
          </div>
        </div>

        {/* Theme Picker & Guest Button */}
        <div className="flex items-center space-x-2.5 text-xs">
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setShowThemePicker(!showThemePicker);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-bold text-slate-200 transition-all duration-300 shadow-sm"
              title="Change Color Theme"
            >
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span
                className="w-2.5 h-2.5 rounded-full inline-block ring-1 ring-white/10"
                style={{ backgroundColor: themeConfig.dotColor }}
              />
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
                        isCur
                          ? 'bg-white/[0.08] text-white font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm ring-1 ring-white/10"
                          style={{ backgroundColor: t.dotColor }}
                        />
                        <span>{t.name}</span>
                      </div>
                      {isCur && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={handleGuestLogin}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] font-bold text-xs transition-all duration-300"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Guest Access</span>
          </button>
        </div>
      </header>

      {/* ─── Main Authentication Centerpiece ─── */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-md w-full animate-slide-up">
          {/* Card Container */}
          <div className="rounded-3xl glass-panel-premium p-6 sm:p-8 relative overflow-hidden">
            {/* Top Accent Shimmer Line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] animate-shimmer"
              style={{
                background: themeConfig.headerAccent,
                backgroundSize: '200% auto',
              }}
            />

            {/* Header / Mode Switcher */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-4 group">
                <div
                  className="absolute -inset-2 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-all duration-700"
                  style={{ background: `rgba(${themeConfig.accentRgb}, 0.25)` }}
                />
                <img
                  src="/icon.png"
                  alt="Interview Puzzles Logo"
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-2xl border border-white/10 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Candidate Verification Portal
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {mode === 'signin' ? 'Sign In to Simulation' : 'Register Candidate Profile'}
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 max-w-xs">
                {mode === 'signin'
                  ? 'Access 25 interactive interview puzzles and track your mastery'
                  : 'Customize your target company and cognitive benchmark'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex bg-white/[0.03] p-1 rounded-2xl border border-white/[0.04] mb-6 relative">
              {/* Sliding Indicator */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl transition-all duration-300 ease-out ${themeConfig.buttonClass}`}
                style={{
                  left: mode === 'signin' ? '4px' : 'calc(50% + 0px)',
                }}
              />
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode('signin');
                  setErrorMessage('');
                }}
                className={`relative z-10 flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  mode === 'signin' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode('signup');
                  setErrorMessage('');
                }}
                className={`relative z-10 flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  mode === 'signup' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-2 animate-fade-scale">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 animate-glow" />
                {errorMessage}
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="animate-slide-up">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Candidate Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Alex Chen"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-white/20 transition-all duration-300"
                      style={{ '--tw-ring-color': themeConfig.focusRing } as React.CSSProperties}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="candidate@faang.prep"
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-white/20 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Security Password
                  </label>
                  {mode === 'signin' && (
                    <span className="text-[10px] text-slate-600">
                      Demo: any 4+ chars
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-white/20 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-slide-up">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Target Company
                    </label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={targetCompany}
                        onChange={e => setTargetCompany(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-8 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all duration-300"
                      >
                        {FAANG_COMPANIES.map(c => (
                          <option key={c} value={c} className="bg-slate-900 text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Target Role
                    </label>
                    <div className="relative">
                      <Briefcase className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={targetRole}
                        onChange={e => setTargetRole(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-8 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all duration-300"
                      >
                        {TARGET_ROLES.map(r => (
                          <option key={r} value={r} className="bg-slate-900 text-white">
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded bg-white/[0.03] border-white/[0.08] text-indigo-500 focus:ring-0"
                  />
                  <span>Stay logged in on this browser</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${themeConfig.buttonClass} shadow-lg mt-2 hover:scale-[1.02] active:scale-[0.98]`}
                style={{ boxShadow: themeConfig.glowShadow }}
              >
                <span>{mode === 'signin' ? 'Enter Simulation' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-7 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.04]" />
              </div>
              <span className="relative px-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-600" style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
                Quick Start
              </span>
            </div>

            {/* 1-Click Candidate Presets */}
            <div className="space-y-2">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  Instant Candidate Presets
                </span>
                <span className="text-slate-600">1-click access</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {QUICK_PROFILES.map((p, idx) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleQuickProfileLogin(p)}
                    className={`p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.12] text-left transition-all duration-300 group hover:scale-[1.02] animate-slide-up stagger-${idx + 1}`}
                    style={{ opacity: 0, animationFillMode: 'forwards' }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.badgeColor} flex items-center justify-center text-sm shadow-lg shrink-0`}>
                        {p.icon}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-white group-hover:text-white transition truncate block">
                          {p.name}
                        </span>
                        <div className="text-[10px] text-slate-500 font-semibold truncate">
                          {p.targetCompany} • {p.targetRole.split(' ')[0]}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Guest Action */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={handleGuestLogin}
                className="text-xs text-slate-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 mx-auto font-medium group"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-400 transition-colors" />
                <span>Skip credentials and proceed as Guest</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Underneath */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { value: '25', label: 'Simulations', icon: <Gamepad2 className="w-4 h-4 text-white/60" />, color: 'text-white' },
              { value: '75 ★', label: 'Total Stars', icon: <Star className="w-4 h-4 text-amber-400" />, color: 'text-amber-400' },
              { value: '100%', label: 'FAANG Focus', icon: <Target className="w-4 h-4 text-emerald-400" />, color: 'text-emerald-400' },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className={`p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 hover:bg-white/[0.04] animate-slide-up stagger-${idx + 4}`}
                style={{ opacity: 0, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  {stat.icon}
                  <div className={`text-base font-black font-mono ${stat.color}`}>{stat.value}</div>
                </div>
                <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 h-9 bg-slate-950/60 backdrop-blur-md border-t border-white/[0.03] flex items-center px-6 justify-between text-[10px] text-slate-600 font-bold uppercase tracking-widest shrink-0">
        <span className="hidden sm:inline">Difficulty Tier: Senior Engineering & Staff FAANG</span>
        <span>Connected to: FAANG Cloud Simulation</span>
        <span>Active Theme: {themeConfig.name}</span>
      </footer>
    </div>
  );
};
