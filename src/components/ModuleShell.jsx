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
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Finance Lab
      </Link>

      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: level.color }}>
        {Icon && <Icon className="h-4 w-4" strokeWidth={2} />}
        {level.label}
      </div>

      <h1 className="font-display mb-5 text-3xl font-semibold leading-tight text-ink sm:text-4xl">{module.title}</h1>

      <div className="max-w-2xl space-y-4 text-lg leading-relaxed text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink">
        {explainer}
      </div>

      <div className="animate-fade-up mt-8 rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(33,28,22,0.04)] sm:p-7">
        {children}
      </div>

      {whyItMatters && (
        <div className="mt-8 flex gap-3 rounded-xl border border-accent-soft bg-accent-soft/50 px-5 py-4">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
          <p className="text-sm leading-relaxed text-ink">
            <span className="font-semibold text-accent">Why this matters — </span>
            {whyItMatters}
          </p>
        </div>
      )}

      <Link
        to={`/module/${next.id}`}
        className="group mt-10 flex items-center gap-2 border-t border-line pt-6 text-sm text-ink-soft transition-colors hover:text-accent"
      >
        Continue reading
        <span className="font-display font-semibold text-ink group-hover:text-accent">{next.title}</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </article>
  )
}
