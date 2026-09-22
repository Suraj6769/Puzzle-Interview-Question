import { useMemo } from 'react'
import { puzzles } from '../data/puzzles'
import type { UserProfile, CategoryName } from '../types'

interface Props {
  user: UserProfile
  solved: Set<number>
  stars: Record<number, number>
  xp: number
  streak: number
  onPuzzle: (id: number) => void
}

const categories: CategoryName[] = ['Logical', 'Math', 'Arrangement', 'Spatial']
const catColors: Record<CategoryName, string> = {
  Logical: 'var(--accent)',
  Math: '#ffb300',
  Arrangement: '#ce93d8',
  Spatial: '#4dd0e1',
}
const catIcons: Record<CategoryName, string> = {
  Logical: '⊻', Math: '∑', Arrangement: '⇄', Spatial: '⬡',
}

const RANKS = [
  { min: 0, label: 'Recruit', icon: '◦' },
  { min: 3, label: 'Analyst', icon: '◈' },
  { min: 8, label: 'Engineer', icon: '◉' },
  { min: 15, label: 'Architect', icon: '◑' },
  { min: 20, label: 'Grandmaster', icon: '★' },
]

function GaugeSVG({ pct, color }: { pct: number; color: string }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const arc = circ * 0.75
  const offset = arc - (arc * Math.min(pct, 100)) / 100

  return (
    <svg width={140} height={90} viewBox="0 0 140 100" style={{ overflow: 'visible' }}>
      <circle
        cx={70} cy={75} r={r}
        stroke="var(--glass-bs)" strokeWidth={8} fill="none"
        strokeDasharray={`${arc} ${circ}`}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform="rotate(135 70 75)"
      />
      <circle
        cx={70} cy={75} r={r}
        stroke={color} strokeWidth={8} fill="none"
        strokeDasharray={`${arc} ${circ}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(135 70 75)"
        style={{
          filter: `drop-shadow(0 0 6px ${color})`,
          transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </svg>
  )
}

export default function Mastery({ user, solved, stars, xp, streak, onPuzzle }: Props) {
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0)
  const level = Math.floor(xp / 200) + 1
  const readiness = Math.min(100, Math.round((solved.size / 25) * 100 + streak * 1.5 + (totalStars / (25 * 3)) * 20))
  const rank = RANKS.slice().reverse().find(r => solved.size >= r.min) || RANKS[0]

  const catStats = useMemo(() => {
    return categories.map(cat => {
      const catPuzzles = puzzles.filter(p => p.category === cat)
      const catSolved = catPuzzles.filter(p => solved.has(p.id)).length
      const catStars = catPuzzles.reduce((acc, p) => acc + (stars[p.id] || 0), 0)
      const maxStars = catPuzzles.length * 3
      const pct = catPuzzles.length ? Math.round((catSolved / catPuzzles.length) * 100) : 0
      return { cat, total: catPuzzles.length, solved: catSolved, stars: catStars, maxStars, pct }
    })
  }, [solved, stars])

  const strengths = catStats.filter(c => c.pct >= 60).map(c => c.cat)
  const improve = catStats.filter(c => c.pct < 40).map(c => c.cat)

  const achievements = [
    { id: 'first', label: 'First Blood', icon: '⚡', desc: 'Solved first puzzle', earned: solved.size >= 1 },
    { id: 'tier1', label: 'Tier I Clear', icon: '◈', desc: 'Solved all Easy puzzles', earned: puzzles.filter(p=>p.tier===1).every(p=>solved.has(p.id)) },
    { id: 'tier2', label: 'Tier II Clear', icon: '◉', desc: 'Solved all Medium puzzles', earned: puzzles.filter(p=>p.tier===2).every(p=>solved.has(p.id)) },
    { id: 'tier3', label: 'Master', icon: '★', desc: 'Solved all Hard puzzles', earned: puzzles.filter(p=>p.tier===3).every(p=>solved.has(p.id)) },
    { id: 'streak5', label: '5-Day Streak', icon: '🔥', desc: 'Practiced 5 days in a row', earned: streak >= 5 },
    { id: 'perfectstar', label: 'Perfectionist', icon: '🎯', desc: 'Got 3 stars on 5 puzzles', earned: Object.values(stars).filter(s=>s===3).length >= 5 },
    { id: 'nohints', label: 'Unaided', icon: '🧠', desc: 'Solved 3 puzzles without hints', earned: solved.size >= 3 },
    { id: 'speed', label: 'Speed Demon', icon: '⚡', desc: 'Solved a puzzle under 30s', earned: solved.size >= 1 },
  ]

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
          ◎ Performance Analytics
        </div>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--txt)' }}>
          Mastery Report
        </h2>
      </div>

      {/* Readiness gauge */}
      <div
        className="glass-strong"
        style={{
          padding: '20px 16px',
          borderRadius: 20,
          marginBottom: 18,
          border: '1px solid var(--glass-bs)',
          textAlign: 'center',
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <GaugeSVG pct={readiness} color="var(--accent)" />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
            <div className="font-mono glow-text" style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
              {readiness}
            </div>
            <div style={{ fontSize: 9, color: 'var(--txt-d)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Readiness
            </div>
          </div>
        </div>
        <div className="font-display" style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', marginTop: 8 }}>
          {rank.icon} {rank.label}
        </div>
        <div style={{ fontSize: 11, color: 'var(--txt-m)' }}>
          Target: {user.company} · {user.role}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 18 }}>
        {[
          { label: 'Total XP', value: xp.toLocaleString(), icon: '⚡', color: 'var(--accent)' },
          { label: 'Streak', value: `${streak} days`, icon: '🔥', color: '#ff9100' },
          { label: 'Total Stars', value: `${totalStars} / ${25*3}`, icon: '★', color: 'var(--star)' },
          { label: 'Rank', value: rank.label, icon: rank.icon, color: 'var(--accent2)' },
          { label: 'Level', value: `Level ${level}`, icon: '◈', color: 'var(--t2)' },
          { label: 'Solved', value: `${solved.size} / 25`, icon: '✓', color: 'var(--ok)' },
        ].map(s => (
          <div key={s.label} className="glass" style={{ padding: '12px 14px', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span style={{ fontSize: 10, color: 'var(--txt-d)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
            </div>
            <div className="font-mono" style={{ fontSize: 16, fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div style={{ marginBottom: 18 }}>
        <div
          className="font-display"
          style={{ fontSize: 11, letterSpacing: '0.15em', color: 'var(--txt-m)', textTransform: 'uppercase', marginBottom: 12 }}
        >
          Category Breakdown
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {catStats.map(({ cat, total, solved: catSolved, stars: catStars, maxStars, pct }) => (
            <div key={cat} className="glass" style={{ padding: '12px 14px', borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, color: catColors[cat] }}>{catIcons[cat]}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)' }}>{cat}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="font-mono" style={{ fontSize: 13, color: catColors[cat] }}>{pct}%</span>
                  <span style={{ fontSize: 10, color: 'var(--txt-d)', marginLeft: 6 }}>{catSolved}/{total}</span>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${pct}%`, background: catColors[cat], boxShadow: `0 0 6px ${catColors[cat]}88` }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 10, color: 'var(--txt-d)' }}>
                  <span style={{ color: 'var(--star)' }}>★</span> {catStars}/{maxStars} stars
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: pct >= 60 ? 'var(--ok)' : pct >= 30 ? 'var(--warn)' : 'var(--err)',
                  }}
                >
                  {pct >= 60 ? '✓ Strong' : pct >= 30 ? '⚡ Progressing' : '◦ Needs Work'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths / Improve */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        <div className="glass" style={{ padding: '12px 14px', borderRadius: 14, border: '1px solid rgba(0,230,118,0.2)' }}>
          <div style={{ fontSize: 10, color: 'var(--ok)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            ✓ Strengths
          </div>
          {strengths.length > 0
            ? strengths.map(s => (
                <div key={s} style={{ fontSize: 12, color: 'var(--txt)', marginBottom: 4 }}>
                  <span style={{ color: catColors[s] }}>{catIcons[s]}</span> {s}
                </div>
              ))
            : <div style={{ fontSize: 11, color: 'var(--txt-d)' }}>Solve more to reveal</div>
          }
        </div>
        <div className="glass" style={{ padding: '12px 14px', borderRadius: 14, border: '1px solid rgba(255,179,0,0.2)' }}>
          <div style={{ fontSize: 10, color: 'var(--warn)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            ◈ Improve
          </div>
          {improve.length > 0
            ? improve.map(s => (
                <div key={s} style={{ fontSize: 12, color: 'var(--txt)', marginBottom: 4 }}>
                  <span style={{ color: catColors[s] }}>{catIcons[s]}</span> {s}
                </div>
              ))
            : <div style={{ fontSize: 11, color: 'var(--txt-d)' }}>All categories strong!</div>
          }
        </div>
      </div>

      {/* Achievements */}
      <div style={{ marginBottom: 8 }}>
        <div
          className="font-display"
          style={{ fontSize: 11, letterSpacing: '0.15em', color: 'var(--txt-m)', textTransform: 'uppercase', marginBottom: 12 }}
        >
          Achievements
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {achievements.map(a => (
            <div
              key={a.id}
              className="glass"
              style={{
                padding: '10px 12px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                opacity: a.earned ? 1 : 0.38,
                border: `1px solid ${a.earned ? 'var(--glass-bs)' : 'var(--glass-b)'}`,
                background: a.earned ? 'var(--accent-dim)' : undefined,
              }}
            >
              <span style={{ fontSize: 18, filter: a.earned ? `drop-shadow(0 0 6px var(--accent-glow))` : 'none' }}>
                {a.icon}
              </span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: a.earned ? 'var(--txt)' : 'var(--txt-d)' }}>{a.label}</div>
                <div style={{ fontSize: 9, color: 'var(--txt-d)', marginTop: 1 }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
