import { Outlet, Link, useLocation } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext.jsx'
import { MODULES } from '../data/modules.js'

export default function Layout() {
  const { visited } = useProgress()
  const location = useLocation()
  const total = MODULES.length
  const done = MODULES.filter((m) => visited[m.id]).length
  const onDashboard = location.pathname === '/'

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-10 border-b border-line bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-display text-sm font-bold text-white shadow-sm transition-transform group-hover:-rotate-6">
              ₹
            </span>
            <span className="font-display text-lg font-semibold text-ink">Finance Lab</span>
          </Link>

          {!onDashboard && (
            <Link
              to="/"
              className="hidden items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-accent-soft hover:text-accent sm:flex"
            >
              ← All modules
            </Link>
          )}

          <div className="flex items-center gap-2.5 text-sm text-ink-soft">
            <span className="hidden font-medium sm:inline">Your progress</span>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-line sm:w-32">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${total ? (done / total) * 100 : 0}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-ink">
              {done}/{total}
            </span>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-4 text-center text-xs text-ink-soft sm:px-6 lg:px-8">
        Built for learning, not for trading decisions. Numbers are illustrative.
      </footer>
    </div>
  )
}
