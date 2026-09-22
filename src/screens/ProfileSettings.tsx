import { useState } from 'react'
import type { UserProfile } from '../types'
import { useTheme, themes } from '../context/ThemeContext'
import { puzzles } from '../data/puzzles'

interface Props {
  user: UserProfile
  solved: Set<number>
  stars: Record<number, number>
  xp: number
  streak: number
  onUpdateProfile: (p: UserProfile) => void
  onReset: () => void
}

const COMPANIES = ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Goldman Sachs']
const ROLES = ['L3 SWE', 'L4 SWE', 'L5 SWE', 'L6 SWE', 'Staff SWE', 'Senior SWE', 'Principal SWE', 'SDE-2', 'SDE-3', 'Vice President']

const themeSwatchColors: Record<string, [string, string]> = {
  dark: ['#35d8ff', '#7657ff'],
  light: ['#246bff', '#a044ff'],
}

export default function ProfileSettings({ user, solved, stars, xp, streak, onUpdateProfile, onReset }: Props) {
  const { theme, setTheme } = useTheme()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [company, setCompany] = useState(user.company)
  const [role, setRole] = useState(user.role)
  const [sound, setSound] = useState(true)
  const [notifs, setNotifs] = useState(true)
  const [confirmReset, setConfirmReset] = useState(false)

  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0)
  const level = Math.floor(xp / 200) + 1
  const readiness = Math.min(100, Math.round((solved.size / 25) * 100 + streak * 1.5))

  const saveProfile = () => {
    onUpdateProfile({ ...user, name, email, company, role })
    setEditing(false)
  }

  return (
    <div
      className="bg-mesh scrollable screen-safe-top"
      style={{ flex: 1, minHeight: 0, paddingLeft: 16, paddingRight: 16, paddingBottom: 28 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          className="font-display"
          style={{ fontSize: 10, letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}
        >
          ◉ Candidate Profile
        </div>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--txt)' }}>
          Profile & Settings
        </h2>
      </div>

      {/* Profile card */}
      <div
        className="glass-strong"
        style={{
          padding: 20,
          borderRadius: 20,
          marginBottom: 18,
          border: '1px solid var(--glass-bs)',
        }}
      >
        {!editing ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                {/* Avatar */}
                <div
                  className="glow-accent-sm"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: 'var(--accent-dim)',
                    border: '1px solid var(--glass-bs)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 800,
                    color: 'var(--accent)',
                    fontFamily: 'Orbitron',
                  }}
                >
                  {user.isGuest ? '?' : user.name[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--txt)' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--txt-m)', marginTop: 1 }}>{user.email || '—'}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <span
                      className="glass"
                      style={{ fontSize: 10, padding: '3px 8px', borderRadius: 10, color: 'var(--accent)' }}
                    >
                      {user.company}
                    </span>
                    <span
                      className="glass"
                      style={{ fontSize: 10, padding: '3px 8px', borderRadius: 10, color: 'var(--txt-m)' }}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="btn-ghost"
                style={{ padding: '7px 14px', fontSize: 11 }}
              >
                Edit
              </button>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                { label: 'Level', value: `L${level}` },
                { label: 'Stars', value: totalStars },
                { label: 'Streak', value: `${streak}d` },
                { label: 'Ready', value: `${readiness}%` },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div className="font-mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>{s.value}</div>
                  <div style={{ fontSize: 9, color: 'var(--txt-d)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)', marginBottom: 14 }}>Edit Profile</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                className="input-glass"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full Name"
                style={{ padding: '11px 13px', fontSize: 13 }}
              />
              <input
                className="input-glass"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                style={{ padding: '11px 13px', fontSize: 13 }}
              />
              <select
                className="input-glass"
                value={company}
                onChange={e => setCompany(e.target.value)}
                style={{ padding: '11px 13px', fontSize: 13 }}
              >
                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="input-glass"
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{ padding: '11px 13px', fontSize: 13 }}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn-ghost"
                  onClick={() => setEditing(false)}
                  style={{ flex: 1, padding: '11px', fontSize: 12 }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={saveProfile}
                  style={{ flex: 2, padding: '11px', fontSize: 12 }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress overview */}
      <div className="glass" style={{ padding: '14px 16px', borderRadius: 16, marginBottom: 18 }}>
        <div
          className="font-display"
          style={{ fontSize: 10, letterSpacing: '0.15em', color: 'var(--txt-m)', textTransform: 'uppercase', marginBottom: 12 }}
        >
          Progress Overview
        </div>
        {[
          { label: 'Easy', total: puzzles.filter(p=>p.tier===1).length, done: puzzles.filter(p=>p.tier===1&&solved.has(p.id)).length, color: 'var(--ok)' },
          { label: 'Medium', total: puzzles.filter(p=>p.tier===2).length, done: puzzles.filter(p=>p.tier===2&&solved.has(p.id)).length, color: 'var(--warn)' },
          { label: 'Hard', total: puzzles.filter(p=>p.tier===3).length, done: puzzles.filter(p=>p.tier===3&&solved.has(p.id)).length, color: 'var(--err)' },
        ].map(t => (
          <div key={t.label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: t.color }}>{t.label}</span>
              <span className="font-mono" style={{ fontSize: 11, color: 'var(--txt-m)' }}>{t.done}/{t.total}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(t.done/t.total)*100}%`, background: t.color, boxShadow: `0 0 6px ${t.color}88` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Theme selector */}
      <div className="glass" style={{ padding: '14px 16px', borderRadius: 16, marginBottom: 18 }}>
        <div
          className="font-display"
          style={{ fontSize: 10, letterSpacing: '0.15em', color: 'var(--txt-m)', textTransform: 'uppercase', marginBottom: 12 }}
        >
          Visual Theme
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {themes.map(t => (
            <button
              key={t.name}
              onClick={() => setTheme(t.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 12,
                border: `1px solid ${theme === t.name ? 'var(--glass-bs)' : 'var(--glass-b)'}`,
                background: theme === t.name ? 'var(--accent-dim)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {/* Swatch */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${themeSwatchColors[t.name][0]}, ${themeSwatchColors[t.name][1]})`,
                  flexShrink: 0,
                  boxShadow: theme === t.name ? `0 0 10px ${themeSwatchColors[t.name][0]}88` : 'none',
                }}
              />
              <span style={{ fontSize: 13, fontWeight: theme === t.name ? 600 : 400, color: theme === t.name ? 'var(--accent)' : 'var(--txt)' }}>
                {t.label}
              </span>
              {theme === t.name && (
                <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: 14 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Settings toggles */}
      <div className="glass" style={{ padding: '14px 16px', borderRadius: 16, marginBottom: 18 }}>
        <div
          className="font-display"
          style={{ fontSize: 10, letterSpacing: '0.15em', color: 'var(--txt-m)', textTransform: 'uppercase', marginBottom: 12 }}
        >
          Settings
        </div>
        {[
          { label: 'Sound Effects', desc: 'Audio feedback on interactions', val: sound, toggle: () => setSound(v => !v) },
          { label: 'Daily Reminders', desc: 'Practice streak notifications', val: notifs, toggle: () => setNotifs(v => !v) },
        ].map(s => (
          <div
            key={s.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid var(--glass-b)',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)' }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'var(--txt-d)', marginTop: 1 }}>{s.desc}</div>
            </div>
            <button
              onClick={s.toggle}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: 'none',
                background: s.val ? 'var(--accent)' : 'var(--glass-b)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
                boxShadow: s.val ? '0 0 8px var(--accent-glow)' : 'none',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: s.val ? 22 : 2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'left 0.2s',
                }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div
        className="glass"
        style={{ padding: '14px 16px', borderRadius: 16, border: '1px solid rgba(255,82,82,0.2)' }}
      >
        <div style={{ fontSize: 11, color: 'var(--err)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
          ⚠ Danger Zone
        </div>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="btn-ghost"
            style={{ width: '100%', padding: '11px', fontSize: 12, borderColor: 'rgba(255,82,82,0.3)', color: 'var(--err)' }}
          >
            Reset All Progress
          </button>
        ) : (
          <div>
            <div style={{ fontSize: 12, color: 'var(--txt-m)', marginBottom: 10 }}>
              This will erase all solved puzzles, stars, and XP. Are you sure?
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn-ghost"
                onClick={() => setConfirmReset(false)}
                style={{ flex: 1, padding: '10px', fontSize: 12 }}
              >
                Cancel
              </button>
              <button
                onClick={onReset}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 10,
                  background: 'rgba(255,82,82,0.15)',
                  border: '1px solid rgba(255,82,82,0.4)',
                  color: 'var(--err)',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
