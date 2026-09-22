import { useState, useMemo } from 'react'
import { puzzles } from '../data/puzzles'
import type { UserProfile, Category, Difficulty, CompanyTag } from '../types'
import CompanyLogo from '../components/CompanyLogo'

interface Props {
  user: UserProfile
  solved: Set<number>
  stars: Record<number, number>
  bookmarks: Set<number>
  streak: number
  xp: number
  onPuzzle: (id: number) => void
  onToggleBookmark: (id: number) => void
}

const CATS: (Category | 'All')[] = ['All', 'Logical', 'Math', 'Arrangement', 'Spatial']
const DIFFS: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard']
const COMPANIES: CompanyTag[] = ['All', 'Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Goldman']

function StarRow({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < count ? 'star' : 'star-empty'} style={{ fontSize: 10 }}>★</span>
      ))}
    </span>
  )
}

const catColor: Record<string, string> = {
  Logical: 'var(--accent)',
  Math: '#ffb300',
  Arrangement: '#ce93d8',
  Spatial: '#4dd0e1',
}
const diffColor: Record<string, string> = {
  Easy: 'var(--ok)',
  Medium: 'var(--warn)',
  Hard: 'var(--err)',
}

export default function Dashboard({ user, solved, stars, bookmarks, streak, xp, onPuzzle, onToggleBookmark }: Props) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState<Category | 'All'>('All')
  const [diff, setDiff] = useState<Difficulty | 'All'>('All')
  const [company, setCompany] = useState<CompanyTag>('All')

  const readiness = Math.min(100, Math.round((solved.size / puzzles.length) * 100) + streak * 2)
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0)
  const level = Math.floor(xp / 200) + 1

  const filtered = useMemo(() => {
    return puzzles.filter(p => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.category.toLowerCase().includes(search.toLowerCase())) return false
      if (cat !== 'All' && p.category !== cat) return false
      if (diff !== 'All' && p.difficulty !== diff) return false
      if (company !== 'All' && !p.companies.includes(company)) return false
      return true
    })
  }, [search, cat, diff, company])

  const dailyPuzzle = puzzles[new Date().getDate() % puzzles.length]
  const nextPuzzle = puzzles.find(p => !solved.has(p.id))

  return (
    <div
      className="bg-mesh scrollable dashboard-screen"
      style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      <div className="screen-safe-top" style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div
              className="font-display"
              style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 2 }}
            >
              ◈ Interview Prep
            </div>
            <h2
              className="font-display"
              style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--txt)' }}
            >
              Hey, {user.isGuest ? 'Guest' : user.name.split(' ')[0]} 👋
            </h2>
            <div style={{ fontSize: 12, color: 'var(--txt-m)', marginTop: 2 }}>
              {user.company} · {user.role}
            </div>
          </div>
          <div
            className="glass"
            style={{
              padding: '8px 14px',
              borderRadius: 12,
              textAlign: 'center',
              minWidth: 70,
            }}
          >
            <div className="font-mono" style={{ fontSize: 18, fontWeight: 600, color: 'var(--accent)' }}>
              {readiness}%
            </div>
            <div style={{ fontSize: 9, color: 'var(--txt-d)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Readiness
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {[
            { label: 'Level', value: `L${level}`, icon: '◈' },
            { label: 'Stars', value: totalStars, icon: '★' },
            { label: 'Streak', value: `${streak}d`, icon: '🔥' },
            { label: 'Solved', value: `${solved.size}/25`, icon: '✓' },
          ].map(s => (
            <div
              key={s.label}
              className="glass"
              style={{ flex: 1, padding: '10px 6px', borderRadius: 12, textAlign: 'center' }}
            >
              <div style={{ fontSize: 14 }}>{s.icon}</div>
              <div className="font-mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', lineHeight: 1.2 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 9, color: 'var(--txt-d)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Action cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {nextPuzzle && (
            <button
              onClick={() => onPuzzle(nextPuzzle.id)}
              className="glass-strong glow-accent-sm"
              style={{
                gridColumn: '1 / -1',
                padding: '14px 16px',
                borderRadius: 14,
                border: '1px solid var(--glass-bs)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--accent-dim)',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
                  ▶ Continue
                </div>
                <div className="font-display" style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginTop: 2 }}>
                  {nextPuzzle.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--txt-m)', marginTop: 1 }}>
                  {nextPuzzle.category} · {nextPuzzle.difficulty}
                </div>
              </div>
              <span style={{ fontSize: 24, opacity: 0.7 }}>→</span>
            </button>
          )}
          <button
            onClick={() => onPuzzle(dailyPuzzle.id)}
            className="glass"
            style={{
              padding: '12px 14px',
              borderRadius: 14,
              border: '1px solid var(--glass-b)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: 16, marginBottom: 4 }}>📅</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt)' }}>Daily Challenge</div>
            <div style={{ fontSize: 10, color: 'var(--txt-m)', marginTop: 2 }}>{dailyPuzzle.title}</div>
          </button>
          <div
            className="glass"
            style={{ padding: '12px 14px', borderRadius: 14 }}
          >
            <div style={{ fontSize: 16, marginBottom: 4 }}>⚡</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt)' }}>XP Progress</div>
            <div style={{ marginTop: 6 }}>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(xp % 200) / 2}%` }} />
              </div>
              <div className="font-mono" style={{ fontSize: 9, color: 'var(--txt-m)', marginTop: 3 }}>
                {xp % 200} / 200 XP → Level {level + 1}
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <input
          className="input-glass"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search puzzles..."
          style={{ width: '100%', padding: '11px 14px', fontSize: 13, marginBottom: 12 }}
        />

        {/* Company filter chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 8 }}>
          {COMPANIES.map(c => (
            <button
              key={c}
              onClick={() => setCompany(c)}
              style={{
                flexShrink: 0,
                padding: '5px 12px',
                borderRadius: 20,
                fontSize: 11,
                border: `1px solid ${company === c ? 'var(--glass-bs)' : 'var(--glass-b)'}`,
                background: company === c ? 'var(--accent-dim)' : 'transparent',
                color: company === c ? 'var(--accent)' : 'var(--txt-m)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {c === 'All' ? c : <CompanyLogo company={c} />}
            </button>
          ))}
        </div>

        {/* Category + difficulty filters */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                flexShrink: 0,
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 10,
                border: `1px solid ${cat === c ? 'var(--glass-bs)' : 'transparent'}`,
                background: cat === c ? 'var(--accent-dim)' : 'var(--glass)',
                color: cat === c ? 'var(--accent)' : 'var(--txt-m)',
                cursor: 'pointer',
              }}
            >
              {c}
            </button>
          ))}
          <div style={{ width: 1, background: 'var(--glass-b)', flexShrink: 0, alignSelf: 'stretch' }} />
          {DIFFS.map(d => (
            <button
              key={d}
              onClick={() => setDiff(d)}
              style={{
                flexShrink: 0,
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 10,
                border: `1px solid ${diff === d ? 'var(--glass-bs)' : 'transparent'}`,
                background: diff === d ? 'var(--accent-dim)' : 'var(--glass)',
                color: diff === d ? 'var(--accent)' : 'var(--txt-m)',
                cursor: 'pointer',
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div
          className="font-mono"
          style={{ fontSize: 10, color: 'var(--txt-d)', letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}
        >
          {filtered.length} puzzles
        </div>
      </div>

      {/* Puzzle grid */}
      <div
        className="puzzle-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
          padding: '0 16px 24px',
        }}
      >
        {filtered.map(p => {
          const isSolved = solved.has(p.id)
          const isBookmarked = bookmarks.has(p.id)
          const puzzleStars = stars[p.id] || 0
          const isLocked = p.tier === 2 && solved.size < 4
            || p.tier === 3 && solved.size < 12

          return (
            <div
              key={p.id}
              className={`puzzle-card glass ${isLocked ? 'locked' : ''}`}
              onClick={() => !isLocked && onPuzzle(p.id)}
              style={{
                padding: '14px 12px',
                borderRadius: 14,
                position: 'relative',
                borderColor: isSolved ? 'var(--ok)' : undefined,
                border: `1px solid ${isSolved ? 'rgba(0,230,118,0.25)' : 'var(--glass-b)'}`,
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: catColor[p.category],
                    flexShrink: 0,
                    marginTop: 4,
                    boxShadow: `0 0 6px ${catColor[p.category]}`,
                  }}
                />
                <button
                  onClick={e => { e.stopPropagation(); !isLocked && onToggleBookmark(p.id) }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: isBookmarked ? 'var(--accent)' : 'var(--txt-d)',
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  {isBookmarked ? '⊕' : '○'}
                </button>
              </div>

              {/* ID + lock */}
              <div className="font-mono" style={{ fontSize: 9, color: 'var(--txt-d)', marginBottom: 4 }}>
                #{String(p.id).padStart(2, '0')} {isLocked && '🔒'}
              </div>

              {/* Title */}
              <div
                className="font-display"
                style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt)', lineHeight: 1.3, marginBottom: 6 }}
              >
                {p.title}
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 8,
                    padding: '2px 6px',
                    borderRadius: 10,
                    background: `${catColor[p.category]}18`,
                    color: catColor[p.category],
                    border: `1px solid ${catColor[p.category]}30`,
                    letterSpacing: '0.05em',
                  }}
                >
                  {p.category}
                </span>
                <span
                  style={{
                    fontSize: 8,
                    padding: '2px 6px',
                    borderRadius: 10,
                    background: `${diffColor[p.difficulty]}18`,
                    color: diffColor[p.difficulty],
                    border: `1px solid ${diffColor[p.difficulty]}30`,
                  }}
                >
                  {p.difficulty}
                </span>
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <StarRow count={puzzleStars} />
                {isSolved && (
                  <span style={{ fontSize: 9, color: 'var(--ok)', fontWeight: 600 }}>✓ DONE</span>
                )}
              </div>

              {/* Tier indicator */}
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: `${p.tier === 1 ? 'var(--t1)' : p.tier === 2 ? 'var(--t2)' : 'var(--t3)'}20`,
                  border: `1px solid ${p.tier === 1 ? 'var(--t1)' : p.tier === 2 ? 'var(--t2)' : 'var(--t3)'}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8,
                  fontWeight: 700,
                  color: p.tier === 1 ? 'var(--t1)' : p.tier === 2 ? 'var(--t2)' : 'var(--t3)',
                }}
              >
                T{p.tier}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
