import { puzzles } from '../data/puzzles'

interface Props {
  solved: Set<number>
  stars: Record<number, number>
  onPuzzle: (id: number) => void
}

const tierInfo = [
  {
    tier: 1 as const,
    label: 'TIER I',
    name: 'Foundation',
    desc: 'Core concepts, pattern recognition, and first-principles reasoning.',
    color: 'var(--t1)',
    range: [1, 8],
    milestone: 4,
    milestoneLabel: 'Unlocks Medium Tier',
    icon: '◈',
  },
  {
    tier: 2 as const,
    label: 'TIER II',
    name: 'Intermediate',
    desc: 'Multi-step logic, data structures, and algorithmic thinking.',
    color: 'var(--t2)',
    range: [9, 17],
    milestone: 12,
    milestoneLabel: 'Unlocks Hard Tier',
    icon: '◉',
  },
  {
    tier: 3 as const,
    label: 'TIER III',
    name: 'Expert',
    desc: 'Distributed systems, probability, and advanced complexity.',
    color: 'var(--t3)',
    range: [18, 25],
    milestone: 20,
    milestoneLabel: 'Master Badge',
    icon: '★',
  },
]

function PuzzleNode({ puzzle, isSolved, isLocked, stars: puzzleStars, onClick }: {
  puzzle: typeof puzzles[0]
  isSolved: boolean
  isLocked: boolean
  stars: number
  onClick: () => void
}) {
  const catIcon: Record<string, string> = {
    Logical: '⊻', Math: '∑', Arrangement: '⇄', Spatial: '⬡',
  }
  const color = puzzle.tier === 1 ? 'var(--t1)' : puzzle.tier === 2 ? 'var(--t2)' : 'var(--t3)'

  return (
    <button
      className={`tier-node ${isLocked ? 'locked' : ''}`}
      onClick={onClick}
      disabled={isLocked}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        background: 'none',
        border: 'none',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        padding: 4,
      }}
    >
      <div
        className={isSolved ? '' : 'glass'}
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          position: 'relative',
          border: `1px solid ${isSolved ? color : 'var(--glass-b)'}`,
          background: isSolved ? `${color}22` : undefined,
          boxShadow: isSolved ? `0 0 12px ${color}44` : undefined,
        }}
      >
        {isLocked ? '🔒' : isSolved ? '✓' : catIcon[puzzle.category]}
        {isSolved && puzzleStars > 0 && (
          <span
            style={{
              position: 'absolute',
              bottom: -6,
              right: -6,
              background: 'var(--bg)',
              borderRadius: 8,
              fontSize: 8,
              padding: '1px 4px',
              color: 'var(--star)',
              border: '1px solid var(--glass-b)',
              letterSpacing: 1,
            }}
          >
            {'★'.repeat(puzzleStars)}
          </span>
        )}
      </div>
      <div style={{ fontSize: 9, color: isSolved ? color : 'var(--txt-d)', textAlign: 'center', lineHeight: 1.2, maxWidth: 52 }}>
        {puzzle.title.length > 10 ? puzzle.title.slice(0, 10) + '…' : puzzle.title}
      </div>
    </button>
  )
}

