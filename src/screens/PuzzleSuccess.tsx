import { useState, useEffect } from 'react'
import type { Puzzle, PuzzleResult } from '../types'
import { puzzles } from '../data/puzzles'

interface Props {
  puzzle: Puzzle
  result: PuzzleResult
  onNext: () => void
  onDashboard: () => void
}

function Particle({ color, delay, x }: { color: string; delay: number; x: number }) {
  return (
    <span
      className="particle"
      style={{
        background: color,
        left: `${x}%`,
        top: '-10px',
        animationDelay: `${delay}s`,
        width: Math.random() * 6 + 4,
        height: Math.random() * 6 + 4,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      }}
    />
  )
}

const colors = ['var(--accent)', 'var(--star)', 'var(--ok)', 'var(--accent2)', '#ff9100']

export default function PuzzleSuccess({ puzzle, result, onNext, onDashboard }: Props) {
  const [show, setShow] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const passed = result.stars > 0
  const nextPuzzle = puzzles.find(p => p.id > puzzle.id)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(t)
  }, [])

  const fmt = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`

  const sections = [
    {
      key: 'solution',
      label: '✓ Solution',
      content: puzzle.solution,
    },
    {
      key: 'algorithm',
      label: '⚙ Algorithm & Proof',
      content: puzzle.algorithm,
    },
    {
      key: 'complexity',
      label: '◈ Complexity',
      content: puzzle.complexity,
    },
    {
      key: 'takeaway',
      label: '💡 Interview Takeaway',
      content: puzzle.takeaway,
    },
  ]

  const particles = Array.from({ length: passed ? 20 : 0 }, (_, i) => ({
    color: colors[i % colors.length],
    delay: i * 0.06,
    x: (i / 20) * 100,
  }))

  return (
    <div
      className="bg-mesh scrollable"
      style={{ flex: 1, minHeight: 0, overflowY: 'auto', position: 'relative' }}
    >
      {/* Particles */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </div>

      <div style={{ padding: '32px 16px 32px', position: 'relative', zIndex: 2 }}>
        {/* Result header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          {passed ? (
            <>
              <div
                style={{
                  fontSize: 56,
                  marginBottom: 8,
                  animation: show ? 'bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
                  animationDelay: '0.1s',
                  display: 'inline-block',
                }}
              >
                🎯
              </div>
              <h1
                className="font-display glow-text"
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  margin: '0 0 6px',
                  color: 'var(--accent)',
                  animation: show ? 'slide-up 0.4s ease both' : 'none',
                  animationDelay: '0.2s',
                }}
              >
                PUZZLE SOLVED!
              </h1>
              <div style={{ fontSize: 14, color: 'var(--txt-m)', animation: show ? 'slide-up 0.4s ease both' : 'none', animationDelay: '0.3s' }}>
                {puzzle.title} · {puzzle.difficulty}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 48, marginBottom: 8 }}>⚡</div>
              <h1
                className="font-display"
                style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: 'var(--warn)' }}
              >
                NOT QUITE
              </h1>
              <div style={{ fontSize: 13, color: 'var(--txt-m)' }}>Review the solution below.</div>
            </>
          )}
        </div>

        {/* Stars */}
        {passed && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 28,
              animation: show ? 'slide-up 0.4s ease both' : 'none',
              animationDelay: '0.4s',
            }}
          >
            {[1, 2, 3].map((s, i) => (
              <span
                key={s}
                style={{
                  fontSize: 36,
                  color: s <= result.stars ? 'var(--star)' : 'var(--txt-d)',
                  filter: s <= result.stars ? 'drop-shadow(0 0 8px var(--star))' : 'none',
                  animation: s <= result.stars && show ? `star-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both` : 'none',
                  animationDelay: `${0.5 + i * 0.15}s`,
                  display: 'inline-block',
                }}
              >
                ★
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div
          className="glass-strong"
          style={{
            padding: 16,
            borderRadius: 16,
            marginBottom: 20,
            border: '1px solid var(--glass-bs)',
            animation: show ? 'slide-up 0.4s ease both' : 'none',
            animationDelay: '0.6s',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Time', value: fmt(result.timeSecs), icon: '⏱' },
              { label: 'Moves', value: result.moves === 0 ? '1' : result.moves, icon: '◈' },
              { label: 'Hints', value: `${result.hintsUsed}/3`, icon: '💡' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
                <div className="font-mono" style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--txt-d)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* XP earned */}
          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: '1px solid var(--glass-b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--txt-m)' }}>XP Earned</span>
            <span
              className="font-mono glow-text"
              style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}
            >
              +{passed ? (result.stars * 25 + (puzzle.tier === 1 ? 10 : puzzle.tier === 2 ? 20 : 30)) : 5} XP
            </span>
          </div>
        </div>

        {/* Performance label */}
        {passed && (
          <div
            className="glass"
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              marginBottom: 20,
              textAlign: 'center',
              border: `1px solid ${result.stars === 3 ? 'var(--ok)30' : result.stars === 2 ? 'var(--warn)30' : 'var(--glass-b)'}`,
              background: result.stars === 3 ? 'rgba(0,230,118,0.06)' : undefined,
            }}
          >
            <span style={{ fontSize: 12, color: result.stars === 3 ? 'var(--ok)' : result.stars === 2 ? 'var(--warn)' : 'var(--txt-m)' }}>
              {result.stars === 3 ? '⚡ Perfect — Lightning-fast, no hints!' : result.stars === 2 ? '✓ Strong — Good solve with minor help' : '◈ Solved — Room to optimize next time'}
            </span>
          </div>
        )}

        {/* Expandable solution sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {sections.map(sec => (
            <div key={sec.key} className="glass" style={{ borderRadius: 12, overflow: 'hidden' }}>
              <button
                onClick={() => setExpanded(expanded === sec.key ? null : sec.key)}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'var(--txt)',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <span>{sec.label}</span>
                <span style={{ color: 'var(--accent)', transition: 'transform 0.2s', transform: expanded === sec.key ? 'rotate(180deg)' : 'none' }}>
                  ▼
                </span>
              </button>
              {expanded === sec.key && (
                <div
                  style={{
                    padding: '0 16px 14px',
                    borderTop: '1px solid var(--glass-b)',
                    fontSize: 13,
                    color: 'var(--txt-m)',
                    lineHeight: 1.7,
                    animation: 'slide-up 0.2s ease both',
                  }}
                >
                  <div style={{ paddingTop: 12 }}>{sec.content}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {nextPuzzle && (
            <button
              className="btn-primary"
              onClick={onNext}
              style={{ width: '100%', padding: '16px', fontSize: 14 }}
            >
              NEXT PUZZLE → {nextPuzzle.title}
            </button>
          )}
          <button
            className="btn-ghost"
            onClick={onDashboard}
            style={{ width: '100%', padding: '14px', fontSize: 13 }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
