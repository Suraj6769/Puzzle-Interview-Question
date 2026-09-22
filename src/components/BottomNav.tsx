import type { NavTab } from '../types'

interface Props {
  active: NavTab
  onChange: (t: NavTab) => void
}

const tabs: { id: NavTab; label: string; icon: string }[] = [
  { id: 'puzzles', label: 'Puzzles', icon: '⬡' },
  { id: 'tiers', label: 'Tiers', icon: '◈' },
  { id: 'mastery', label: 'Mastery', icon: '◎' },
  { id: 'profile', label: 'Profile', icon: '◉' },
]

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="glass"
      style={{
        position: 'relative',
        borderTop: '1px solid var(--glass-b)',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        display: 'flex',
        alignItems: 'stretch',
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {tabs.map(tab => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            className="bottom-nav-item"
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: '10px 4px 14px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '25%',
                  right: '25%',
                  height: 2,
                  borderRadius: '0 0 2px 2px',
                  background: 'var(--accent)',
                  boxShadow: '0 0 8px var(--accent-glow)',
                }}
              />
            )}
            <span
              style={{
                fontSize: 20,
                lineHeight: 1,
                color: isActive ? 'var(--accent)' : 'var(--txt-m)',
                filter: isActive ? 'drop-shadow(0 0 6px var(--accent-glow))' : 'none',
                transition: 'color 0.2s, filter 0.2s',
              }}
            >
              {tab.icon}
            </span>
            <span
              className={isActive ? 'font-display' : ''}
              style={{
                fontSize: 9,
                letterSpacing: isActive ? '0.1em' : '0.05em',
                fontWeight: isActive ? 700 : 400,
                color: isActive ? 'var(--accent)' : 'var(--txt-m)',
                transition: 'color 0.2s',
                textTransform: 'uppercase',
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
