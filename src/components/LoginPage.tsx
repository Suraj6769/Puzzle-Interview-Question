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
}[] = [
  {
    name: 'Alex Chen',
    email: 'alex.chen@google.dev',
    targetCompany: 'Google',
    targetRole: 'Software Engineer II (L4/E4)',
    badgeColor: 'from-blue-500 to-emerald-400',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.s@meta.career',
    targetCompany: 'Meta',
    targetRole: 'Senior Software Engineer (L5/E5)',
    badgeColor: 'from-indigo-500 to-purple-500',
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.v@amazon.jobs',
    targetCompany: 'Amazon',
    targetRole: 'Staff / Principal Engineer (L6+)',
    badgeColor: 'from-amber-500 to-orange-500',
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
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[550px] pointer-events-none blur-3xl opacity-40 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at top, ${themeConfig.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Decorative Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Bar Navigation */}
      <header className="pt-safe relative z-20 flex items-center justify-between px-4 sm:px-6 pb-3 sm:pb-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <img
            src="/icon.png"
            alt="Interview Puzzles Logo"
            className="w-10 h-10 rounded-xl shadow-lg border border-amber-400/30 object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase flex items-center gap-1.5">
                PuzzleMaster <span className={themeConfig.primaryColor}>Interview</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 hidden sm:inline-block">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              FAANG Technical Interview & Logic Assessment
            </p>
          </div>
        </div>

        {/* Theme Picker & Guest Button */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setShowThemePicker(!showThemePicker);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-bold text-slate-200 transition shadow-sm"
              title="Change Color Theme"
            >
              <Palette className="w-3.5 h-3.5 text-slate-300" />
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: themeConfig.dotColor }}
              />
              <span className="hidden md:inline">{themeConfig.name}</span>
            </button>

            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 border border-slate-700 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
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
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isCur
                          ? 'bg-white/10 text-white font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
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
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Guest Access</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Centerpiece */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-md w-full">
          {/* Card Container */}
          <div className="rounded-3xl bg-slate-900/75 border border-slate-800/90 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
            {/* Top Accent Line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${themeConfig.gradient}`}
            />

            {/* Header / Mode Switcher */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-3.5 group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/30 via-indigo-500/20 to-sky-500/30 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
                <img
                  src="/icon.png"
                  alt="Interview Puzzles Logo"
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-2xl border border-amber-400/40 object-cover"
                />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-extrabold uppercase tracking-widest text-slate-300 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Candidate Verification Portal
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {mode === 'signin' ? 'Sign In to Simulation' : 'Register Candidate Profile'}
              </h2>
              <p className="text-xs text-slate-400 mt-1.5">
                {mode === 'signin'
                  ? 'Access 25 interactive interview puzzles and track your mastery'
                  : 'Customize your target company and cognitive benchmark'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex bg-slate-950/70 p-1 rounded-2xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode('signin');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'signin'
                    ? `${themeConfig.buttonClass} shadow-md`
                    : 'text-slate-400 hover:text-white'
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
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'signup'
                    ? `${themeConfig.buttonClass} shadow-md`
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Candidate Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Alex Chen"
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="candidate@faang.prep"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Security Password
                  </label>
                  {mode === 'signin' && (
                    <span className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer">
                      Demo password: any 4+ chars
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Target Company
                    </label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={targetCompany}
                        onChange={e => setTargetCompany(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400 transition"
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
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Target Role
                    </label>
                    <div className="relative">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={targetRole}
                        onChange={e => setTargetRole(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400 transition"
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
                <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-indigo-500 focus:ring-0"
                  />
                  <span>Stay logged in on this browser</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${themeConfig.buttonClass} shadow-lg mt-2`}
              >
                <span>{mode === 'signin' ? 'Enter Simulation' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative px-3 bg-slate-900 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                Or Quick Start With Preset
              </span>
            </div>

            {/* 1-Click Candidate Presets */}
            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Instant Candidate Presets</span>
                <span className="text-slate-500">1-click test login</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {QUICK_PROFILES.map(p => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleQuickProfileLogin(p)}
                    className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white group-hover:text-indigo-300 transition truncate">
                        {p.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                      {p.targetCompany}
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
                className="text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5 mx-auto font-medium"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Skip credentials and proceed as Guest</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Underneath */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-base font-black text-white font-mono">25</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Simulations
              </div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-base font-black text-amber-400 font-mono">75 ★</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Total Stars
              </div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-base font-black text-emerald-400 font-mono">100%</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                FAANG Focus
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 h-9 bg-slate-950/80 backdrop-blur-md border-t border-slate-900/80 flex items-center px-6 justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest shrink-0">
        <span className="hidden sm:inline">Difficulty Tier: Senior Engineering & Staff FAANG</span>
        <span>Connected to: FAANG Cloud Simulation</span>
        <span>Active Theme: {themeConfig.name}</span>
      </footer>
    </div>
  );
};
