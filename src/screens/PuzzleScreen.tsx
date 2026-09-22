import { useState, useEffect, useRef } from 'react'
import type { Puzzle, PuzzleResult } from '../types'

interface Props {
  puzzle: Puzzle
  onComplete: (result: PuzzleResult) => void
  onBack: () => void
}

function HintPanel({ hints, level, onReveal }: { hints: [string,string,string]; level: number; onReveal: () => void }) {
  return (
    <div style={{ marginTop: 16 }}>
      {level > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {hints.slice(0, level).map((h, i) => (
            <div
              key={i}
              className="hint-card glass"
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div style={{ fontSize: 10, color: 'var(--accent)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Hint {i + 1}
              </div>
              <div style={{ fontSize: 13, color: 'var(--txt)' }}>{h}</div>
            </div>
          ))}
        </div>
      )}
      {level < 3 && (
        <button
          onClick={onReveal}
          className="btn-ghost"
          style={{ width: '100%', padding: '10px', fontSize: 12, marginTop: level > 0 ? 8 : 0 }}
        >
          💡 {level === 0 ? 'Get Hint (−1★ max)' : `Hint ${level + 1} of 3`}
        </button>
      )}
    </div>
  )
}

// ── Puzzle renderers ────────────────────────────────────────────────

function ChoicePuzzle({ data, onAnswer }: { data: Extract<Puzzle['data'], { type: 'choice' }>; onAnswer: (idx: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const submit = () => {
    if (selected === null) return
    setSubmitted(true)
    setTimeout(() => onAnswer(selected), 600)
  }

  return (
    <div>
      {data.context && (
        <div
          className="glass font-mono"
          style={{
            padding: '14px 16px',
            borderRadius: 12,
            fontSize: 13,
            color: 'var(--accent)',
            marginBottom: 16,
            lineHeight: 1.6,
            whiteSpace: 'pre',
          }}
        >
          {data.context}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect = submitted && i === data.correct
          const isWrong = submitted && isSelected && i !== data.correct
          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              style={{
                padding: '14px 16px',
                borderRadius: 12,
                border: `1px solid ${isCorrect ? 'var(--ok)' : isWrong ? 'var(--err)' : isSelected ? 'var(--glass-bs)' : 'var(--glass-b)'}`,
                background: isCorrect ? 'rgba(0,230,118,0.12)' : isWrong ? 'rgba(255,82,82,0.12)' : isSelected ? 'var(--accent-dim)' : 'var(--glass)',
                color: isCorrect ? 'var(--ok)' : isWrong ? 'var(--err)' : isSelected ? 'var(--accent)' : 'var(--txt)',
                cursor: submitted ? 'default' : 'pointer',
                textAlign: 'left',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.15s',
                boxShadow: isSelected && !submitted ? '0 0 10px var(--accent-glow)' : undefined,
              }}
            >
              <span
                className="font-mono"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  background: isSelected ? 'var(--accent)' : 'var(--glass-b)',
                  color: isSelected ? '#000' : 'var(--txt-m)',
                  flexShrink: 0,
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="font-mono" style={{ fontSize: 13 }}>{opt}</span>
              {isCorrect && <span style={{ marginLeft: 'auto' }}>✓</span>}
              {isWrong && <span style={{ marginLeft: 'auto' }}>✗</span>}
            </button>
          )
        })}
      </div>
      <button
        className="btn-primary"
        onClick={submit}
        disabled={selected === null || submitted}
        style={{ width: '100%', padding: '14px', fontSize: 13, marginTop: 16 }}
      >
        SUBMIT ANSWER
      </button>
    </div>
  )
}

function GridPuzzle({ data, onAnswer }: { data: Extract<Puzzle['data'], { type: 'grid' }>; onAnswer: (correct: boolean) => void }) {
  const totalCells = data.size * data.size
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  const toggle = (idx: number) => {
    if (submitted) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const submit = () => {
    setSubmitted(true)
    const correct = data.solution.length === selected.size && data.solution.every(i => selected.has(i))
    setTimeout(() => onAnswer(correct), 500)
  }

  const isInSolution = (idx: number) => data.solution.includes(idx)

  return (
    <div>
      <div
        className="glass"
        style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 14, fontSize: 12, color: 'var(--txt-m)' }}
      >
        {data.prompt}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${data.size}, 1fr)`,
          gap: 6,
          maxWidth: 280,
          margin: '0 auto 16px',
        }}
      >
        {Array.from({ length: totalCells }).map((_, idx) => {
          const row = Math.floor(idx / data.size)
          const col = idx % data.size
          const isSelected = selected.has(idx)
          const isCorrectCell = submitted && isInSolution(idx)
          const isWrongCell = submitted && isSelected && !isInSolution(idx)
          const isMissedCell = submitted && !isSelected && isInSolution(idx)

          return (
            <button
              key={idx}
              onClick={() => toggle(idx)}
              style={{
                aspectRatio: '1',
                borderRadius: 8,
                border: `1px solid ${isCorrectCell ? 'var(--ok)' : isWrongCell ? 'var(--err)' : isMissedCell ? 'var(--warn)' : isSelected ? 'var(--glass-bs)' : 'var(--glass-b)'}`,
                background: isCorrectCell ? 'rgba(0,230,118,0.2)' : isWrongCell ? 'rgba(255,82,82,0.2)' : isMissedCell ? 'rgba(255,179,0,0.2)' : isSelected ? 'var(--accent-dim)' : 'var(--glass)',
                cursor: submitted ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                transition: 'all 0.12s',
                boxShadow: isSelected && !submitted ? '0 0 8px var(--accent-glow)' : undefined,
              }}
            >
              <span className="font-mono" style={{ fontSize: 8, color: 'var(--txt-d)' }}>
                {row},{col}
              </span>
              {isSelected && !submitted && (
                <span style={{ fontSize: 10, color: 'var(--accent)' }}>●</span>
              )}
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn-ghost"
          onClick={() => setSelected(new Set())}
          disabled={submitted}
          style={{ flex: 1, padding: '12px', fontSize: 12 }}
        >
          ↺ Clear
        </button>
        <button
          className="btn-primary"
          onClick={submit}
          disabled={selected.size === 0 || submitted}
          style={{ flex: 2, padding: '12px', fontSize: 12 }}
        >
          SUBMIT ({selected.size} selected)
        </button>
      </div>
    </div>
  )
}

function OrderPuzzle({ data, onAnswer }: { data: Extract<Puzzle['data'], { type: 'order' }>; onAnswer: (correct: boolean) => void }) {
  const [tapped, setTapped] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)

  const tap = (idx: number) => {
    if (submitted || tapped.includes(idx)) return
    setTapped(prev => [...prev, idx])
  }

  const untap = (idx: number) => {
    if (submitted) return
    setTapped(prev => prev.filter(i => i !== idx))
  }

  const submit = () => {
    if (tapped.length !== data.items.length) return
    setSubmitted(true)
    const correct = tapped.every((v, i) => v === data.correctOrder[i])
    setTimeout(() => onAnswer(correct), 500)
  }

  return (
    <div>
      {data.direction && (
        <div style={{ fontSize: 12, color: 'var(--txt-m)', marginBottom: 12, fontStyle: 'italic' }}>
          {data.direction}
        </div>
      )}
      {/* Items to tap */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {data.items.map((item, idx) => {
          const tapIdx = tapped.indexOf(idx)
          const isTapped = tapIdx !== -1
          const isCorrectPos = submitted && data.correctOrder[tapIdx] === idx
          const isWrongPos = submitted && isTapped && data.correctOrder[tapIdx] !== idx
          const isMissed = submitted && !isTapped

          return (
            <button
              key={idx}
              onClick={() => isTapped ? untap(idx) : tap(idx)}
              disabled={submitted}
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: `1px solid ${isCorrectPos ? 'var(--ok)' : isWrongPos ? 'var(--err)' : isMissed ? 'var(--warn)' : isTapped ? 'var(--glass-bs)' : 'var(--glass-b)'}`,
                background: isCorrectPos ? 'rgba(0,230,118,0.12)' : isWrongPos ? 'rgba(255,82,82,0.12)' : isTapped ? 'var(--accent-dim)' : 'var(--glass)',
                cursor: submitted ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.15s',
              }}
            >
              <span
                className="font-mono"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  background: isTapped ? 'var(--accent)' : 'var(--glass-b)',
                  color: isTapped ? '#000' : 'var(--txt-m)',
                  flexShrink: 0,
                }}
              >
                {isTapped ? tapIdx + 1 : '?'}
              </span>
              <span style={{ fontSize: 13, color: 'var(--txt)', flex: 1 }}>{item}</span>
              {isCorrectPos && <span style={{ color: 'var(--ok)' }}>✓</span>}
              {isWrongPos && <span style={{ color: 'var(--err)' }}>✗</span>}
              {isTapped && !submitted && (
                <span style={{ fontSize: 10, color: 'var(--txt-d)' }}>tap to remove</span>
              )}
            </button>
          )
        })}
      </div>
      {/* Progress indicator */}
      <div style={{ fontSize: 11, color: 'var(--txt-m)', marginBottom: 10, textAlign: 'center' }}>
        {tapped.length} / {data.items.length} ordered
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn-ghost"
          onClick={() => setTapped([])}
          disabled={submitted}
          style={{ flex: 1, padding: '12px', fontSize: 12 }}
        >
          ↺ Reset
        </button>
        <button
          className="btn-primary"
          onClick={submit}
          disabled={tapped.length < data.items.length || submitted}
          style={{ flex: 2, padding: '12px', fontSize: 12 }}
        >
          SUBMIT ORDER
        </button>
      </div>
    </div>
  )
}

// ── Main puzzle screen ──────────────────────────────────────────────

const catColor: Record<string, string> = {
  Logical: 'var(--accent)', Math: '#ffb300', Arrangement: '#ce93d8', Spatial: '#4dd0e1',
}

export default function PuzzleScreen({ puzzle, onComplete, onBack }: Props) {
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [moves, setMoves] = useState(0)
  const [hints, setHints] = useState(0)
  const [showHints, setShowHints] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    intervalRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(intervalRef.current)
  }, [startTime])

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const calcStars = (correct: boolean, time: number, hintsUsed: number, movesUsed: number): number => {
    if (!correct) return 0
    let s = 3
    if (hintsUsed >= 2) s = Math.min(s, 1)
    else if (hintsUsed >= 1) s = Math.min(s, 2)
    const timeLimit = puzzle.difficulty === 'Easy' ? 60 : puzzle.difficulty === 'Medium' ? 120 : 180
    if (time > timeLimit * 2) s = Math.min(s, 1)
    else if (time > timeLimit) s = Math.min(s, 2)
    return s
  }

  const handleChoice = (idx: number) => {
    clearInterval(intervalRef.current)
    const correct = idx === (puzzle.data as any).correct
    const stars = calcStars(correct, elapsed, hints, moves)
    onComplete({ puzzleId: puzzle.id, stars, timeSecs: elapsed, moves, hintsUsed: hints })
  }

  const handleGrid = (correct: boolean) => {
    clearInterval(intervalRef.current)
    const stars = calcStars(correct, elapsed, hints, moves)
    onComplete({ puzzleId: puzzle.id, stars, timeSecs: elapsed, moves, hintsUsed: hints })
  }

  const handleOrder = (correct: boolean) => {
    clearInterval(intervalRef.current)
    const stars = calcStars(correct, elapsed, hints, moves)
    onComplete({ puzzleId: puzzle.id, stars, timeSecs: elapsed, moves, hintsUsed: hints })
  }

  return (
    <div
      className="bg-mesh scrollable"
      style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
    >
      {/* Top bar */}
      <div
        className="glass"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderRadius: 0,
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--txt-m)', cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1 }}
        >
          ←
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="font-display"
            style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {puzzle.title}
          </div>
          <div style={{ fontSize: 10, color: 'var(--txt-m)', display: 'flex', gap: 6, marginTop: 1 }}>
            <span style={{ color: catColor[puzzle.category] }}>{puzzle.category}</span>
            <span>·</span>
            <span>{puzzle.difficulty}</span>
            <span>·</span>
            <span>{puzzle.companies[0]}</span>
          </div>
        </div>
        {/* Timer + moves */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <div className="glass" style={{ padding: '4px 10px', borderRadius: 8, textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{fmt(elapsed)}</div>
            <div style={{ fontSize: 8, color: 'var(--txt-d)', textTransform: 'uppercase' }}>Time</div>
          </div>
          <div className="glass" style={{ padding: '4px 10px', borderRadius: 8, textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)' }}>{moves}</div>
            <div style={{ fontSize: 8, color: 'var(--txt-d)', textTransform: 'uppercase' }}>Moves</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 16px 32px', flex: 1 }}>
        {/* Puzzle question */}
        <div className="glass-strong" style={{ padding: '16px', borderRadius: 14, marginBottom: 20, border: '1px solid var(--glass-bs)' }}>
          <div style={{ fontSize: 14, color: 'var(--txt)', lineHeight: 1.6 }}>
            {puzzle.data.question}
          </div>
        </div>

        {/* Interactive area */}
        {puzzle.data.type === 'choice' && (
          <ChoicePuzzle data={puzzle.data} onAnswer={handleChoice} />
        )}
        {puzzle.data.type === 'grid' && (
          <GridPuzzle data={puzzle.data} onAnswer={handleGrid} />
        )}
        {puzzle.data.type === 'order' && (
          <OrderPuzzle data={puzzle.data} onAnswer={handleOrder} />
        )}
        {puzzle.data.type === 'matrix' && (
          <ChoicePuzzle
            data={{ type: 'choice', question: puzzle.data.question, options: puzzle.data.options, correct: puzzle.data.correct }}
            onAnswer={handleChoice}
          />
        )}

        {/* Hint section */}
        <div style={{ marginTop: 8 }}>
          <HintPanel
            hints={puzzle.hints}
            level={hints}
            onReveal={() => setHints(h => Math.min(3, h + 1))}
          />
        </div>
      </div>
    </div>
  )
}
