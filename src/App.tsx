import { useEffect, useState } from 'react'
import type { NavTab, PuzzleResult, Screen, UserProfile } from './types'
import { ThemeProvider } from './context/ThemeContext'
import { puzzles, PUZZLES } from './data/puzzles'
import BottomNav from './components/BottomNav'
import Onboarding from './screens/Onboarding'
import Dashboard from './screens/Dashboard'
import TierMap from './screens/TierMap'
import Mastery from './screens/Mastery'
import ProfileSettings from './screens/ProfileSettings'
import { PuzzlePlayScreen } from './components/PuzzlePlayScreen'

interface AppState {
  user: UserProfile | null
  solved: number[]
  stars: Record<number, number>
  bookmarks: number[]
  streak: number
  xp: number
}

const STORAGE_KEY = 'pm-state'

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { user: null, solved: [], stars: {}, bookmarks: [], streak: 1, xp: 0 }
}

function AppInner() {
  const [state, setState] = useState<AppState>(loadState)
  const [screen, setScreen] = useState<Screen>('onboarding')
  const [activeTab, setActiveTab] = useState<NavTab>('puzzles')
  const [activePuzzleId, setActivePuzzleId] = useState<number | null>(null)

  useEffect(() => {
    if (state.user) setScreen('dashboard')
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const solved = new Set<number>(state.solved)
  const bookmarks = new Set<number>(state.bookmarks)

  const handleOnboardingComplete = (user: UserProfile) => {
    setState(current => ({ ...current, user, streak: current.streak || 1 }))
    setScreen('dashboard')
  }

  const handlePuzzle = (id: number) => {
    setActivePuzzleId(id)
    setScreen('puzzle')
  }

  const handlePuzzleComplete = (result: PuzzleResult) => {
    setState(current => {
      const solvedNow = result.stars > 0 && !current.solved.includes(result.puzzleId)
        ? [...current.solved, result.puzzleId]
        : current.solved
      const previousStars = current.stars[result.puzzleId] || 0
      const stars = result.stars > previousStars
        ? { ...current.stars, [result.puzzleId]: result.stars }
        : current.stars
      return { ...current, solved: solvedNow, stars, xp: current.xp + (result.stars > 0 ? result.stars * 25 : 5) }
    })
    setScreen('dashboard')
    setActiveTab('puzzles')
  }

  const handleToggleBookmark = (id: number) => {
    setState(current => ({
      ...current,
      bookmarks: current.bookmarks.includes(id)
        ? current.bookmarks.filter(bookmark => bookmark !== id)
        : [...current.bookmarks, id],
    }))
  }

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab)
    setScreen({ puzzles: 'dashboard', tiers: 'tier-map', mastery: 'mastery', profile: 'profile' }[tab] as Screen)
  }

  const handleReset = () => {
    setState(current => ({ ...current, solved: [], stars: {}, bookmarks: [], streak: 1, xp: 0 }))
    setScreen('dashboard')
    setActiveTab('puzzles')
  }

  const handleUpdateProfile = (profile: UserProfile) => {
    setState(current => ({ ...current, user: profile }))
  }

  const activePuzzle = activePuzzleId ? puzzles.find(puzzle => puzzle.id === activePuzzleId) : null
  const legacyPuzzle = activePuzzleId ? PUZZLES[activePuzzleId - 1] : null
  const showNav = ['dashboard', 'tier-map', 'mastery', 'profile'].includes(screen)

  return (
    <div className="app-container" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {screen === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}
      {screen === 'dashboard' && state.user && <Dashboard user={state.user} solved={solved} stars={state.stars} bookmarks={bookmarks} streak={state.streak} xp={state.xp} onPuzzle={handlePuzzle} onToggleBookmark={handleToggleBookmark} />}
      {screen === 'tier-map' && <TierMap solved={solved} stars={state.stars} onPuzzle={handlePuzzle} />}
      {screen === 'mastery' && state.user && <Mastery user={state.user} solved={solved} stars={state.stars} xp={state.xp} streak={state.streak} onPuzzle={handlePuzzle} />}
      {screen === 'profile' && state.user && <ProfileSettings user={state.user} solved={solved} stars={state.stars} xp={state.xp} streak={state.streak} onUpdateProfile={handleUpdateProfile} onReset={handleReset} />}
      {screen === 'puzzle' && legacyPuzzle && (
        <PuzzlePlayScreen
          puzzle={legacyPuzzle}
          onBack={() => { setScreen('dashboard'); setActiveTab('puzzles') }}
          onSaveProgress={(puzzleId, stars) => handlePuzzleComplete({ puzzleId: activePuzzleId || 0, stars, timeSecs: 0, moves: 0, hintsUsed: 0 })}
          onNextPuzzle={() => { const next = puzzles.find(puzzle => puzzle.id > (activePuzzleId || 0) && !solved.has(puzzle.id)); if (next) handlePuzzle(next.id) }}
        />
      )}
      {showNav && <BottomNav active={activeTab} onChange={handleTabChange} />}
      {!activePuzzle && screen === 'puzzle' && null}
    </div>
  )
}

export default function App() {
  return <ThemeProvider><AppInner /></ThemeProvider>
}
