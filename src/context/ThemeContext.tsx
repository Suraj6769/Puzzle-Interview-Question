import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { ThemeName } from '../types'

interface ThemeCtx {
  theme: ThemeName
  setTheme: (t: ThemeName) => void
}

const Ctx = createContext<ThemeCtx>({ theme: 'cyber-indigo', setTheme: () => {} })

export const themes: { name: ThemeName; label: string; colors: [string, string] }[] = [
  { name: 'dark', label: 'Night Mode', colors: ['#35d8ff', '#7657ff'] },
  { name: 'light', label: 'Day Mode', colors: ['#246bff', '#a044ff'] },
]

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('pm-theme')
    return saved === 'light' ? 'light' : 'dark'
  })

  const setTheme = (t: ThemeName) => {
    setThemeState(t)
    localStorage.setItem('pm-theme', t)
  }

  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return
    themes.forEach(t => root.classList.remove(`theme-${t.name}`))
    root.classList.add(`theme-${theme}`)
  }, [theme])

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
