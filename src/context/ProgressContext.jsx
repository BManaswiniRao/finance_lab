import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'finance-lab-progress'
const ProgressContext = createContext(null)

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function ProgressProvider({ children }) {
  const [visited, setVisited] = useState(loadProgress)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visited))
    } catch {
      // storage unavailable; progress just won't persist
    }
  }, [visited])

  const markVisited = useCallback((moduleId) => {
    setVisited((prev) => (prev[moduleId] ? prev : { ...prev, [moduleId]: true }))
  }, [])

  const isVisited = useCallback((moduleId) => Boolean(visited[moduleId]), [visited])

  const resetProgress = useCallback(() => setVisited({}), [])

  return (
    <ProgressContext.Provider value={{ visited, markVisited, isVisited, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