export default function TierMap({ solved, stars, onPuzzle }: Props) {
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0)

  return (
    <div
      className="bg-mesh scrollable screen-safe-top"
      style={{ flex: 1, minHeight: 0, paddingLeft: 16, paddingRight: 16, paddingBottom: 24 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          className="font-display"
          style={{ fontSize: 10, letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}
        >
          ◈ Progression Map
        </div>
        <h2
          className="font-display"
          style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--txt)' }}
        >
          Tier Journey
        </h2>
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <div className="font-mono" style={{ fontSize: 12, color: 'var(--txt-m)' }}>
            <span style={{ color: 'var(--star)' }}>★</span> {totalStars} stars
          </div>
          <div className="font-mono" style={{ fontSize: 12, color: 'var(--txt-m)' }}>
            ✓ {solved.size} / 25 solved
          </div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="glass" style={{ padding: 16, borderRadius: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--txt-m)' }}>Overall Progress</span>
          <span className="font-mono" style={{ fontSize: 12, color: 'var(--accent)' }}>
            {Math.round((solved.size / 25) * 100)}%
          </span>
        </div>
        <div className="progress-bar" style={{ height: 6 }}>
          <div className="progress-fill" style={{ width: `${(solved.size / 25) * 100}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          {tierInfo.map(t => {
            const tierPuzzles = puzzles.filter(p => p.tier === t.tier)
            const tierSolved = tierPuzzles.filter(p => solved.has(p.id)).length
            return (
              <span key={t.tier} style={{ fontSize: 10, color: 'var(--txt-d)' }}>
                <span style={{ color: t.color }}>T{t.tier}</span> {tierSolved}/{tierPuzzles.length}
              </span>
            )
          })}
        </div>
      </div>

      {/* Tiers */}
      {tierInfo.map((tier, ti) => {
        const tierPuzzles = puzzles.filter(p => p.tier === tier.tier)
        const tierSolved = tierPuzzles.filter(p => solved.has(p.id)).length
        const progress = tierSolved / tierPuzzles.length
        const isUnlocked = tier.tier === 1 || (tier.tier === 2 && solved.size >= 4) || (tier.tier === 3 && solved.size >= 12)
        const tierStars = tierPuzzles.reduce((acc, p) => acc + (stars[p.id] || 0), 0)
        const maxTierStars = tierPuzzles.length * 3

        return (
          <div key={tier.tier} style={{ marginBottom: 28 }}>
            {/* Tier header */}
            <div
              className="glass-strong"
              style={{
                padding: '14px 16px',
                borderRadius: 16,
                marginBottom: 16,
                border: `1px solid ${tier.color}28`,
                background: `${tier.color}0a`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div
                    className="font-display"
                    style={{ fontSize: 10, letterSpacing: '0.2em', color: tier.color, textTransform: 'uppercase' }}
                  >
                    {tier.icon} {tier.label}
                  </div>
                  <div
                    className="font-display"
                    style={{ fontSize: 16, fontWeight: 800, color: 'var(--txt)', marginTop: 2 }}
                  >
                    {tier.name}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {!isUnlocked && (
                    <div
                      className="glass"
                      style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, color: 'var(--txt-m)' }}
                    >
                      🔒 {tier.tier === 2 ? 'Solve 4 Easy' : 'Solve 12 Puzzles'}
                    </div>
                  )}
                  {isUnlocked && (
                    <div style={{ textAlign: 'right' }}>
                      <div className="font-mono" style={{ fontSize: 16, fontWeight: 700, color: tier.color }}>
                        {tierSolved}/{tierPuzzles.length}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--txt-d)' }}>
                        <span style={{ color: 'var(--star)' }}>{'★'.repeat(Math.min(3, Math.ceil(tierStars / tierPuzzles.length)))}</span>
                        {' '}{tierStars}/{maxTierStars}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ fontSize: 11, color: 'var(--txt-m)', marginBottom: 10 }}>{tier.desc}</div>

              <div className="progress-bar" style={{ height: 5 }}>
                <div
                  className="progress-fill"
                  style={{ width: `${progress * 100}%`, background: tier.color, boxShadow: `0 0 6px ${tier.color}88` }}
                />
              </div>
            </div>

            {/* Milestone */}
            {isUnlocked && tierSolved >= tier.milestone && (
              <div
                className="glass"
                style={{
                  padding: '8px 14px',
                  borderRadius: 12,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  border: `1px solid ${tier.color}40`,
                  background: `${tier.color}0d`,
                }}
              >
                <span style={{ fontSize: 16 }}>🏆</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: tier.color }}>Milestone Reached!</div>
                  <div style={{ fontSize: 10, color: 'var(--txt-m)' }}>{tier.milestoneLabel}</div>
                </div>
              </div>
            )}

            {/* Puzzle nodes grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 12,
                padding: '0 4px',
                opacity: isUnlocked ? 1 : 0.5,
              }}
            >
              {tierPuzzles.map((p, idx) => {
                const isLocked = !isUnlocked
                const isSolved = solved.has(p.id)
                return (
                  <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {idx > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          display: 'none',
                        }}
                      />
                    )}
                    <PuzzleNode
                      puzzle={p}
                      isSolved={isSolved}
                      isLocked={isLocked}
                      stars={stars[p.id] || 0}
                      onClick={() => !isLocked && onPuzzle(p.id)}
                    />
                  </div>
                )
              })}
            </div>

            {/* Connector to next tier */}
            {ti < tierInfo.length - 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
                <div style={{ width: 2, height: 30, background: `linear-gradient(${tier.color}, ${tierInfo[ti + 1].color})`, opacity: 0.4 }} />
                <div
                  className="glass"
                  style={{
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 10,
                    color: 'var(--txt-m)',
                    marginTop: 4,
                  }}
                >
                  {tier.tier === 1 ? 'Solve 4 → Unlock Medium' : 'Solve 12 → Unlock Hard'}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Master badge */}
      {solved.size >= 20 && (
        <div
          className="glass-strong glow-accent"
          style={{
            padding: 20,
            borderRadius: 16,
            textAlign: 'center',
            border: '1px solid var(--glass-bs)',
            marginTop: 8,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8, animation: 'float 3s infinite' }}>🏆</div>
          <div className="font-display glow-text" style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>
            PUZZLE MASTER
          </div>
          <div style={{ fontSize: 12, color: 'var(--txt-m)', marginTop: 4 }}>
            You have mastered the interview gauntlet.
          </div>
        </div>
      )}
    </div>
  )
}
