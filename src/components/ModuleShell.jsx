import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react'
import { useProgress } from '../context/ProgressContext.jsx'
import { LEVELS, MODULES } from '../data/modules.js'

export default function ModuleShell({ module, explainer, children, whyItMatters }) {
  const { markVisited } = useProgress()

  useEffect(() => {
    markVisited(module.id)
  }, [module.id, markVisited])

  const level = LEVELS[module.level]
  const Icon = module.icon
  const index = MODULES.findIndex((m) => m.id === module.id)
  const next = MODULES[(index + 1) % MODULES.length]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All modules
      </Link>

      <div className="mb-5 flex items-start gap-4">
        {Icon && (
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `color-mix(in srgb, ${level.color} 14%, transparent)`, color: level.color }}
          >
            <Icon className="h-6 w-6" strokeWidth={1.75} />
          </span>
        )}
        <div>
          <span
            className="mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide"
            style={{ color: level.color, backgroundColor: `color-mix(in srgb, ${level.color} 12%, transparent)` }}
          >
            {level.label}
          </span>
          <h1 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">{module.title}</h1>
        </div>
      </div>

      <p className="mb-7 max-w-2xl text-lg leading-relaxed text-ink-soft">{explainer}</p>

      <div className="animate-fade-up rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(33,28,22,0.04)] sm:p-7">
        {children}
      </div>

      {whyItMatters && (
        <div className="mt-6 flex gap-3 rounded-xl border border-accent-soft bg-accent-soft/50 px-5 py-4">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
          <p className="text-sm leading-relaxed text-ink">
            <span className="font-semibold text-accent">Why this matters — </span>
            {whyItMatters}
          </p>
        </div>
      )}

      <Link
        to={`/module/${next.id}`}
        className="group mt-8 flex items-center justify-between rounded-2xl border border-line bg-surface px-5 py-4 transition-colors hover:border-accent-soft"
      >
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-ink-soft">Up next</div>
          <div className="font-display font-semibold text-ink group-hover:text-accent">{next.title}</div>
        </div>
        <ArrowRight className="h-4 w-4 text-ink-soft transition-transform group-hover:translate-x-1 group-hover:text-accent" />
      </Link>
    </div>
  )
}
